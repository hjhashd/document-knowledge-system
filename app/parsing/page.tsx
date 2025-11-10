import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { DocumentParsingInterface } from "@/components/document-parsing-interface"

export default function DocumentParsingPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <DocumentParsingInterface />
        </main>
      </div>
    </div>
  )
}
