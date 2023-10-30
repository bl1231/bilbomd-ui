import axios, {
  AxiosResponse as BaseAxiosResponse,
  AxiosError as BaseAxiosError,
  isAxiosError as baseIsAxiosError
} from 'axios'

const baseURL = import.meta.env.DEV
  ? `http://localhost:${import.meta.env.VITE_BILBOMD_BACKEND_PORT}/v1`
  : 'https://bl1231.als.lbl.gov/bilbomd-dev-backend/v1'

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
})

const axiosPrivate = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export type AxiosResponse = BaseAxiosResponse
export type AxiosError = BaseAxiosError
export const isAxiosError = baseIsAxiosError

export { axiosInstance, axiosPrivate }
