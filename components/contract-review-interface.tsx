"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Stamp,
  PenTool,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
} from "lucide-react"

interface SealInfo {
  id: string
  type: string
  position: { x: number; y: number }
  confidence: number
  image: string
  status: "valid" | "invalid" | "suspicious"
}

interface HandwritingInfo {
  id: string
  text: string
  type: "signature" | "annotation" | "correction"
  position: { x: number; y: number }
  confidence: number
  image: string
}

interface RiskItem {
  id: string
  type: "high" | "medium" | "low"
  category: string
  description: string
  suggestion: string
  location: string
  confidence: number
}

export function ContractReviewInterface() {
  const [activeTab, setActiveTab] = useState("seal-extraction")
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Mock data
  const sealData: SealInfo[] = [
    {
      id: "1",
      type: "公司公章",
      position: { x: 450, y: 680 },
      confidence: 0.95,
      image: "/placeholder-py9h0.png",
      status: "valid",
    },
    {
      id: "2",
      type: "法人章",
      position: { x: 520, y: 680 },
      confidence: 0.88,
      image: "/placeholder-as275.png",
      status: "valid",
    },
    {
      id: "3",
      type: "财务章",
      position: { x: 380, y: 720 },
      confidence: 0.72,
      image: "/placeholder-ypy3l.png",
      status: "suspicious",
    },
  ]

  const handwritingData: HandwritingInfo[] = [
    {
      id: "1",
      text: "张三",
      type: "signature",
      position: { x: 400, y: 650 },
      confidence: 0.92,
      image: "/handwritten-signature.png",
    },
    {
      id: "2",
      text: "2024.1.15",
      type: "annotation",
      position: { x: 500, y: 650 },
      confidence: 0.87,
      image: "/placeholder-719o6.png",
    },
    {
      id: "3",
      text: "已审核",
      type: "annotation",
      position: { x: 350, y: 200 },
      confidence: 0.79,
      image: "/placeholder-4ljrv.png",
    },
  ]

  const riskData: RiskItem[] = [
    {
      id: "1",
      type: "high",
      category: "条款风险",
      description: "违约责任条款不明确，可能导致纠纷",
      suggestion: "建议明确违约责任的具体承担方式和赔偿标准",
      location: "第5条第2款",
      confidence: 0.89,
    },
    {
      id: "2",
      type: "medium",
      category: "法律风险",
      description: "合同期限表述模糊",
      suggestion: "建议明确合同的具体起止时间",
      location: "第2条",
      confidence: 0.76,
    },
    {
      id: "3",
      type: "low",
      category: "格式风险",
      description: "部分条款格式不规范",
      suggestion: "建议统一条款编号格式",
      location: "第3-4条",
      confidence: 0.65,
    },
  ]

  const handleStartProcessing = () => {
    setProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setProcessing(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const getRiskColor = (type: string) => {
    switch (type) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "invalid":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "suspicious":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Processing Status */}
      {processing && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            正在处理合同文档... {progress}%
            <Progress value={progress} className="mt-2" />
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="seal-extraction" className="flex items-center gap-2">
            <Stamp className="h-4 w-4" />
            公章抽取
          </TabsTrigger>
          <TabsTrigger value="handwriting-extraction" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            手写文字提取
          </TabsTrigger>
          <TabsTrigger value="risk-identification" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            风险识别
          </TabsTrigger>
        </TabsList>

        {/* 公章抽取 */}
        <TabsContent value="seal-extraction" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">公章识别与抽取</h3>
              <p className="text-sm text-muted-foreground">自动识别合同中的各类印章并支持截图保存</p>
            </div>
            <Button onClick={handleStartProcessing} disabled={processing}>
              <Eye className="mr-2 h-4 w-4" />
              开始识别
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  文档预览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-50 rounded-lg p-4 h-96 overflow-hidden">
                  <img src="/contract-document-with-seals.jpg" alt="合同文档" className="w-full h-full object-contain" />
                  {/* 标记公章位置 */}
                  {sealData.map((seal) => (
                    <div
                      key={seal.id}
                      className="absolute border-2 border-red-500 rounded-full"
                      style={{
                        left: `${(seal.position.x / 600) * 100}%`,
                        top: `${(seal.position.y / 800) * 100}%`,
                        width: "60px",
                        height: "60px",
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded">
                        {seal.type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>识别结果</CardTitle>
                <CardDescription>共识别到 {sealData.length} 个印章</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {sealData.map((seal) => (
                      <div key={seal.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img
                          src={seal.image || "/placeholder.svg"}
                          alt={seal.type}
                          className="w-12 h-12 rounded border"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{seal.type}</span>
                            {getStatusIcon(seal.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">置信度: {(seal.confidence * 100).toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">
                            位置: ({seal.position.x}, {seal.position.y})
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Camera className="h-3 w-3 mr-1" />
                            截图
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 手写文字提取 */}
        <TabsContent value="handwriting-extraction" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">手写文字识别</h3>
              <p className="text-sm text-muted-foreground">识别手写签名和批注内容并支持截图保存</p>
            </div>
            <Button onClick={handleStartProcessing} disabled={processing}>
              <PenTool className="mr-2 h-4 w-4" />
              开始识别
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>手写内容分类</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <PenTool className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">签名</span>
                    </div>
                    <Badge variant="secondary">{handwritingData.filter((h) => h.type === "signature").length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="font-medium">批注</span>
                    </div>
                    <Badge variant="secondary">{handwritingData.filter((h) => h.type === "annotation").length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">修改</span>
                    </div>
                    <Badge variant="secondary">{handwritingData.filter((h) => h.type === "correction").length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>识别详情</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {handwritingData.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.text}
                          className="w-16 h-8 rounded border bg-gray-50"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.text}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.type === "signature" ? "签名" : item.type === "annotation" ? "批注" : "修改"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">置信度: {(item.confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Camera className="h-3 w-3 mr-1" />
                            截图
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 风险识别 */}
        <TabsContent value="risk-identification" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">合同风险识别</h3>
              <p className="text-sm text-muted-foreground">自动标记合同风险点并提供修改建议</p>
            </div>
            <Button onClick={handleStartProcessing} disabled={processing}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              开始分析
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">高风险</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {riskData.filter((r) => r.type === "high").length}
                </div>
                <p className="text-sm text-muted-foreground">需要立即处理</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">中风险</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {riskData.filter((r) => r.type === "medium").length}
                </div>
                <p className="text-sm text-muted-foreground">建议优化</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">低风险</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {riskData.filter((r) => r.type === "low").length}
                </div>
                <p className="text-sm text-muted-foreground">可选优化</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>风险详情</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {riskData.map((risk) => (
                    <div key={risk.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getRiskColor(risk.type) as any}>
                            {risk.type === "high" ? "高风险" : risk.type === "medium" ? "中风险" : "低风险"}
                          </Badge>
                          <span className="font-medium">{risk.category}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{risk.location}</span>
                      </div>
                      <p className="text-sm mb-2">{risk.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>建议:</strong> {risk.suggestion}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          置信度: {(risk.confidence * 100).toFixed(1)}%
                        </span>
                        <Button size="sm" variant="outline">
                          查看详情
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
