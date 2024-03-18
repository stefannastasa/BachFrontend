import {IonCard, IonImg, IonText} from "@ionic/react";
import React, {useContext} from "react";
import useWindowDimensions from "../../device/window/WindowDims";
import {HomeStateContext} from "./contexts/HomeStateProvider";
import {Note} from "../../utils/model/Note";
import {Directory, Filesystem} from "@capacitor/filesystem";

type setState = (stat:string) => void;



interface NoteCardProps {
    note: Note,
}

const NoteCard: React.FC<NoteCardProps> = (props) => {
    const {setNoteState, setModalState} = useContext(HomeStateContext)
    const {note} = props;
    const {width, height} = useWindowDimensions(() => {});

    function handleOnClick(){
        if (setNoteState && setModalState) {
            setNoteState(note);
            setModalState(true);
        }
        console.log(`Note clicked! ${note.imageUrls[0]}`);

    }

    return (
        <div style={{textAlign: 'center', width:'inherit'}} onClick={handleOnClick} >
            <IonCard color="tertiary" style={{height: '210px', width:"160px", alignSelf:'center'}} >
                <IonImg src={note.thumbnailUrls[0]} >

                </IonImg>
            </IonCard>
            <IonText>
                {note.title}
            </IonText>
        </div>

    );


}

export default NoteCard;