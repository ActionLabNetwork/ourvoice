import { formatDistance } from 'date-fns'

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

export function formatTimestampToReadableDate(unixTs: number) {
  const date = new Date(unixTs)
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

export function timePassed(dateString: string) {
  return formatDistance(new Date(dateString), new Date(), {
    addSuffix: true
  })
}
