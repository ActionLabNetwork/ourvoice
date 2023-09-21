import axios from 'axios'

import config from '@/config'

const API_URL = config.apiURL
const AUTH_URL = config.apiDomain
const BASE_URL = API_URL + '/users'
const BASER_AUTH_URL = AUTH_URL + '/auth'

export default {
  async updateUserConsent() {
    const response = await axios.put(`${BASE_URL}/consent`)
    return response
  },

  // send GET request to verify User's email
  async verifyEmail() {
    const response = await axios.get(`${BASER_AUTH_URL}/user/email/verify`)
    return response
  }
}

