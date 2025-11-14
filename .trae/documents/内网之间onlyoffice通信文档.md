在 Next.js 项目根 .env（或 .env.local）新增：
+ NEXT_PUBLIC_BASE_URL=https://intranet.local:10443
+ NEXT_PUBLIC_DS_BASE_URL=http://intranet.local:10080
+ FILE_SERVE_WHITELIST=/app/public/upload:/app/public/save


https://intranet.local:10443是onlyoffice的欢迎页，http://intranet.local:10080
 是为了让用户即使输入 HTTP 地址也能安全访问
FILE_SERVE_WHITELIST = 文件服务白名单（允许访问的目录列表）
FILE_SERVE_WHITELIST=/app/public/upload:/app/public/save
                      ↑                  ↑
                   上传目录           保存目录


前端修改：
修改 1：API 路径
// 找到这一行（大约在第 130 行左右）
- const defaultApi = 'https://ai.faithindata.com.cn/office/web-apps/apps/api/documents/api.js'
+ const defaultApi = '/office/web-apps/apps/api/documents/api.js'

修改 2：document key 添加时间戳
// 找到 config 对象中的 key 配置（大约在第 160 行左右）
const config = {
  document: { 
    fileType: fileExt, 
-   key: `doc-${makeKeyFromUrl(docUrl)}`,
+   key: `doc-${makeKeyFromUrl(docUrl)}-${Date.now()}`,
    title, 
    url: localDocUrl
  },
  documentType: 'word',
  editorConfig: { 
    mode: 'edit', 
    callbackUrl: localCallbackUrl
  }
}


前端修改 - 页面初始化部分
文件：app/pdf-ocr-editor/page.tsx
找到 PDFOCREditorPage 主组件中的 useEffect（处理 URL 参数的部分）：
找到 PDFOCREditorPage 主组件中的 useEffect（处理 URL 参数的部分）：

// 找到这段代码（大约在第 200-230 行）
useEffect(() => {
  const fileName = searchParams.get('fileName') || "sample.pdf"
  const fileUrlParam = searchParams.get('fileUrl') || ""
  const docUrlParam = searchParams.get('docUrl') || ""
- const baseUrl = process.env.NEXT_PUBLIC_NGROK_BASE_URL || ""
+ const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
+ const dsBaseUrl = process.env.NEXT_PUBLIC_DS_BASE_URL || baseUrl
  
- const defaultCallbackUrl = baseUrl ? `${baseUrl}/onlyoffice-callback` : "/onlyoffice-callback"
+ const defaultCallbackUrl = `${dsBaseUrl}/onlyoffice-callback`
  
  const docNameParam = searchParams.get('docName') || (docUrlParam ? (docUrlParam.split('/').pop() || "") : "")
  const cbUrlParam = searchParams.get('callbackUrl') || defaultCallbackUrl
  
  const finalCallbackUrl = docNameParam ? `${cbUrlParam}${cbUrlParam.includes('?') ? '&' : '?'}fileName=${encodeURIComponent(docNameParam)}` : cbUrlParam

- const finalFileUrl = fileUrlParam || docUrlParam || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
+ const finalFileUrl = fileUrlParam || docUrlParam || `${baseUrl}/files/upload/dummy.pdf`

  setFileData({
    fileName,
    fileUrl: finalFileUrl
  })
  setDocUrl(docUrlParam)
  setDocName(docNameParam)
  setCallbackUrl(finalCallbackUrl)

  setTimeout(() => {
    setIsLoading(false)
  }, 1000)
}, [searchParams])


