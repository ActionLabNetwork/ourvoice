import axios from 'axios'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import Session from 'supertokens-web-js/recipe/session'

const API_URL = import.meta.env.VITE_APP_API_URL
const SESSION_INFO_ENDPOINT = import.meta.env.VITE_SESSION_INFO_ENDPOINT
const GLOBAL_PEPPER = import.meta.env.VITE_GLOBAL_PEPPER

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
  }
}
