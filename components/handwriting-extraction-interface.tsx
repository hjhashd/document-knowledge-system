"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, PenTool, Download, Eye, Zap, Type } from "lucide-react"

interface HandwritingInfo {
  id: string
  type: string
  confidence: number
  position: { x: number; y: number; width: number; height: number }
  text: string
  image: string
}

export function HandwritingExtractionInterface() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedHandwriting, setExtractedHandwriting] = useState<HandwritingInfo[]>([
    {
      id: "1",
      type: "签名",
      confidence: 94.2,
      position: { x: 500, y: 750, width: 150, height: 60 },
      text: "张三",
      image: "/handwritten-signature.png",
    },
    {
      id: "2",
      type: "批注",
      confidence: 88.7,
      position: { x: 200, y: 300, width: 200, height: 40 },
      text: "同意此方案",
      image: "/placeholder-annotation.png",
    },
  ])

  const handleExtraction = async () => {
    setIsProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 8
      })
    }, 250)
  }

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            文档上传
          </CardTitle>
          <CardDescription>上传包含手写内容的文档，系统将自动识别签名和批注</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">点击上传或拖拽文件到此处</p>
            <p className="text-xs text-gray-500 mt-1">支持 PDF, JPG, PNG 格式，最大 50MB</p>
            <Button className="mt-4">选择文件</Button>
          </div>
        </CardContent>
      </Card>

      {/* 识别设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            手写识别设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">识别类型</label>
              <select className="w-full p-2 border rounded-md">
                <option>全部类型</option>
                <option>仅签名</option>
                <option>仅批注</option>
                <option>仅手写文字</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">识别精度</label>
              <select className="w-full p-2 border rounded-md">
                <option>高精度（推荐）</option>
                <option>标准精度</option>
                <option>快速识别</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">语言设置</label>
              <select className="w-full p-2 border rounded-md">
                <option>中文</option>
                <option>英文</option>
                <option>中英混合</option>
              </select>
            </div>
          </div>

          <Button onClick={handleExtraction} disabled={isProcessing} className="w-full">
            <Zap className="mr-2 h-4 w-4" />
            {isProcessing ? "正在识别..." : "开始识别手写内容"}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>识别进度</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 识别结果 */}
      {extractedHandwriting.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                识别结果
              </span>
              <Badge variant="secondary">{extractedHandwriting.length} 处手写内容</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">列表视图</TabsTrigger>
                <TabsTrigger value="preview">预览视图</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                {extractedHandwriting.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt="手写内容"
                            className="w-20 h-12 object-cover rounded border"
                          />
                          <div>
                            <h4 className="font-medium">{item.text}</h4>
                            <p className="text-sm text-gray-600">{item.type}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">置信度: {item.confidence}%</Badge>
                              <Badge variant="outline">
                                位置: ({item.position.x}, {item.position.y})
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            保存
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="preview">
                <div className="relative border rounded-lg p-4 bg-gray-50">
                  <img src="/placeholder-document.png" alt="文档预览" className="w-full max-w-2xl mx-auto" />
                  {/* 手写内容位置标记 */}
                  {extractedHandwriting.map((item) => (
                    <div
                      key={item.id}
                      className="absolute border-2 border-blue-500 bg-blue-500/20"
                      style={{
                        left: `${(item.position.x / 800) * 100}%`,
                        top: `${(item.position.y / 1000) * 100}%`,
                        width: `${(item.position.width / 800) * 100}%`,
                        height: `${(item.position.height / 1000) * 100}%`,
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1 rounded">
                        {item.type}: {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* 导出选项 */}
      {extractedHandwriting.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              导出结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="w-full bg-transparent">
                导出为 JSON
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                导出为 Excel
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                导出图片
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                生成报告
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
