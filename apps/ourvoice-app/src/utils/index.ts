export function formatDate(dateString: string) {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  return new Intl.DateTimeFormat('en-AU', options).format(date)
}
