import axios, {
  AxiosResponse as BaseAxiosResponse,
  AxiosError as BaseAxiosError,
  isAxiosError as baseIsAxiosError
} from 'axios'

const baseURL = '/api/v1'

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
