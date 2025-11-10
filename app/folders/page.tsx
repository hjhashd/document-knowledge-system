import { PageLayout } from "@/components/page-layout"
import { FolderManagementInterface } from "@/components/folder-management-interface"

export default function FoldersPage() {
  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">文件夹管理</h2>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">文档归类和层级管理</p>
          </div>
        </div>
        <FolderManagementInterface />
      </div>
    </PageLayout>
  )
}
