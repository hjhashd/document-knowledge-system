import { PageLayout } from "@/components/page-layout"
import { DocumentEditInterface } from "@/components/document-edit-interface"

export default function DocumentEditPage() {
  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">文档编辑</h2>
        </div>
        <DocumentEditInterface />
      </div>
    </PageLayout>
  )
}
