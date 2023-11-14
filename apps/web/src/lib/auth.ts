import { cookies } from "next/headers";
import { HashService } from "./HashService";
import jwt from "jsonwebtoken";
import { REQUESTS_ENDPOINT, SERVER_URL } from "../config";
import axios from "axios";

export const getToken = () => {
    const cookieStore = cookies()
    const token = cookieStore.get('x-access_token')?.value as string
    return token
}

export const serverAxiosInstance = axios.create({
    baseURL: SERVER_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
    }
});

export const isAuthorized = () => {
    const token = getToken()

    if (!token) return false
    // decrypt token
    const decryptedToken = HashService.decrypt(token)

    // verify jwt
    if (decryptedToken) {
        try {
            const decodedToken = jwt.verify(decryptedToken, process.env.JWT_SECRET as string)
            if (decodedToken) return true
        } catch (error) {
            return false
        }
    }
}



export const getSession = async () => {
    const token = getToken()
    if (!token) {
        return {
            isLoggedIn: false,
            token: null,
            user: null,
        }
    }

    try {
        const urlToGet = REQUESTS_ENDPOINT.profile
        const response = await serverAxiosInstance.get(urlToGet) as any;

        if (!response.data.success) {
            return {
                isLoggedIn: false,
                token: null,
                user: null,
            }
        }

        return {
            isLoggedIn: true,
            token: token,
            user: {
                ...response.data.user
            }
    }
    } catch (error) {
        return {
            isLoggedIn: false,
            token: null,
            user: null,
        }
    }
}
