"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Presentation,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Settings,
  Brain,
  Zap,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extractedEntities?: number
  extractedRelations?: number
  processingTime?: string
}

const supportedFormats = [
  { type: "PDF", icon: FileText, description: "PDF文档（文本型、扫描件、混合型）" },
  { type: "图像", icon: ImageIcon, description: "PNG、JPEG、TIFF、BMP格式图像" },
  { type: "Office", icon: FileSpreadsheet, description: "DOCX、PPTX、XLSX文档" },
  { type: "网页", icon: Globe, description: "HTML文档或URL抓取" },
  { type: "文本", icon: FileText, description: "TXT、RTF、ODT等文本格式" },
]

const processingTemplates = [
  { id: "contract", name: "合同文档", description: "专门用于合同条款和法律文档的解析" },
  { id: "report", name: "研究报告", description: "学术论文和研究报告的结构化分析" },
  { id: "financial", name: "财务文档", description: "财务报表和会计文档的数据提取" },
  { id: "technical", name: "技术文档", description: "技术规范和API文档的解析" },
  { id: "general", name: "通用模板", description: "适用于各种类型文档的通用解析" },
]

export function DocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("general")
  const [extractionSettings, setExtractionSettings] = useState({
    enableEntityExtraction: true,
    enableRelationExtraction: true,
    enableKnowledgeGraph: true,
    confidenceThreshold: 0.8,
    customInstructions: "",
  })

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Simulate upload and processing
      simulateFileProcessing(newFile.id)
    })
  }

  const simulateFileProcessing = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === "uploading") {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100)
            if (newProgress >= 100) {
              clearInterval(uploadInterval)
              // Start processing phase
              setTimeout(() => {
                setUploadedFiles((prev) =>
                  prev.map((f) => (f.id === fileId ? { ...f, status: "processing", progress: 0 } : f)),
                )
                simulateProcessing(fileId)
              }, 500)
              return { ...file, progress: 100, status: "uploading" }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 200)
  }

  const simulateProcessing = (fileId: string) => {
    const processingInterval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === "processing") {
            const newProgress = Math.min(file.progress + Math.random() * 15, 100)
            if (newProgress >= 100) {
              clearInterval(processingInterval)
              return {
                ...file,
                progress: 100,
                status: "completed",
                extractedEntities: Math.floor(Math.random() * 50) + 10,
                extractedRelations: Math.floor(Math.random() * 30) + 5,
                processingTime: `${Math.floor(Math.random() * 30) + 10}秒`,
              }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return FileText
    if (type.includes("image")) return ImageIcon
    if (type.includes("sheet") || type.includes("excel")) return FileSpreadsheet
    if (type.includes("presentation") || type.includes("powerpoint")) return Presentation
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">文档上传与处理</h1>
          <p className="text-muted-foreground mt-1">支持多种格式的智能文档解析和信息抽取</p>
        </div>
        <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
          <Zap className="w-3 h-3 mr-1" />
          AI 增强处理
        </Badge>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">文档上传</TabsTrigger>
          <TabsTrigger value="settings">处理设置</TabsTrigger>
          <TabsTrigger value="queue">处理队列</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Supported Formats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>支持的文档格式</span>
              </CardTitle>
              <CardDescription>系统支持多种文档格式的智能解析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportedFormats.map((format, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <format.icon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">{format.type}</h4>
                      <p className="text-sm text-muted-foreground">{format.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>上传文档</CardTitle>
              <CardDescription>拖拽文件到此区域或点击选择文件</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">上传您的文档</h3>
                <p className="text-muted-foreground mb-4">支持 PDF、图像、Office 文档等多种格式</p>
                <Button
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="bg-primary hover:bg-primary/90"
                >
                  选择文件
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.odt,.png,.jpg,.jpeg,.tiff,.bmp,.html"
                />
                <p className="text-xs text-muted-foreground mt-2">最大文件大小: 100MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>上传的文件</CardTitle>
                <CardDescription>文件处理状态和结果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type)
                    return (
                      <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <FileIcon className="w-8 h-8 text-primary" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-foreground truncate">{file.name}</h4>
                            <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{formatFileSize(file.size)}</p>

                          <div className="flex items-center space-x-4 mb-2">
                            {file.status === "uploading" && (
                              <>
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-600">上传中...</span>
                              </>
                            )}
                            {file.status === "processing" && (
                              <>
                                <Brain className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-yellow-600">AI 解析中...</span>
                              </>
                            )}
                            {file.status === "completed" && (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">处理完成</span>
                              </>
                            )}
                            {file.status === "error" && (
                              <>
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-600">处理失败</span>
                              </>
                            )}
                          </div>

                          <Progress value={file.progress} className="h-2 mb-2" />

                          {file.status === "completed" && (
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>实体: {file.extractedEntities}</span>
                              <span>关系: {file.extractedRelations}</span>
                              <span>用时: {file.processingTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span>处理模板</span>
              </CardTitle>
              <CardDescription>选择适合您文档类型的预设处理模板</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processingTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedTemplate === template.id ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      />
                      <h4 className="font-medium text-foreground">{template.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>抽取设置</CardTitle>
              <CardDescription>配置信息抽取和知识图谱构建参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entity-extraction"
                    checked={extractionSettings.enableEntityExtraction}
                    onCheckedChange={(checked) =>
                      setExtractionSettings((prev) => ({
                        ...prev,
                        enableEntityExtraction: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="entity-extraction">启用实体抽取</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="relation-extraction"
                    checked={extractionSettings.enableRelationExtraction}
                    onCheckedChange={(checked) =>
                      setExtractionSettings((prev) => ({
                        ...prev,
                        enableRelationExtraction: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="relation-extraction">启用关系抽取</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="knowledge-graph"
                    checked={extractionSettings.enableKnowledgeGraph}
                    onCheckedChange={(checked) =>
                      setExtractionSettings((prev) => ({
                        ...prev,
                        enableKnowledgeGraph: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="knowledge-graph">构建知识图谱</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence">置信度阈值</Label>
                <Select
                  value={extractionSettings.confidenceThreshold.toString()}
                  onValueChange={(value) =>
                    setExtractionSettings((prev) => ({
                      ...prev,
                      confidenceThreshold: Number.parseFloat(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.6">0.6 - 较低（更多结果）</SelectItem>
                    <SelectItem value="0.7">0.7 - 中等</SelectItem>
                    <SelectItem value="0.8">0.8 - 较高（推荐）</SelectItem>
                    <SelectItem value="0.9">0.9 - 很高（精确结果）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-instructions">自定义抽取指令</Label>
                <Textarea
                  id="custom-instructions"
                  placeholder="输入特定的抽取要求或关注点..."
                  value={extractionSettings.customInstructions}
                  onChange={(e) =>
                    setExtractionSettings((prev) => ({
                      ...prev,
                      customInstructions: e.target.value,
                    }))
                  }
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>处理队列状态</CardTitle>
              <CardDescription>当前系统处理能力和队列状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">等待处理</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-muted-foreground">正在处理</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">847</div>
                  <div className="text-sm text-muted-foreground">已完成</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
