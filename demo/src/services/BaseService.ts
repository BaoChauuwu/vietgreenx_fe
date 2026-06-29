import axios from 'axios'
import appConfig from '@/configs/app.config'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import store, { signOutSuccess, setUser } from '../store'

const unauthorizedCode = [401]

const BaseService = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
})

BaseService.interceptors.request.use(
    (config) => {
        let accessToken = store.getState().auth?.session?.token

        if (!accessToken) {
            const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
            const persistData = deepParseJson(rawPersistData)
            accessToken = persistData ? (persistData as any).auth?.session?.token : null
        }

        if (accessToken) {
            config.headers[
                REQUEST_HEADER_AUTH_KEY
            ] = `${TOKEN_TYPE}${accessToken}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

BaseService.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error

        if (response && unauthorizedCode.includes(response.status)) {
            store.dispatch(signOutSuccess())
            store.dispatch(setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            }))
        }

        return Promise.reject(error)
    }
)

export default BaseService
