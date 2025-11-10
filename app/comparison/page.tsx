import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { DocumentComparisonInterface } from "@/components/document-comparison-interface"

export default function DocumentComparisonPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <DocumentComparisonInterface />
        </main>
      </div>
    </div>
  )
}
