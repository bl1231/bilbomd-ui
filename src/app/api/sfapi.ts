import axios, {
  AxiosResponse as BaseAxiosResponse,
  AxiosError as BaseAxiosError,
  isAxiosError as baseIsAxiosError
} from 'axios'

const baseURL = "https://api.nersc.gov/api/v1.2"

const sfapiInstance = axios.create({
  baseURL: baseURL,
})

const sfapiAuthed = axios.create({
  baseURL: baseURL,
})

export type AxiosResponse = BaseAxiosResponse
export type AxiosError = BaseAxiosError
export const isAxiosError = baseIsAxiosError

export { sfapiInstance, sfapiAuthed }
