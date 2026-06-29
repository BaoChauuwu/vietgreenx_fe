import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const handleAuthAction = async (
        apiCall: Promise<any>
    ): Promise<{ status: Status; message: string } | undefined> => {
        try {
            const resp = await apiCall
            if (resp.data) {
                const responseData = resp.data.data ? resp.data.data : resp.data
                const { accessToken, profile } = responseData

                const actualToken = accessToken || responseData.token
                const actualUser = profile || responseData.user

                dispatch(signInSuccess(actualToken))
                if (actualUser) {
                    dispatch(
                        setUser({
                            avatar: actualUser.avatar || '',
                            userName: actualUser.firstName
                                ? `${actualUser.firstName} ${actualUser.lastName}`.trim()
                                : actualUser.userName || 'Anonymous',
                            authority: actualUser.role
                                ? [actualUser.role]
                                : actualUser.authority || ['USER'],
                            email: actualUser.email || '',
                        }),
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl
                        ? redirectUrl
                        : appConfig.authenticatedEntryPath,
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signIn = async (
        values: SignInCredential,
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined
    > => {
        return handleAuthAction(apiSignIn(values))
    }

    const signUp = async (values: SignUpCredential) => {
        return handleAuthAction(apiSignUp(values))
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            }),
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            handleSignOut()
        }
    }

    return {
        authenticated: Boolean(token && signedIn),
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
