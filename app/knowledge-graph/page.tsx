import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KnowledgeGraphVisualization } from "@/components/knowledge-graph-visualization"

export default function KnowledgeGraphPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <KnowledgeGraphVisualization />
        </main>
      </div>
    </div>
  )
}
