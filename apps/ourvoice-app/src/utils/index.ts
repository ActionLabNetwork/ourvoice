import { formatDistance } from 'date-fns'

export function formatDate(
  dateString: string,
  locale: string = 'en-AU',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },
): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, options).format(date)
}

export function formatTimestampToReadableDate(unixTs: number) {
  const date = new Date(unixTs)
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export function timePassed(dateString: string) {
  return formatDistance(new Date(dateString), new Date(), {
    addSuffix: true,
  })
}

export function indexToColor(index: number) {
  const colors = [
    'bg-ourvoice-util-green',
    'bg-ourvoice-util-yellow',
    'bg-ourvoice-util-red',
    'bg-ourvoice-util-blue',
  ]
  return colors[index % colors.length]
}
