import React, {useState} from "react";
import {
    IonButton, IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonIcon, IonInput,
    IonItem,
    IonLabel,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {arrowBack, lockClosed, person} from "ionicons/icons";

import './styles/register.module.css';
import {useHistory} from "react-router-dom";
import { AuthService} from "../../utils/api/authApi";

function RegisterScreen(){
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const history = useHistory();
    const handleRegister = () => {
        console.log("register");
        AuthService.apiRegister(username, password);
        history.push("/");
    }

    const handleBack = () => {
        history.goBack();
    }

    return (
        <>
            <IonHeader >
                <IonToolbar color="secondary">
                    <IonButtons slot="start">
                        <IonButton onClick={handleBack}>
                            <IonIcon slot="icon-only" icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle slot="" >
                        HandNotes
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding ion-text-center " color="secondary">
                <IonText>
                    <h2>Create your account</h2>
                </IonText>

                <IonInput style={{marginTop:'5vh'}} label="Username" fill="outline" labelPlacement="floating"
                          type="text"
                          value={username}
                          onIonInput={(e) => setUsername(e.detail.value!)}
                >

                </IonInput>

                   <IonInput style={{marginTop:'3vh'}}  fill="outline" label="Password" labelPlacement="floating"
                             type="password"
                             value={password}
                             onIonInput={(e) => setPassword(e.detail.value!)}
                   >

                   </IonInput>
                <IonButton  expand="full" onClick={handleRegister} style={{width: '50%', marginTop:'3vh',marginRight:'auto', marginLeft:'auto' }} className="ion-margin-top" >
                    Register
                </IonButton>

            </IonContent>

        </>

    );

}

export default RegisterScreen;