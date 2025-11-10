import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { IntelligentQA } from "@/components/intelligent-qa"

export default function QAPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <IntelligentQA />
        </main>
      </div>
    </div>
  )
}
