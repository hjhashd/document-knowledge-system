import { PageLayout } from "@/components/page-layout"
import { DataExportInterface } from "@/components/data-export-interface"

export default function DataExportPage() {
  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">数据导出</h2>
        </div>
        <DataExportInterface />
      </div>
    </PageLayout>
  )
}
