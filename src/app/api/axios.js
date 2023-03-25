import axios from 'axios'
const BASE_URL = 'https://bl1231.als.lbl.gov/bilbomd-dev-backend'

export default axios.create({
  baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})
