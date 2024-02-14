import {IonCard, IonText} from "@ionic/react";
import React, {useContext} from "react";
import useWindowDimensions from "../../device/window/WindowDims";
import {HomeStateContext} from "./contexts/HomeStateProvider";
import {Note} from "../../utils/model/Note";

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
        console.log(`Note clicked! ${note}`);

    }

    return (
        <div style={{textAlign: 'center', maxWidth:'180px'}} onClick={handleOnClick} >
            <IonCard color="tertiary" style={{height: '210px', maxWidth:'160px'}} >

            </IonCard>
            <IonText>
                {note.title}
            </IonText>
        </div>

    );


}

export default NoteCard;