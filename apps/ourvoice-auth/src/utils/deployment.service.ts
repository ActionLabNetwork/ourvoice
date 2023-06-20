const DEPLOYMENT = 'DEPLOYMENT'

export class DeploymentService {
  purge(): void {
    console.log('Adding Deployment')
    localStorage.removeItem(DEPLOYMENT)
  }

  exists(): boolean {
    const current = this.get()
    return !!current && current !== 'ERROR'
  }

  set(url: string): void {
    localStorage.setItem(DEPLOYMENT, url)
  }

  get(): string {
    return localStorage.getItem(DEPLOYMENT) || 'ERROR'
  }
}
