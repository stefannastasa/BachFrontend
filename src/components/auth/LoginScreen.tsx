import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonIcon, IonInput,
    IonItem,
    IonLabel,
    IonRow,
    IonText,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import { useHistory } from 'react-router-dom';

import './styles/login.module.css';
import {AuthenticationContext, AuthState} from "./context/AuthProvider";

function LoginScreen(){
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const history = useHistory();
    const {login, isAuthenticating, isAuthenticated, authenticationError, isFailed} = useContext(AuthenticationContext);

    const handleLogin = useCallback(() => {
        console.log("login");
        login?.(username, password);

    }, [username, password]);


    useEffect(() => {
        if ( isAuthenticated ){
            history.push("/");
        }
    }, [isAuthenticated]);

    const handleRegister = () => {
        history.push("/register")
    }

    return (
        <>

            <IonContent className="ion-padding ion-text-center " color="secondary"  >
                <IonItem color="secondary"></IonItem>
                <IonText style={{textAlign:'center'}}>
                    <h2>HandNotes</h2>
                </IonText>
                <IonInput style={{marginTop:'5vh'}} label="Username" fill="outline" labelPlacement="floating"
                          type="text"
                          className="ion-text-left"
                          value={username}
                          onIonInput={(e) => setUsername(e.detail.value!)}
                >

                </IonInput>



                   <IonInput style={{marginTop:'3vh'}} className="ion-margin-top ion-text-left" fill="outline" label="Password" labelPlacement="floating"
                             type="password"
                             value={password}

                             onIonInput={(e) => setPassword(e.detail.value!)}
                   >

                   </IonInput>
                <IonButton  expand="full" onClick={handleLogin} style={{width: '50%', marginTop:'3vh',marginRight:'auto', marginLeft:'auto' }} className="ion-margin-top" >
                    Login
                </IonButton>
                <IonButton color="tertiary" className={"ion-margin-top"} onClick={handleRegister}>
                    Register
                </IonButton>
                <IonToast isOpen = {isFailed} duration={3000} message={authenticationError?.message}/>

            </IonContent>

        </>

    );

}

export default LoginScreen;