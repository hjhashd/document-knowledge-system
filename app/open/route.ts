import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const target = url.searchParams.get('target') || ''
  if (!target) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  let original = ''
  try {
    original = decodeURIComponent(target)
  } catch {
    original = target
  }

  const baseName = path.basename(original)

  const allowDirs = (process.env.FILE_SERVE_WHITELIST || '').split(':').filter(Boolean)
  const defaultDirs = [
    path.join(process.cwd(), 'public', 'upload'),
    path.join(process.cwd(), 'public', 'save'),
  ]
  const roots = allowDirs.length
    ? allowDirs.map(d => (path.isAbsolute(d) ? d : path.join(process.cwd(), d)))
    : defaultDirs

  let found: { abs: string; rel: string } | null = null
  for (const root of roots) {
    const abs = path.join(root, baseName)
    const normalizedAbs = path.resolve(abs)
    const normalizedRoot = path.resolve(root)
    if (!normalizedAbs.startsWith(normalizedRoot)) {
      continue
    }
    if (fs.existsSync(abs)) {
      const publicDir = path.join(process.cwd(), 'public')
      const rel = abs.replace(publicDir, '').replace(/\\/g, '/')
      found = { abs, rel }
      break
    }
  }

  if (!found) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const ext = path.extname(found.abs).toLowerCase()
  const isOffice = ['.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt'].includes(ext)

  const base = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`
  const dsBase = process.env.NEXT_PUBLIC_DS_BASE_URL || base

  if (isOffice) {
    const docUrl = `${dsBase}/files${found.rel}`
    const editorUrl = `${base}/pdf-ocr-editor?docUrl=${encodeURIComponent(docUrl)}&docName=${encodeURIComponent(baseName)}`
    return NextResponse.redirect(editorUrl, 302)
  } else {
    const fileUrl = `${base}/files${found.rel}`
    return NextResponse.redirect(fileUrl, 302)
  }
}
