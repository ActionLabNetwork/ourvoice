export async function uploadFileUsingPresignedUrl(
  presignedUrlObj: { url: string; key: string },
  file: File
) {
  const { url } = presignedUrlObj
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    })

    if (!response.ok) {
      throw new Error('Error uploading file to S3')
    }
  } catch (error) {
    console.error('Error uploading file using presigned URL:', error)
    throw error
  }
}

export const generateUniqueKey = (userIdentifier: string, file: File, index: number) => {
  const timestamp = Date.now()
  return `${userIdentifier}/${timestamp}_${index}_${file.name}`
}

export const getFileNameFromKey = (key: string) => {
  const parts = key.split('_')
  return parts[parts.length - 1]
}
