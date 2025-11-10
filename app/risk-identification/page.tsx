import { PageLayout } from "@/components/page-layout"
import { RiskIdentificationInterface } from "@/components/risk-identification-interface"

export default function RiskIdentificationPage() {
  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">风险识别</h2>
        </div>
        <RiskIdentificationInterface />
      </div>
    </PageLayout>
  )
}
