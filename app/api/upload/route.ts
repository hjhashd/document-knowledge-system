import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
    const base = process.env.NEXT_PUBLIC_NGROK_BASE_URL || ''
    const docUrl = base ? `${base}${relativePath}` : relativePath

    return NextResponse.json({ ok: true, fileName: uniqueFileName, savedPath: relativePath, docUrl })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || String(err) }, { status: 500 })
  }
}