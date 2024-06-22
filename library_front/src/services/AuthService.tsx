import axios, { AxiosResponse } from "axios";
import {RegisterRequest} from "../model/request/RegisterRequest.tsx";
import {AuthRequest} from "../model/request/AuthRequest.tsx";
import {AuthResponse} from "../model/response/AuthResponse.tsx";
const BASE_URL = "http://localhost:8080/api/auth";

class AuthService{
    register(registerData: RegisterRequest): Promise<AxiosResponse<void>> {
        return axios.post<void>(`${BASE_URL}/register`, registerData);
    }
    login = async (authRequest: AuthRequest): Promise<AuthResponse | undefined> => {
        console.log("AUTHHH");
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: authRequest.username, password: authRequest.password })
            });

            if (!response.ok) {
                const errorText = await response.json();
                console.error('Login failed:', errorText);
                throw new Error('Please check your email and password');
            }

            const text = await response.text();

            if (!text) {
                throw new Error('Empty response from server');
            }

            const data: AuthResponse = JSON.parse(text);
            console.log(data);

            localStorage.setItem('jwt', data.jwtResponse)

            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email);
            localStorage.setItem('name', data.name);

            localStorage.setItem('surname', data?.surname);
            localStorage.setItem('role', data?.role);

            window.sessionStorage.setItem('authenticated', 'true');

            return data; // Возвращаем данные пользователя
        } catch (err) {
            console.error(err);
            throw err; // Прокидываем ошибку наверх
        }
    };

    sendJwtToken = async (): Promise<AxiosResponse<any>> => {
        const jwt: string | null = localStorage.getItem('jwt');

        if (!jwt) {
            throw new Error('JWT token not found in local storage');
        }

        try {
            const response: AxiosResponse<any> = await axios.get(`${BASE_URL}/protected-resource`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });
            return response;
        } catch (error) {
            console.error('Error sending JWT:', error);
            throw error;
        }
    };
}


export default new AuthService();