后端修改 - 上传接口
文件：app/api/upload/route.ts
修改 1：在文件顶部添加导入
typescriptimport { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
+ import JSZip from 'jszip'
+ import { XMLParser, XMLBuilder } from 'fast-xml-parser'


修改 2：添加超链接重写函数（在 POST 函数之前）
typescript+ // 重写 Word 文档中的 file:// 超链接
+ async function rewriteDocxHyperlinks(docxPath: string) {
+   const buf = await fs.promises.readFile(docxPath)
+   const zip = await JSZip.loadAsync(buf)
+ 
+   const relFiles = [
+     "word/_rels/document.xml.rels",
+     "word/_rels/footer1.xml.rels",
+     "word/_rels/footer2.xml.rels",
+     "word/_rels/header1.xml.rels",
+     "word/_rels/header2.xml.rels",
+   ]
+ 
+   const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" })
+   const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "" })
+ 
+   for (const relPath of relFiles) {
+     const file = zip.file(relPath)
+     if (!file) continue
+     const xml = await file.async("string")
+     const json = parser.parse(xml)
+ 
+     const rels = json.Relationships?.Relationship
+     if (!rels) continue
+ 
+     const arr = Array.isArray(rels) ? rels : [rels]
+     let changed = false
+ 
+     for (const r of arr) {
+       const target: string = r.Target || ""
+       if (target.startsWith("file://")) {
+         const encoded = encodeURIComponent(target)
+         r.Target = `/open?target=${encoded}`
+         changed = true
+       }
+     }
+ 
+     if (changed) {
+       const newXml = builder.build(json)
+       zip.file(relPath, newXml)
+     }
+   }
+ 
+   const out = await zip.generateAsync({ type: "nodebuffer" })
+   await fs.promises.writeFile(docxPath, out)
+ }

function getUniqueFileName(uploadDir: string, fileName: string): string {
  // ... 保持不变
}


修改 3：修改 POST 函数
typescriptexport async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as unknown as File | null
    if (!file) {
      return NextResponse.json({ ok: false, message: '缺少文件(file)' }, { status: 400 })
    }

    const originalName = (file as any).name || `upload-${Date.now()}`
    const buf = Buffer.from(await (file as any).arrayBuffer())

    const uploadDir = path.join(process.cwd(), 'public', 'upload')
    await fs.promises.mkdir(uploadDir, { recursive: true })
    
    const uniqueFileName = getUniqueFileName(uploadDir, originalName)
    const filePath = path.join(uploadDir, uniqueFileName)
    await fs.promises.writeFile(filePath, buf)

    const relativePath = `/upload/${encodeURIComponent(uniqueFileName)}`
    
-   const base = process.env.NEXT_PUBLIC_NGROK_BASE_URL || ''
-   const localUrl = `http://localhost:3000${relativePath}`
-   const publicUrl = base ? `${base}/files${relativePath}` : localUrl
+   const publicBase = process.env.NEXT_PUBLIC_BASE_URL || ''
+   const dsBase = process.env.NEXT_PUBLIC_DS_BASE_URL || publicBase
+   const localUrl = `${publicBase}${relativePath}`
+   const docUrl = `${dsBase}/files${relativePath}`

+   // 如果是 Word 文档，重写其中的超链接
+   if (/\.(docx)$/i.test(uniqueFileName)) {
+     try {
+       await rewriteDocxHyperlinks(filePath)
+     } catch (e) {
+       console.warn('重写超链接失败（忽略继续）:', e)
+     }
+   }

    return NextResponse.json({ 
      ok: true, 
      fileName: uniqueFileName, 
      savedPath: relativePath, 
-     docUrl: publicUrl,
-     localUrl: localUrl
+     docUrl,
+     localUrl
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || String(err) }, { status: 500 })
  }
}

6️ 后端修改 - 回调接口
文件：app/api/onlyoffice-callback/route.ts
typescript// 找到保存文件后返回的部分（大约在第 60-70 行）
      const saveDir = path.join(process.cwd(), 'public', 'save')
      await fs.promises.mkdir(saveDir, { recursive: true })
      const filePath = path.join(saveDir, fileName)

      await fs.promises.writeFile(filePath, buf)
      
