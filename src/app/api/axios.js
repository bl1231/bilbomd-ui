import axios from 'axios'
console.log('axios', import.meta.env.MODE)
const baseURL = import.meta.env.DEV
  ? `http://localhost:${import.meta.env.VITE_BILBOMD_BACKEND_PORT}`
  : 'https://bl1231.als.lbl.gov/bilbomd-dev-backend'

export default axios.create({
  baseURL: baseURL
})

// export const axiosPrivate = axios.create({
//   baseURL: baseUrl(),
//   headers: { 'Content-Type': 'application/json' },
//   withCredentials: true
// })
