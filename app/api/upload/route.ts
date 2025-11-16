import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

export const runtime = 'nodejs'

// 处理同名文件，自动添加后缀
function getUniqueFileName(uploadDir: string, fileName: string): string {
  const ext = path.extname(fileName)
  const baseName = path.basename(fileName, ext)
  let uniqueFileName = fileName
  let counter = 1
  
  // 检查文件是否已存在
  while (fs.existsSync(path.join(uploadDir, uniqueFileName))) {
    uniqueFileName = `${baseName}(${counter})${ext}`
    counter++
  }
  
  return uniqueFileName
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as unknown as File | null
    if (!file) {
      return NextResponse.json({ ok: false, message: '缺少文件(file)' }, { status: 400 })
    }

    const originalName = (file as any).name || `upload-${Date.now()}`
    const buf = Buffer.from(await (file as any).arrayBuffer())

    // 直接保存到 public/upload 目录，不再创建子目录
    const uploadDir = path.join(process.cwd(), 'public', 'upload')
    await fs.promises.mkdir(uploadDir, { recursive: true })
    
    // 处理同名文件，自动添加后缀
    const uniqueFileName = getUniqueFileName(uploadDir, originalName)
    const filePath = path.join(uploadDir, uniqueFileName)
    await fs.promises.writeFile(filePath, buf)

    // 返回的路径不再包含唯一ID子目录
    const relativePath = `/upload/${encodeURIComponent(uniqueFileName)}`
    
    // publicBase 是你的 Next.js 应用的 URL
    const publicBase = process.env.NEXT_PUBLIC_BASE_URL || '' 
    // dsBase 是你的 OnlyOffice 服务器的 URL
    const dsBase = process.env.NEXT_PUBLIC_DS_BASE_URL || publicBase 

    const localUrl = `${publicBase}${relativePath}`
    
    const filesDirectBase = process.env.NEXT_PUBLIC_FILES_DIRECT_URL || ''
    const docUrl = filesDirectBase
      ? `${filesDirectBase}${relativePath}`
      : `${dsBase}/files${relativePath}`
    
    // 这是 OnlyOffice 保存后应该调用的 Next.js API 路由
    const nextJsCallbackUrl = `${dsBase}/onlyoffice-callback`

    if (/\.(docx)$/i.test(uniqueFileName)) {
      try {
        await rewriteDocxHyperlinks(filePath)
      } catch (e) {
        console.warn('重写超链接失败（忽略继续）:', e)
      }
    }

    return NextResponse.json({ 
      ok: true, 
      fileName: uniqueFileName, 
      savedPath: relativePath, 
      docUrl: docUrl,
      localUrl: localUrl,
      callbackUrl: nextJsCallbackUrl 
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || String(err) }, { status: 500 })
  }
}

// ... rewriteDocxHyperlinks 函数保持不变 ...
async function rewriteDocxHyperlinks(docxPath: string) {
  const buf = await fs.promises.readFile(docxPath)
  const zip = await JSZip.loadAsync(buf)

  const relFiles = [
    'word/_rels/document.xml.rels',
    'word/_rels/footer1.xml.rels',
    'word/_rels/footer2.xml.rels',
    'word/_rels/header1.xml.rels',
    'word/_rels/header2.xml.rels',
  ]

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
  const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '' })

  for (const relPath of relFiles) {
    const file = zip.file(relPath)
    if (!file) continue
    const xml = await file.async('string')
    const json = parser.parse(xml)

    const rels = json.Relationships?.Relationship
    if (!rels) continue

    const arr = Array.isArray(rels) ? rels : [rels]
    let changed = false

    for (const r of arr) {
      const target: string = r.Target || ''
      if (target.startsWith('file://')) {
        const encoded = encodeURIComponent(target)
        r.Target = `/open?target=${encoded}`
        changed = true
      }
    }

    if (changed) {
      const newXml = builder.build(json)
      zip.file(relPath, newXml)
    }
  }

  const out = await zip.generateAsync({ type: 'nodebuffer' })
  await fs.promises.writeFile(docxPath, out)
}