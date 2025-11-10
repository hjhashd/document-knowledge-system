"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Shuffle,
  Upload,
  Download,
  FileText,
  ImageIcon,
  FileType,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
} from "lucide-react"
import { FileSpreadsheet } from "lucide-react" // Declare the missing variable

interface ConversionTask {
  id: string
  fileName: string
  sourceFormat: string
  targetFormat: string
  status: "pending" | "processing" | "completed" | "error"
  progress: number
  fileSize: string
  outputUrl?: string
  errorMessage?: string
}

export function FormatConversionInterface() {
  const [conversionTasks, setConversionTasks] = useState<ConversionTask[]>([])
  const [selectedSourceFormat, setSelectedSourceFormat] = useState("auto")
  const [selectedTargetFormat, setSelectedTargetFormat] = useState("docx")
  const [dragActive, setDragActive] = useState(false)

  const supportedFormats = {
    input: [
      { value: "auto", label: "自动检测", icon: FileType },
      { value: "pdf", label: "PDF", icon: FileText },
      { value: "ofd", label: "OFD", icon: FileText },
      { value: "jpg", label: "JPG", icon: ImageIcon },
      { value: "png", label: "PNG", icon: ImageIcon },
      { value: "tiff", label: "TIFF", icon: ImageIcon },
    ],
    output: [
      { value: "docx", label: "Word文档", icon: FileText },
      { value: "xlsx", label: "Excel表格", icon: FileSpreadsheet },
      { value: "txt", label: "纯文本", icon: FileText },
      { value: "md", label: "Markdown", icon: FileText },
      { value: "pdf", label: "PDF", icon: FileText },
      { value: "html", label: "HTML", icon: FileText },
    ],
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const newTasks: ConversionTask[] = files.map((file) => ({
      id: Date.now().toString() + Math.random(),
      fileName: file.name,
      sourceFormat: getFileExtension(file.name),
      targetFormat: selectedTargetFormat,
      status: "pending",
      progress: 0,
      fileSize: formatFileSize(file.size),
    }))

    setConversionTasks((prev) => [...prev, ...newTasks])
  }

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase() || "unknown"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const startConversion = (taskId: string) => {
    setConversionTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: "processing", progress: 0 } : task)),
    )

    // 模拟转换过程
    const interval = setInterval(() => {
      setConversionTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId && task.status === "processing") {
            const newProgress = task.progress + 10
            if (newProgress >= 100) {
              clearInterval(interval)
              return {
                ...task,
                status: "completed",
                progress: 100,
                outputUrl: `/converted/${task.fileName.replace(/\.[^/.]+$/, "")}.${task.targetFormat}`,
              }
            }
            return { ...task, progress: newProgress }
          }
          return task
        }),
      )
    }, 300)
  }

  const startAllConversions = () => {
    conversionTasks.filter((task) => task.status === "pending").forEach((task) => startConversion(task.id))
  }

  const removeTask = (taskId: string) => {
    setConversionTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const downloadFile = (task: ConversionTask) => {
    if (task.outputUrl) {
      // 模拟下载
      console.log("Downloading:", task.outputUrl)
    }
  }

  const getStatusIcon = (status: ConversionTask["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-gray-500" />
      case "processing":
        return <Play className="w-4 h-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">格式转换</h2>
          <p className="text-muted-foreground">支持图片/PDF/OFD转换为可编辑文档格式</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 上传和配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              文件上传
            </CardTitle>
            <CardDescription>选择要转换的文件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">拖拽文件到此处或点击选择</p>
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                accept=".pdf,.ofd,.jpg,.jpeg,.png,.tiff"
              />
              <Button variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  选择文件
                </label>
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>源格式</Label>
                <select
                  value={selectedSourceFormat}
                  onChange={(e) => setSelectedSourceFormat(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {supportedFormats.input.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>目标格式</Label>
                <select
                  value={selectedTargetFormat}
                  onChange={(e) => setSelectedTargetFormat(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {supportedFormats.output.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={startAllConversions}
              disabled={conversionTasks.filter((t) => t.status === "pending").length === 0}
              className="w-full"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              开始转换
            </Button>
          </CardContent>
        </Card>

        {/* 转换任务列表 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileType className="w-5 h-5" />
                转换任务
              </CardTitle>
              <CardDescription>查看转换进度和下载结果</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {conversionTasks.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">暂无转换任务，请上传文件开始转换</div>
                ) : (
                  <div className="space-y-3">
                    {conversionTasks.map((task) => (
                      <div key={task.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className="font-medium">{task.fileName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {task.sourceFormat.toUpperCase()} → {task.targetFormat.toUpperCase()}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeTask(task.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground mb-2">文件大小: {task.fileSize}</div>

                        {task.status === "processing" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>转换进度</span>
                              <span>{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} />
                          </div>
                        )}

                        {task.status === "completed" && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-600">转换完成</span>
                            <Button size="sm" onClick={() => downloadFile(task)}>
                              <Download className="w-4 h-4 mr-2" />
                              下载
                            </Button>
                          </div>
                        )}

                        {task.status === "error" && (
                          <div className="text-sm text-red-600">转换失败: {task.errorMessage || "未知错误"}</div>
                        )}

                        {task.status === "pending" && (
                          <div className="flex justify-end">
                            <Button size="sm" variant="outline" onClick={() => startConversion(task.id)}>
                              <Play className="w-4 h-4 mr-2" />
                              开始
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
