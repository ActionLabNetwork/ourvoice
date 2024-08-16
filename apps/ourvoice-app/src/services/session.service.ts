import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'
import Session from 'supertokens-web-js/recipe/session'

// TODO: add error handling
export async function checkForSession() {
  if (!(await Session.doesSessionExist()))
    return false
  const validationErrors = await Session.validateClaims()

  if (validationErrors.length === 0) {
    return true
  }
  else {
    for (const err of validationErrors) {
      if (err.id === EmailVerificationClaim.id) {
        return false
      }
    }
    // other error
    return false
  }
}

export async function getDeployment() {
  if (!(await Session.doesSessionExist()))
    return ''
  const payload = await Session.getAccessTokenPayloadSecurely()
  return payload.deployment || ''
}

export async function getSessionPayload() {
  if (!(await Session.doesSessionExist()))
    return undefined
  return await Session.getAccessTokenPayloadSecurely()
}
export async function getUserId() {
  if (!(await Session.doesSessionExist()))
    return ''
  return await Session.getUserId()
}

export async function checkDeployment(deployment: string): Promise<boolean> {
  const payload = await Session.getAccessTokenPayloadSecurely()
  const userDeployment = payload?.deployment || ''
  return userDeployment === deployment || userDeployment === '*'
}

export function redirectTo(url: string) {
  window.location.replace(url)
}

export function getCurrentDeploymentDomain() {
  const host = window.location.host
  const parts = host.split('.')
  return { deployment: parts[0] !== 'www' ? parts[0] : parts[1] }
}

export function isAllowedDeployment(host: string, deploymentDomain: string, deployments: string[]) {
  const parts = host.split('.')
  // NOTE: set proper domain length (localhost has 2 parts)
  const domainLength = deploymentDomain === 'localhost' ? 2 : 3
  const deployment
    = parts[0] !== 'www'
      ? parts.length === domainLength
        ? parts[0]
        : false
      : parts.length === domainLength
        ? false
        : parts[1]
  return deployment && deployments.includes(deployment) ? deployment : false
}
