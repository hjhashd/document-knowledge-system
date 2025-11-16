"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Download, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Edit3,
  Maximize2,
  Minimize2
} from "lucide-react"

interface PDFPreviewProps {
  fileUrl: string
  fileName: string
}

interface OnlyOfficeEditorProps {
  docUrl: string
  docName?: string
  callbackUrl?: string
}

function PDFPreview({ fileUrl, fileName }: PDFPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100) // 恢复默认缩放比例为100%
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 加载状态处理
  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError("无法加载PDF文件，请检查文件是否有效")
  }

  // 重新加载
  const handleReload = () => {
    setIsLoading(true)
    setError(null)
    if (iframeRef.current) {
      iframeRef.current.src = fileUrl
    }
  }

  // 缩放控制
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25))
  }

  const handleZoomReset = () => {
    setZoom(100) // 重置为默认100%
  }

  // 旋转控制
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  // 全屏切换
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // 更新iframe参数
  useEffect(() => {
    if (iframeRef.current && fileUrl) {
      const pdfUrl = `${fileUrl}#zoom=${zoom}&rotation=${rotation}`
      iframeRef.current.src = pdfUrl
    }
  }, [fileUrl, zoom, rotation])

  return (
    <Card className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardHeader className={`${isFullscreen ? 'flex-shrink-0' : ''} pb-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">PDF 预览</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[50px] text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            {error && (
              <Button variant="outline" size="sm" onClick={handleReload}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden" ref={containerRef}>
        <div className="relative w-full h-full bg-white">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">正在加载PDF...</p>
              </div>
            </div>
          )}
          
          {error ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <Button onClick={handleReload} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                重新加载
              </Button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={fileUrl}
              className="w-full h-full border-0"
              title={`PDF预览: ${fileName}`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center',
                transition: 'transform 0.3s ease',
                minHeight: '100%'
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function OnlyOfficeEditor({ docUrl, docName, callbackUrl }: OnlyOfficeEditorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editorRef = useRef<any>(null)
  const makeKeyFromUrl = (url: string) => {
    let h = 0
    for (let i = 0; i < url.length; i++) {
      h = (h * 31 + url.charCodeAt(i)) >>> 0
    }
    return h.toString(36)
  }

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    if (!docUrl) {
      setError('缺少文档URL（docUrl）')
      setIsLoading(false)
      return
    }

    const fileExt = docUrl.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase() || 'docx'
    const title = docName || docUrl.split('/').pop() || `文档-${Date.now()}`
    const cbUrl = callbackUrl || '/onlyoffice-callback'

    // --- 开始：添加这段新逻辑 ---

    // 1. 定义可编辑的类型
    const EDITABLE_TYPES = ['docx', 'xlsx', 'pptx', 'doc', 'xls', 'ppt']
    // 2. 检查当前文件是否可编辑
   const isEditable = EDITABLE_TYPES.includes(fileExt);
// [!! 修复 !!] 确保 PDF 也使用 'edit' 模式来触发转换
const editorMode = (isEditable || fileExt === 'pdf') ? 'edit' : 'view';

    // 4. 动态设置编辑器类型
    let docType = 'word'; // 默认是 Word
    if (['xlsx', 'xls', 'csv'].includes(fileExt)) {
      docType = 'spreadsheet';
    } else if (['pptx', 'ppt'].includes(fileExt)) {
      docType = 'presentation';
    }
    // --- 结束：新逻辑 ---
    
    const init = () => {
      try {
        // @ts-ignore
        const DocsAPI = (window as any).DocsAPI
        if (!DocsAPI) {
          setError('OnlyOffice API 未加载')
          setIsLoading(false)
          return
        }
        if (editorRef.current && typeof editorRef.current.destroyEditor === 'function') {
          editorRef.current.destroyEditor()
          editorRef.current = null
        }
        
        // 确保文档URL和回调URL都是公网可访问的
        const publicDocUrl = docUrl.startsWith('http') ? docUrl : `${window.location.origin}${docUrl}`
        const publicCallbackUrl = callbackUrl.startsWith('http') ? callbackUrl : `${window.location.origin}${callbackUrl}`
        
       const config = {
        document: {
          fileType: fileExt,
          key: `doc-${makeKeyFromUrl(docUrl)}-${Date.now()}`, // 确保你有 makeKeyFromUrl 函数
          title,
          url: publicDocUrl // (这里就是我之前打错 "_" 符号的地方，保持这行原样)
        },
        documentType: docType, // <-- ★★★ 修改点 1：使用变量 docType
        editorConfig: {
          mode: editorMode, // <-- ★★★ 修改点 2：使用变量 editorMode
          callbackUrl: publicCallbackUrl
        }
      };
        // @ts-ignore
        editorRef.current = new DocsAPI.DocEditor('onlyoffice-editor-container', config)
        setIsLoading(false)
      } catch (e: any) {
        setError(e?.message || String(e))
        setIsLoading(false)
      }
    }

    // 加载 DocsAPI 脚本（来源于文档服务器）
    // 如需修改地址，可通过 query 参数 docsApi 指定
    const defaultApi = process.env.NEXT_PUBLIC_ONLYOFFICE_API_URL || '/office/web-apps/apps/api/documents/api.js'
    const docsApi = defaultApi
    // 已加载则直接初始化
    // @ts-ignore
    if ((window as any).DocsAPI) {
      init()
      return
    }
    let scriptEl = document.querySelector('script[data-onlyoffice-api]') as HTMLScriptElement | null
    if (!scriptEl) {
      scriptEl = document.createElement('script')
      scriptEl.type = 'text/javascript'
      scriptEl.src = docsApi
      scriptEl.setAttribute('data-onlyoffice-api', 'true')
      scriptEl.onload = init
      scriptEl.onerror = () => {
        const fallback = '/office/web-apps/apps/api/documents/api.js'
        if (docsApi !== fallback) {
          const s2 = document.createElement('script')
          s2.type = 'text/javascript'
          s2.src = fallback
          s2.setAttribute('data-onlyoffice-api', 'true')
          s2.onload = init
          s2.onerror = () => {
            setError('无法加载 OnlyOffice API 脚本')
            setIsLoading(false)
          }
          document.head.appendChild(s2)
        } else {
          setError('无法加载 OnlyOffice API 脚本')
          setIsLoading(false)
        }
      }
      document.head.appendChild(scriptEl)
    } else {
      scriptEl.addEventListener('load', init, { once: true })
    }

    return () => {
      try {
        if (editorRef.current && typeof editorRef.current.destroyEditor === 'function') {
          editorRef.current.destroyEditor()
        }
      } catch {}
      editorRef.current = null
    }
  }, [docUrl, docName, callbackUrl])

  return (
    <Card className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Word 文档编辑</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">OnlyOffice</Badge>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="relative w-full h-full bg-white">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">正在加载OnlyOffice编辑器...</p>
              </div>
            </div>
          )}
          {error ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
            </div>
          ) : (
            <div id="onlyoffice-editor-container" className="w-full h-full" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PDFOCREditorPage() {
  const searchParams = useSearchParams()
  const [fileData, setFileData] = useState({
    fileName: "",
    fileUrl: ""
  })
  const [docUrl, setDocUrl] = useState<string>("")
  const [docName, setDocName] = useState<string>("")
  const [callbackUrl, setCallbackUrl] = useState<string>("/onlyoffice-callback")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'split' | 'pdf' | 'editor'>('split')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
// ★ 新增一个判断：
  const isPdf = docName.toLowerCase().endsWith('.pdf')
  // 监听侧边栏切换事件
  useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarCollapsed(prev => !prev)
    }

    window.addEventListener('toggleSidebar', handleToggleSidebar)
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggleSidebar)
    }
  }, [])

  // 从URL参数获取文件信息
  useEffect(() => {
    const fileName = searchParams.get('fileName') || "sample.pdf"
    const fileUrlParam = searchParams.get('fileUrl') || ""
    const docUrlParam = searchParams.get('docUrl') || ""
    const docNameParam = searchParams.get('docName') || (docUrlParam ? (docUrlParam.split('/').pop() || "") : "")
    const cbUrlParam = searchParams.get('callbackUrl') || "/onlyoffice-callback"
    
    // 将自定义文件名添加到回调 URL 中
    const finalCallbackUrl = docNameParam ? `${cbUrlParam}${cbUrlParam.includes('?') ? '&' : '?'}fileName=${encodeURIComponent(docNameParam)}` : cbUrlParam

    const finalFileUrl = fileUrlParam || docUrlParam || `/files/upload/dummy.pdf`

    setFileData({
      fileName,
      fileUrl: finalFileUrl
    })
    setDocUrl(docUrlParam)
    setDocName(docNameParam)
    setCallbackUrl(finalCallbackUrl)

    // 判断是否为 Word 文档 (或 Excel/PPT 等未来可能支持的格式)
    const isOfficeDoc = docNameParam.toLowerCase().endsWith('.docx') || 
                        docNameParam.toLowerCase().endsWith('.xlsx') || 
                        docNameParam.toLowerCase().endsWith('.pptx');
                        
    if (isOfficeDoc) {
      // 如果是 Office 文档，强制使用 'editor' 视图
      setViewMode('editor');
    } else {
      // 否则 (PDF)，使用默认的 'split' 视图
      setViewMode('split');
    }

    // ==========================================================
  // ★★★ 在这里添加打印语句 ★★★
  // ==========================================================
  console.log("OnlyOffice 最终收到的参数:", {
    fileUrl_For_PDFPreview: finalFileUrl, // 这个给左侧 PDF 预览
    docUrl_For_OnlyOffice: docUrlParam,   // ★ 这个给 OnlyOffice 编辑器
    callbackUrl_For_OnlyOffice: finalCallbackUrl // ★ 这个给 OnlyOffice 回调
  });
  // ==========================================================

    // 减少模拟加载时间
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载文档...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 简洁的页面头部 */}
      <div className="border-b px-4 md:px-6 py-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-gray-900">文档编辑器</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {fileData.fileName}
            </Badge>
            {/* 响应式视图切换按钮 */}
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <Button
                variant={viewMode === 'split' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('split')}
                className="h-7 px-2 text-xs"
              >
                分屏
              </Button>
              <Button
                variant={viewMode === 'pdf' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('pdf')}
                className="h-7 px-2 text-xs"
              >
                PDF
              </Button>
              <Button
                variant={viewMode === 'editor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('editor')}
                className="h-7 px-2 text-xs"
              >
                编辑
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 响应式布局 */}
      <div className={`h-[calc(100vh-80px)] p-4 md:p-6 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : ''}`}>
        <div className={`h-full ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto transition-all duration-300`}>
          {/* 分屏视图 */}
          {viewMode === 'split' && (
            <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">
              
              {/* ★★★ 修改左侧 - PDF预览区域 ★★★ */}
              <div className="w-full lg:w-1/2 h-full transition-all duration-300 border-r border-gray-200 overflow-auto">
                
                {isPdf ? (
                  // 1. 如果是 PDF，正常显示
                  <PDFPreview 
                    fileUrl={fileData.fileUrl} 
                    fileName={fileData.fileName}
                  />
                ) : (
                  // 2. 如果不是 PDF (e.g. .docx)，显示一个提示，而不是加载 iframe
                  <Card className="h-full flex items-center justify-center bg-gray-50">
                    <CardContent className="text-center p-6">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg">不支持分屏预览</h3>
                      <p className="text-muted-foreground text-sm mt-2">此文件类型 (.docx) 无法在左侧预览。<br/>请使用 "编辑" 视图进行操作。</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* 右侧 - OnlyOffice编辑器区域 (这部分我们上次已经改好了，保持不变) */}
              <div className="w-full lg:w-1/2 h-full transition-all duration-300">
                {isPdf ? (
                  <PDFPreview 
                    fileUrl={fileData.fileUrl} 
                    fileName={fileData.fileName}
                  />
                ) : (
                  <OnlyOfficeEditor 
                    docUrl={docUrl}
                    docName={docName}
                    callbackUrl={callbackUrl}
                  />
                )}
              </div>
            </div>
          )}

          {/* 仅PDF视图 */}
          {viewMode === 'pdf' && (
            <div className="h-full">
              <PDFPreview 
                fileUrl={fileData.fileUrl} 
                fileName={fileData.fileName}
              />
            </div>
          )}

          {/* 仅编辑器视图 */}
          {viewMode === 'editor' && (
            <div className="h-full">
              <OnlyOfficeEditor 
                docUrl={docUrl}
                docName={docName}
                callbackUrl={callbackUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
