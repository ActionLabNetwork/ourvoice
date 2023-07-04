import axios from 'axios'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import Session from 'supertokens-web-js/recipe/session'

import config from '@/config'

const API_URL = config.apiURL
const SESSION_INFO_ENDPOINT = config.sessionEndpoint
const GLOBAL_PEPPER = config.globalPepper

export default {
  async getSessionInfo() {
    const response = await axios.get(`${API_URL}${SESSION_INFO_ENDPOINT}`)
    return response
  },
  async hashInput(input: string, deployment: string) {
    return sha256(input + deployment + GLOBAL_PEPPER).toString(Base64)
  },
  async verifyHash(input: string, deployment: string, hash: string) {
    return sha256(input + deployment + GLOBAL_PEPPER).toString(Base64) === hash
  },
  async getUserId() {
    if (!(await Session.doesSessionExist())) return
    return await Session.getUserId()
  },
  async refreshToken() {
    const response = await axios.get(`${API_URL}/refreshtoken`)
    return response
  }
}
