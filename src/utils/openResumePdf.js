export function openResumePdf(dataUrl) {
  if (!dataUrl) return

  try {
    const [header, base64] = dataUrl.split(",")
    if (!base64) {
      window.open(dataUrl, "_blank", "noopener,noreferrer")
      return
    }

    const mime = header.match(/data:([^;]+)/)?.[1] || "application/pdf"
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: mime })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener,noreferrer")
  } catch {
    window.open(dataUrl, "_blank", "noopener,noreferrer")
  }
}
