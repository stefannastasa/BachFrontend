import {Config, withLogs} from "../index";

import axios from "axios";
import {authConfig, baseConfig} from "./index";
import config from "../../config.json";
import {AuthenticationContext} from "../../components/auth/context/AuthProvider";
const loginUrl = `http://${config.baseUrl}/api/auth`;



const registerUrl = `http://${config.baseUrl}/api/auth/register`;
const logoutUrl = `http://${config.baseUrl}/api/auth/logout`;

export interface LoginInterface {
    user: string,
}

export interface RegisterInterface {
    message: string,
}

export const AuthService = {

    setAuthToken: (token?: string) =>{
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }else{
            delete axios.defaults.headers.common['Authorization'];
        }
    },

    apiLogin: async (user?: string, pass?: string): Promise<LoginInterface> => {

        try{
            const response = await axios.post(loginUrl, {username: user, password: pass}, baseConfig);
            const { token, username } = response.data;
            AuthService.setAuthToken(token);
            return {user: username};
        }catch( e ){
            console.log(e);
            throw e;
        }

    },
    apiRegister: async (username?:string, password?:string): Promise<RegisterInterface> => {
        try{
            const response = await axios.post(registerUrl, {username: username, password: password}, baseConfig);
            const { token } = response.data;
            AuthService.setAuthToken(token);
            return response.data;
        }catch( e ){
            throw e;
        }

    },
    apiLogout: async () => {
        AuthService.setAuthToken();
    }

}

