import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { InformationExtractionInterface } from "@/components/information-extraction-interface"

export default function InformationExtractionPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <InformationExtractionInterface />
        </main>
      </div>
    </div>
  )
}
