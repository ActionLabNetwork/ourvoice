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
