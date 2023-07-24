import axios from 'axios'

import config from '@/config'

const API_URL = config.apiURL
const BASE_URL = API_URL + '/users'

export default {
  async updateUserConsent() {
    const response = await axios.put(`${BASE_URL}/consent`)
    return response
  }
}
