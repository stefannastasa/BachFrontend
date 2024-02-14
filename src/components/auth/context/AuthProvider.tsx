import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {AuthService} from "../../../utils/api/authApi";
import {NoteService} from "../../../utils/api/noteApi";

type loginFunction = (username?: string, password?: string) => void;

type logoutFunction = () => void;


export interface AuthState {
    isAuthenticated: boolean,
    isAuthenticating: boolean,
    logoutStarted: boolean
    authenticationStarted: boolean,
    login?: loginFunction,
    logout?: logoutFunction,
    isFailed: boolean,
    authenticationError: Error | undefined,
    username?: string,
    password?: string,
}

const initState:AuthState =   {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationStarted: false,
    isFailed: false,
    authenticationError: undefined,
    logoutStarted: false,

}


export const AuthenticationContext = React.createContext<AuthState>(initState);

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike,
}
export const AuthenticationProvider: React.FC<AuthProviderProps>= ({children}) => {
    const [state, setState] = useState<AuthState>(initState);
    const { isAuthenticating, isAuthenticated, isFailed, authenticationError, authenticationStarted, logoutStarted, username} = state;
    const login = useCallback<loginFunction>(loginCb, []);
    const logout = useCallback<logoutFunction>(logoutCb, []);
    const value = {login, logout, authenticationStarted, isAuthenticated, isAuthenticating, isFailed, authenticationError, logoutStarted, username};
    useEffect(authFlow, [authenticationStarted, logoutStarted]);
    return(
        <AuthenticationContext.Provider value = {value}>
            {children}
        </AuthenticationContext.Provider>
    );

    function loginCb(username?: string, password?: string){
        setState({
            ...state,
            authenticationStarted: true,
            username,
            password
        });
    }

    function logoutCb() {
        console.log(state);
        setState({
            ...state,
            logoutStarted: true,
        });
    }

    function authFlow(){
        let canceled = false;

        if(authenticationStarted){
            authenticate().then(r => () => {});
        }
        if(logoutStarted){
            deauthenticate().then(() => {});
        }

        return () => {
            canceled = true;
        }

        async function deauthenticate(){

            try{
                await AuthService.apiLogout();
                // remove from memory

            }catch (error){
                return;
            }
        }

        async function authenticate(){

            try{

                setState({
                    ...state,
                    isAuthenticating: true,
                });
                const {username, password} = state;
                const { user} = await AuthService.apiLogin(username, password);
                console.log(user);
                if(canceled)
                    return;

                setState({
                    ...state,
                    isAuthenticated: true,
                    authenticationStarted: false,
                    isAuthenticating: false,
                });

            }catch( error ){
                if (canceled)
                    return;

                setState({
                    ...state,
                    isFailed: true,
                    // @ts-ignore
                    authenticationError: error as Error,
                    authenticationStarted: false,
                    isAuthenticating: false
                });
            }
        }

    }

}