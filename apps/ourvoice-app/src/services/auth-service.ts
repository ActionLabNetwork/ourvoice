import axios from 'axios'
import bcrypt from 'bcryptjs'

const API_URL = import.meta.env.VITE_APP_API_URL
const SESSION_INFO_ENDPOINT = import.meta.env.VITE_SESSION_INFO_ENDPOINT
const GLOBAL_PEPPER = import.meta.env.VITE_GLOBAL_PEPPER

export default {
  async getSessionInfo() {
    const response = await axios.get(`${API_URL}${SESSION_INFO_ENDPOINT}`)
    return response
  },
  async hashInput(input: string, deployment: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(input + deployment + GLOBAL_PEPPER, salt)

    return hash
  },
  async verifyHash(input: string, hash: string) {
    try {
      return await bcrypt.compare(input + GLOBAL_PEPPER, hash)
    } catch (err) {
      console.error(err)
      throw new Error('Error occurred during hash verification.')
    }
  }
}
