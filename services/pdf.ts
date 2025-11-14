import http from "@/lib/http"

export interface UploadPdfResponse {
  save_path?: string
  [key: string]: any
}

export async function uploadPdf(file: File): Promise<UploadPdfResponse> {
  const form = new FormData()
  form.append("file", file, file.name)
  return http.post<UploadPdfResponse>("/upload_pdf/", form)
}
