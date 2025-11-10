import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { DataManagementInterface } from "@/components/data-management-interface"

export default function DataManagementPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <DataManagementInterface />
        </main>
      </div>
    </div>
  )
}
