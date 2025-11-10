import { PageLayout } from "@/components/page-layout"
import { KnowledgeClassificationInterface } from "@/components/knowledge-classification-interface"

export default function KnowledgeClassificationPage() {
  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">知识分类</h2>
        </div>
        <KnowledgeClassificationInterface />
      </div>
    </PageLayout>
  )
}
