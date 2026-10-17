export const maxFileSize = 10 * 1024 * 1024

const allowedTypes: Record<string, string[]> = {
  png: ['image/png'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  gif: ['image/gif'],
  webp: ['image/webp'],
  pdf: ['application/pdf'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  txt: ['text/plain'],
}

export const acceptedFiles = Object.keys(allowedTypes).map((extension) => `.${extension}`).join(',')

export function validateFile(file: Pick<File, 'name' | 'size' | 'type'>): 'type' | 'size' | null {
  const extension = file.name.match(/\.([^.]+)$/)?.[1].toLowerCase() ?? ''
  const mimeTypes = Object.hasOwn(allowedTypes, extension) ? allowedTypes[extension] : undefined
  // Some browsers leave the MIME type empty, so also check the extension.
  if (!mimeTypes || (file.type && !mimeTypes.includes(file.type))) return 'type'
  if (file.size > maxFileSize) return 'size'
  return null
}

export function isImageFile(file: Pick<File, 'name'>) {
  return /\.(png|jpe?g|gif|webp)$/i.test(file.name)
}
