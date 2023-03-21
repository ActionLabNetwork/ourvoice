const REDIRECT = 'REDIRECT'

export class ManageRedirectStateService {
  purge(): void {
    console.log('Removing redirect')
    localStorage.removeItem(REDIRECT)
  }

  exists(): boolean {
    const current = this.get()
    return !!current && current !== 'ERROR'
  }

  set(url: string): void {
    localStorage.setItem(REDIRECT, url)
  }

  get(): string {
    return localStorage.getItem(REDIRECT) || 'ERROR'
  }
}
