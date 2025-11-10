import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DocumentUpload } from "@/components/document-upload"

export default function UploadPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <DocumentUpload />
        </main>
      </div>
    </div>
  )
}
