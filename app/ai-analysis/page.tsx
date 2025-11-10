import { PageLayout } from "@/components/page-layout"
import { AIAnalysisInterface } from "@/components/ai-analysis-interface"

export default function AIAnalysisPage() {
  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">AI文档解读</h2>
        </div>
        <AIAnalysisInterface />
      </div>
    </PageLayout>
  )
}
