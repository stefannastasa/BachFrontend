import {
    IonButton,
    IonButtons,
    IonContent, IonFab, IonFabButton, IonHeader, IonIcon,
    IonPage,
    IonTitle,
    IonToolbar, ScrollCustomEvent
} from "@ionic/react";
import React, {useCallback, useContext, useRef, useState} from "react";
import NoteGrid from "./NoteGrid";
import NoteModal from "./NoteModal";
import NoteSearch from "./NoteSearch";
import {arrowUp} from "ionicons/icons";
import useWindowDimensions from "../../device/window/WindowDims";
import {AuthenticationContext, AuthState} from "../auth/context/AuthProvider";
import {NoteService} from "../../utils/api/noteApi";

function Gallery(){
    const content = useRef<HTMLIonContentElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const { height, width } = useWindowDimensions(() => {});
    const {logout, username} = useContext(AuthenticationContext);
    function onScrollContent(distance: number){
        if(distance > height){
            setScrolled(true);
            console.log("Content is scrolled!");
        }else{
            setScrolled(false);
        }
    }

    const handleLogout = useCallback(() => {
        console.log("logout");
        logout?.();
    }, []);

    function onScrollUp(){
        content.current?.scrollToTop(100);
    }

    return (
        <IonPage>
            <IonHeader >
                <IonToolbar color="tertiary">
                    <IonTitle>
                        Gallery
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleLogout}>
                            Logout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <NoteSearch/>
            </IonHeader>
            <IonContent color="secondary" ref={content} scrollEvents={true} onIonScroll={ (ev) => onScrollContent(ev.detail.currentY)}>
                <NoteGrid/>
            </IonContent>
            {scrolled &&
                <IonFab vertical="bottom" horizontal="end">
                    <IonFabButton onClick={onScrollUp}>
                        <IonIcon icon={arrowUp}></IonIcon>
                    </IonFabButton>
                </IonFab>
            }
            <NoteModal></NoteModal>


        </IonPage>

    );


}

export default Gallery;