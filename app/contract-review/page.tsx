import { PageLayout } from "@/components/page-layout"
import { ContractReviewInterface } from "@/components/contract-review-interface"

export default function ContractReviewPage() {
  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">合同审查</h2>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">智能合同分析与风险识别</p>
          </div>
        </div>
        <ContractReviewInterface />
      </div>
    </PageLayout>
  )
}
