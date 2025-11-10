"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Network,
  Search,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Settings,
  Users,
  Building,
  MapPin,
  Calendar,
  Tag,
} from "lucide-react"

interface GraphNode {
  id: string
  label: string
  type: "person" | "organization" | "location" | "date" | "concept" | "document"
  size: number
  color: string
  x?: number
  y?: number
  connections: number
}

interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  weight: number
  type: "related_to" | "works_at" | "located_in" | "mentioned_in" | "part_of"
}

const sampleNodes: GraphNode[] = [
  { id: "1", label: "张三", type: "person", size: 20, color: "#be123c", connections: 5 },
  { id: "2", label: "ABC公司", type: "organization", size: 25, color: "#ec4899", connections: 8 },
  { id: "3", label: "北京", type: "location", size: 15, color: "#f59e0b", connections: 3 },
  { id: "4", label: "合同协议", type: "document", size: 18, color: "#10b981", connections: 6 },
  { id: "5", label: "2024年", type: "date", size: 12, color: "#6366f1", connections: 4 },
  { id: "6", label: "技术总监", type: "concept", size: 16, color: "#8b5cf6", connections: 2 },
  { id: "7", label: "李四", type: "person", size: 18, color: "#be123c", connections: 4 },
  { id: "8", label: "XYZ集团", type: "organization", size: 22, color: "#ec4899", connections: 7 },
  { id: "9", label: "上海", type: "location", size: 14, color: "#f59e0b", connections: 3 },
  { id: "10", label: "项目管理", type: "concept", size: 17, color: "#8b5cf6", connections: 5 },
]

const sampleEdges: GraphEdge[] = [
  { id: "e1", source: "1", target: "2", label: "工作于", weight: 0.8, type: "works_at" },
  { id: "e2", source: "2", target: "3", label: "位于", weight: 0.6, type: "located_in" },
  { id: "e3", source: "1", target: "4", label: "签署", weight: 0.9, type: "related_to" },
  { id: "e4", source: "4", target: "5", label: "日期", weight: 0.7, type: "mentioned_in" },
  { id: "e5", source: "1", target: "6", label: "担任", weight: 0.8, type: "related_to" },
  { id: "e6", source: "7", target: "8", label: "工作于", weight: 0.8, type: "works_at" },
  { id: "e7", source: "8", target: "9", label: "位于", weight: 0.6, type: "located_in" },
  { id: "e8", source: "7", target: "10", label: "负责", weight: 0.7, type: "related_to" },
  { id: "e9", source: "2", target: "8", label: "合作", weight: 0.5, type: "related_to" },
  { id: "e10", source: "4", target: "10", label: "涉及", weight: 0.6, type: "mentioned_in" },
]

const nodeTypeIcons = {
  person: Users,
  organization: Building,
  location: MapPin,
  date: Calendar,
  concept: Tag,
  document: Network,
}

const nodeTypeColors = {
  person: "#be123c",
  organization: "#ec4899",
  location: "#f59e0b",
  date: "#6366f1",
  concept: "#8b5cf6",
  document: "#10b981",
}

