"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Search, Download, Eye, Zap } from "lucide-react"

interface SealInfo {
  id: string
  type: string
  confidence: number
  position: { x: number; y: number; width: number; height: number }
  text: string
  image: string
}

export function SealExtractionInterface() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedSeals, setExtractedSeals] = useState<SealInfo[]>([
    {
      id: "1",
      type: "公司印章",
      confidence: 95.8,
      position: { x: 450, y: 680, width: 120, height: 120 },
      text: "北京科技有限公司",
      image: "/placeholder-seal1.png",
    },
    {
      id: "2",
      type: "法人印章",
      confidence: 92.3,
      position: { x: 580, y: 720, width: 80, height: 80 },
      text: "张三",
      image: "/placeholder-seal2.png",
    },
  ])

  const handleExtraction = async () => {
    setIsProcessing(true)
    setProgress(0)

    // 模拟处理进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
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
          <CardDescription>上传需要进行公章抽取的合同文档，支持PDF、图片等格式</CardDescription>
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

      {/* 处理控制 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            公章识别设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">识别精度</label>
              <select className="w-full p-2 border rounded-md">
                <option>高精度（推荐）</option>
                <option>标准精度</option>
                <option>快速识别</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">印章类型</label>
              <select className="w-full p-2 border rounded-md">
                <option>全部类型</option>
                <option>公司印章</option>
                <option>法人印章</option>
                <option>财务印章</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">置信度阈值</label>
              <select className="w-full p-2 border rounded-md">
                <option>90%</option>
                <option>85%</option>
                <option>80%</option>
                <option>75%</option>
              </select>
            </div>
          </div>

          <Button onClick={handleExtraction} disabled={isProcessing} className="w-full">
            <Zap className="mr-2 h-4 w-4" />
            {isProcessing ? "正在识别..." : "开始识别公章"}
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
      {extractedSeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                识别结果
              </span>
              <Badge variant="secondary">{extractedSeals.length} 个印章</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">列表视图</TabsTrigger>
                <TabsTrigger value="preview">预览视图</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                {extractedSeals.map((seal) => (
                  <Card key={seal.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={seal.image || "/placeholder.svg"}
                            alt="印章"
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div>
                            <h4 className="font-medium">{seal.text}</h4>
                            <p className="text-sm text-gray-600">{seal.type}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">置信度: {seal.confidence}%</Badge>
                              <Badge variant="outline">
                                位置: ({seal.position.x}, {seal.position.y})
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
                  {/* 印章位置标记 */}
                  {extractedSeals.map((seal) => (
                    <div
                      key={seal.id}
                      className="absolute border-2 border-red-500 bg-red-500/20"
                      style={{
                        left: `${(seal.position.x / 800) * 100}%`,
                        top: `${(seal.position.y / 1000) * 100}%`,
                        width: `${(seal.position.width / 800) * 100}%`,
                        height: `${(seal.position.height / 1000) * 100}%`,
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded">
                        {seal.type}
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
      {extractedSeals.length > 0 && (
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
