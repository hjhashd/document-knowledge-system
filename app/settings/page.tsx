import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SystemManagementPanel } from "@/components/system-management-panel"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <SystemManagementPanel />
        </main>
      </div>
    </div>
  )
}