export function KnowledgeGraphVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<GraphNode[]>(sampleNodes)
  const [edges, setEdges] = useState<GraphEdge[]>(sampleEdges)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isAnimating, setIsAnimating] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [nodeSize, setNodeSize] = useState([15])
  const [edgeThickness, setEdgeThickness] = useState([2])

  // Initialize canvas and draw graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Initialize node positions if not set
    const updatedNodes = nodes.map((node) => {
      if (!node.x || !node.y) {
        return {
          ...node,
          x: Math.random() * (canvas.width - 100) + 50,
          y: Math.random() * (canvas.height - 100) + 50,
        }
      }
      return node
    })

    if (updatedNodes.some((node, index) => node.x !== nodes[index].x || node.y !== nodes[index].y)) {
      setNodes(updatedNodes)
    }

    drawGraph(ctx, updatedNodes, edges)
  }, [nodes, edges, zoomLevel, showLabels, nodeSize, edgeThickness])

  const drawGraph = (ctx: CanvasRenderingContext2D, graphNodes: GraphNode[], graphEdges: GraphEdge[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Apply zoom
    ctx.save()
    ctx.scale(zoomLevel, zoomLevel)

    // Draw edges
    graphEdges.forEach((edge) => {
      const sourceNode = graphNodes.find((n) => n.id === edge.source)
      const targetNode = graphNodes.find((n) => n.id === edge.target)

      if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.strokeStyle = `rgba(156, 163, 175, ${edge.weight})`
        ctx.lineWidth = edgeThickness[0]
        ctx.stroke()

        // Draw edge label
        if (showLabels) {
          const midX = (sourceNode.x + targetNode.x) / 2
          const midY = (sourceNode.y + targetNode.y) / 2
          ctx.fillStyle = "#6b7280"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(edge.label, midX, midY)
        }
      }
    })

    // Draw nodes
    graphNodes.forEach((node) => {
      if (node.x && node.y) {
        // Draw node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, (node.size * nodeSize[0]) / 15, 0, 2 * Math.PI)
        ctx.fillStyle = node.color
        ctx.fill()
        ctx.strokeStyle = selectedNode?.id === node.id ? "#000" : "#fff"
        ctx.lineWidth = selectedNode?.id === node.id ? 3 : 2
        ctx.stroke()

        // Draw node label
        if (showLabels) {
          ctx.fillStyle = "#1f2937"
          ctx.font = "12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(node.label, node.x, node.y + (node.size * nodeSize[0]) / 15 + 15)
        }
      }
    })

    ctx.restore()
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / zoomLevel
    const y = (event.clientY - rect.top) / zoomLevel

    // Find clicked node
    const clickedNode = nodes.find((node) => {
      if (!node.x || !node.y) return false
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      return distance <= (node.size * nodeSize[0]) / 15
    })

    setSelectedNode(clickedNode || null)
  }

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || node.type === filterType
    return matchesSearch && matchesType
  })

  const resetGraph = () => {
    setZoomLevel(1)
    setSelectedNode(null)
    setSearchTerm("")
    setFilterType("all")
  }

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  const exportGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "knowledge-graph.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">知识图谱可视化</h1>
          <p className="text-muted-foreground mt-1">交互式实体关系网络图谱</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
            <Network className="w-3 h-3 mr-1" />
            {nodes.length} 个节点
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary-foreground border-primary/20">
            {edges.length} 个关系
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">图谱视图</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetGraph}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={toggleAnimation}>
                    {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportGraph}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                className="w-full h-full border-t cursor-pointer"
                onClick={handleCanvasClick}
                style={{ height: "520px" }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>搜索与筛选</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">搜索节点</Label>
                <Input
                  id="search"
                  placeholder="输入实体名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter">节点类型</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="person">人员</SelectItem>
                    <SelectItem value="organization">机构</SelectItem>
                    <SelectItem value="location">地点</SelectItem>
                    <SelectItem value="date">日期</SelectItem>
                    <SelectItem value="concept">概念</SelectItem>
                    <SelectItem value="document">文档</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>显示设置</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-labels">显示标签</Label>
                <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
              </div>

              <div className="space-y-2">
                <Label>节点大小</Label>
                <Slider value={nodeSize} onValueChange={setNodeSize} max={30} min={5} step={1} className="w-full" />
              </div>

              <div className="space-y-2">
                <Label>连线粗细</Label>
                <Slider
                  value={edgeThickness}
                  onValueChange={setEdgeThickness}
                  max={5}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Node Details */}
          {selectedNode && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">节点详情</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  {(() => {
                    const IconComponent = nodeTypeIcons[selectedNode.type]
                    return <IconComponent className="w-4 h-4" style={{ color: selectedNode.color }} />
                  })()}
                  <span className="font-medium">{selectedNode.label}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">类型:</span>
                    <Badge variant="secondary">{selectedNode.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">连接数:</span>
                    <span>{selectedNode.connections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">重要度:</span>
                    <span>{selectedNode.size}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  查看详细信息
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">图例</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(nodeTypeIcons).map(([type, IconComponent]) => (
                  <div key={type} className="flex items-center space-x-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: nodeTypeColors[type as keyof typeof nodeTypeColors] }}
                    />
                    <IconComponent className="w-3 h-3" />
                    <span className="capitalize">
                      {type === "person"
                        ? "人员"
                        : type === "organization"
                          ? "机构"
                          : type === "location"
                            ? "地点"
                            : type === "date"
                              ? "日期"
                              : type === "concept"
                                ? "概念"
                                : "文档"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-chart-1" />
              <div>
                <div className="text-2xl font-bold">{nodes.filter((n) => n.type === "person").length}</div>
                <div className="text-sm text-muted-foreground">人员实体</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-chart-2" />
              <div>
                <div className="text-2xl font-bold">{nodes.filter((n) => n.type === "organization").length}</div>
                <div className="text-sm text-muted-foreground">机构实体</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-chart-3" />
              <div>
                <div className="text-2xl font-bold">{edges.length}</div>
                <div className="text-sm text-muted-foreground">关系连接</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-chart-4" />
              <div>
                <div className="text-2xl font-bold">{nodes.filter((n) => n.type === "concept").length}</div>
                <div className="text-sm text-muted-foreground">概念实体</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