-     const baseUrl = process.env.NEXT_PUBLIC_NGROK_BASE_URL || ''
-     const publicUrl = baseUrl ? `${baseUrl}/files/save/${encodeURIComponent(fileName)}` : `http://localhost:3000/save/${encodeURIComponent(fileName)}`
-     const localUrl = `http://localhost:3000/save/${encodeURIComponent(fileName)}`
+     const publicBase = process.env.NEXT_PUBLIC_BASE_URL || ''
+     const dsBase = process.env.NEXT_PUBLIC_DS_BASE_URL || publicBase
+     const localUrl = `${publicBase}/save/${encodeURIComponent(fileName)}`
+     const docUrl = `${dsBase}/files/save/${encodeURIComponent(fileName)}`
      
      return NextResponse.json({ 
        error: 0, 
        ok: true, 
        fileName, 
        savedPath: `/save/${fileName}`, 
-       publicUrl, 
-       localUrl
+       docUrl,
+       localUrl
      })


7️ 新增文件 - 超链接处理路由
新建文件：app/api/open/route.ts
typescript+ import { NextRequest, NextResponse } from 'next/server'
+ import path from 'path'
+ import fs from 'fs'
+ 
+ export const runtime = 'nodejs'
+ 
+ export async function GET(req: NextRequest) {
+   const url = new URL(req.url)
+   const target = url.searchParams.get('target') || ''
+   
+   if (!target) {
+     return NextResponse.redirect(new URL('/', req.url))
+   }
+ 
+   // 解码目标路径
+   let original = ''
+   try { 
+     original = decodeURIComponent(target) 
+   } catch { 
+     original = target 
+   }
+ 
+   // 提取文件名（file:///a/b/c.docx -> c.docx）
+   const baseName = path.basename(original)
+ 
+   // 白名单目录
+   const allowDirs = (process.env.FILE_SERVE_WHITELIST || '').split(':').filter(Boolean)
+   const defaultDirs = [
+     path.join(process.cwd(), 'public', 'upload'),
+     path.join(process.cwd(), 'public', 'save'),
+   ]
+   const roots = allowDirs.length ? allowDirs.map(d => 
+     path.isAbsolute(d) ? d : path.join(process.cwd(), d)
+   ) : defaultDirs
+ 
+   // 在白名单目录里找同名文件
+   let found: { abs: string, rel: string } | null = null
+   for (const root of roots) {
+     const abs = path.join(root, baseName)
+     
+     // 安全检查：防止路径遍历
+     const normalizedAbs = path.resolve(abs)
+     const normalizedRoot = path.resolve(root)
+     if (!normalizedAbs.startsWith(normalizedRoot)) {
+       continue
+     }
+     
+     if (fs.existsSync(abs)) {
+       // 计算相对路径
+       const publicDir = path.join(process.cwd(), 'public')
+       const rel = abs.replace(publicDir, '').replace(/\\/g, '/')
+       found = { abs, rel }
+       break
+     }
+   }
+ 
+   // 没找到：返回首页
+   if (!found) {
+     console.warn(`文件未找到: ${baseName}`)
+     return NextResponse.redirect(new URL('/', req.url))
+   }
+ 
+   const ext = path.extname(found.abs).toLowerCase()
+   const isOffice = ['.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt'].includes(ext)
+ 
+   const base = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`
+   const dsBase = process.env.NEXT_PUBLIC_DS_BASE_URL || base
+ 
+   if (isOffice) {
+     // 构造 OnlyOffice 打开的 URL
+     const docUrl = `${dsBase}/files${found.rel}`
+     const editorUrl = `${base}/pdf-ocr-editor?docUrl=${encodeURIComponent(docUrl)}&docName=${encodeURIComponent(baseName)}`
+     return NextResponse.redirect(editorUrl, 302)
+   } else {
+     // 其他类型直接预览/下载
+     const fileUrl = `${base}/files${found.rel}`
+     return NextResponse.redirect(fileUrl, 302)
+   }
+ }
