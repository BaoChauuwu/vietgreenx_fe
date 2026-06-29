export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    token?: string
    accessToken?: string
    user?: {
        userName?: string
        firstName?: string
        lastName?: string
        authority?: string[]
        role?: string
        avatar?: string
        email?: string
    }
    profile?: {
        userName?: string
        firstName?: string
        lastName?: string
        authority?: string[]
        role?: string
        avatar?: string
        email?: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}
