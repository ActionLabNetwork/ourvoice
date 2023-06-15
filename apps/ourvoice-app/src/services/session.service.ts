import Session from 'supertokens-web-js/recipe/session'
import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'

export const checkForSession = async () => {
  if (!(await Session.doesSessionExist())) return false
  const validationErrors = await Session.validateClaims()

  if (validationErrors.length === 0) {
    return true
  } else {
    for (const err of validationErrors) {
      if (err.validatorId === EmailVerificationClaim.id) {
        return false
      }
    }
    // other error
    return false
  }
}

export const getDeployment = async () => {
  const payload = await Session.getAccessTokenPayloadSecurely()
  return payload.deployment || ''
}

export const getUserId = async () => {
  return await Session.getUserId()
}

export const checkDeployment = async (deployment: string): Promise<boolean> => {
  const payload = await Session.getAccessTokenPayloadSecurely()
  const userDeployment = payload.deployment || ''
  return userDeployment === deployment || userDeployment === '*'
}

export const redirectTo = (url: string) => {
  window.location.replace(url)
}

export const getCurrentDeploymentDomain = () => {
  const host = window.location.host
  const parts = host.split('.')
  return { deployment: parts[0] !== 'www' ? parts[0] : parts[1] }
}

export const isAllowedDeployment = (
  host: string,
  deploymentDomain: string,
  deployments: string[]
) => {
  const parts = host.split('.')
  // NOTE: set proper domain length (localhost has 2 parts)
  const domainLength = deploymentDomain === 'localhost' ? 2 : 3
  const deployment =
    parts[0] !== 'www'
      ? parts.length === domainLength
        ? parts[0]
        : false
      : parts.length === domainLength
      ? false
      : parts[1]
  return deployment && deployments.indexOf(deployment) > -1 ? deployment : false
}
