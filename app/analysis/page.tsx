import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DocumentAnalysisDashboard } from "@/components/document-analysis-dashboard"

export default function AnalysisPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <DocumentAnalysisDashboard />
        </main>
      </div>
    </div>
  )
}
