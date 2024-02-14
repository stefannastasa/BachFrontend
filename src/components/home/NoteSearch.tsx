import React, {useCallback, useContext, useEffect, useState} from "react";
import {IonSearchbar} from "@ionic/react";
import {addOutline, arrowBack} from "ionicons/icons";
import {NotesContext} from "./contexts/NotesProvider";
import {HomeStateContext} from "./contexts/HomeStateProvider";

const enum FoundState {
    FOUND, NOT_FOUND, EMPTY
}

function NoteSearch(){
    const [searchText, setSearchText] = useState("")
    const [isFound, setIsFound] = useState(FoundState.EMPTY);

    const {searchState, setSearchState} = useContext(HomeStateContext);

    const {notes,
        searchNotes,
        fetchNotes,
        query,
        pageReset,
        createNote
        } = useContext(NotesContext);

    const onSearchCb = useCallback(onSearchChange, []);

    useEffect(() => {
        if(notes && notes.length > 0)
            setIsFound(FoundState.FOUND);

        if(notes && notes.length == 0)
            setIsFound(FoundState.NOT_FOUND);

        if(searchState === "")
            setIsFound(FoundState.EMPTY);

    }, [notes, searchState]);



    async function onSearchChange(value: string | undefined | null){
        if(value === undefined || value == null)
            return;
        setSearchState?.(value);
        pageReset?.();

        if(value.length == 0){
            setIsFound(FoundState.EMPTY);
            console.log("Fetching notes...");
            fetchNotes?.();
            return;
        }
        searchNotes?.(value);
        console.log(`NoteSearch ${query}`)

    }

    function onCancelButton(){
        if(isFound == FoundState.NOT_FOUND){
            console.log("creating note...");
            createNote?.(searchState, [""]);
            setSearchText("");
        }

    }

    return(
        <>
            <IonSearchbar  placeholder="Search or create a note" onIonInput={
                (ev) => {onSearchCb(ev.detail.value)}
            }
              showCancelButton="focus"
              cancelButtonText={(isFound === FoundState.NOT_FOUND ?  "create" : "cancel" )}
              cancelButtonIcon={(isFound === FoundState.NOT_FOUND ? addOutline : arrowBack )}
              onIonCancel={onCancelButton}
            ></IonSearchbar>

        </>
    );

}

export default NoteSearch;