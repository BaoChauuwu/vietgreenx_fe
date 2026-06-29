import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    const backendData = {
        email: data.email,
        password: data.password,
    }

    return ApiService.fetchData<SignInResponse>({
        url: '/admin/login',
        method: 'post',
        data: backendData,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/admin/sign-up', // Note: This doesn't exist in backend yet
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/admin/logout', // Note: This doesn't exist in backend yet
        method: 'post',
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/admin/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data: ResetPassword) {
    return ApiService.fetchData({
        url: '/admin/reset-password',
        method: 'post',
        data,
    })
}
