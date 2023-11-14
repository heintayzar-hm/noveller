export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
export const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"
export const SECRET = process.env.NEXTAUTH_URL || "secret"


const REQUESTS_ENDPOINT = {
    login: '/auth/login',
    register: '/auth/register',
    profile:  '/auth/profile',
}

export {
    REQUESTS_ENDPOINT
}
