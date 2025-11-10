import { PageLayout } from "@/components/page-layout"
import { KnowledgeExtractionInterface } from "@/components/knowledge-extraction-interface"

export default function KnowledgeExtractionPage() {
  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">知识提取</h2>
        </div>
        <KnowledgeExtractionInterface />
      </div>
    </PageLayout>
  )
}
