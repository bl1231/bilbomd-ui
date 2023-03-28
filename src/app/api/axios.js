import axios from 'axios'
// const BASE_URL = 'https://bl1231.als.lbl.gov/bilbomd-dev-backend'

const baseUrl = () => {
  //console.log('baseUrl', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'production') {
    return 'https://bl1231.als.lbl.gov/bilbomd-dev-backend'
  } else {
    return 'http://localhost:3500'
  }
}

export default axios.create({
  baseURL: baseUrl()
})

export const axiosPrivate = axios.create({
  baseURL: baseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})
