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
  fileName: string
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
      <CardHeader className="pb-3">
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
                transition: 'transform 0.3s ease'
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function OnlyOfficeEditor({ fileName }: OnlyOfficeEditorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 模拟OnlyOffice加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleReload = () => {
    setIsLoading(true)
    setError(null)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // 全屏切换
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Card className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Word 文档编辑</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              OnlyOffice
            </Badge>
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
              <Button onClick={handleReload} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                重新加载
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              {/* OnlyOffice工具栏占位 */}
              <div className="h-12 border-b bg-gray-50 flex items-center px-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">文件</Badge>
                  <Badge variant="outline" className="text-xs">开始</Badge>
                  <Badge variant="outline" className="text-xs">插入</Badge>
                  <Badge variant="outline" className="text-xs">布局</Badge>
                  <Badge variant="outline" className="text-xs">引用</Badge>
                </div>
              </div>
              
              {/* OnlyOffice编辑器内容区占位 */}
              <div className="flex-1 p-8 bg-white overflow-auto">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-2xl font-bold mb-4">{fileName.replace(/\.[^/.]+$/, "")}</h1>
                  <p className="text-gray-600 mb-4">
                    这是OnlyOffice编辑器的占位区域。在实际应用中，这里将集成OnlyOffice文档编辑器，
                    允许用户对Word文档进行实时编辑。
                  </p>
                  <p className="text-gray-600 mb-4">
                    OnlyOffice编辑器将提供以下功能：
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>富文本编辑功能</li>
                    <li>实时协作编辑</li>
                    <li>版本历史管理</li>
                    <li>评论和修订功能</li>
                    <li>文档格式保持</li>
                  </ul>
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-600">
                      <strong>注意：</strong> 此区域预留用于集成OnlyOffice文档编辑器。
                      实际集成需要配置OnlyOffice服务器并设置相应的API。
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'split' | 'pdf' | 'editor'>('split')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
    const fileUrl = searchParams.get('fileUrl') || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

    setFileData({
      fileName,
      fileUrl
    })

    // 模拟加载过程
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
              {/* 左侧 - PDF预览区域 */}
              <div className="w-full lg:w-1/2 h-full transition-all duration-300">
                <PDFPreview 
                  fileUrl={fileData.fileUrl} 
                  fileName={fileData.fileName}
                />
              </div>

              {/* 右侧 - OnlyOffice编辑器区域 */}
              <div className="w-full lg:w-1/2 h-full transition-all duration-300">
                <OnlyOfficeEditor 
                  fileName={fileData.fileName}
                />
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
                fileName={fileData.fileName}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}