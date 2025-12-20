import script from "crypto-js"

export async function generateFileHash(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        // @ts-ignore
        const wordArray = script.lib.WordArray.create(event.target.result)
        const hash = script.SHA256(wordArray).toString()
        resolve(hash)
      } else {
        reject(new Error("Failed to read file"))
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
