import axios from 'axios'
import { API_BASE_URL, IS_DEVELOPMENT } from '@/shared/config/env'

export const ApiBaseUrl = IS_DEVELOPMENT
  ? `http://${ API_BASE_URL }`
  : `https://${ API_BASE_URL }`

const api = axios.create({
  baseURL: `${ ApiBaseUrl }/api/v1/`,
})

export default api
