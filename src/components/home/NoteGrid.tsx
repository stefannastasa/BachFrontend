import React, {useCallback, useContext, useEffect, useState} from "react";
import {IonCol, IonGrid, IonInfiniteScroll, IonInfiniteScrollContent, IonRow} from "@ionic/react";
import useWindowDimensions from "../../device/window/WindowDims";
import NoteCard from "./NoteCard";
import {NotesContext} from "./contexts/NotesProvider";
import {Note} from "../../utils/model/Note";
import {HomeStateContext} from "./contexts/HomeStateProvider";
import debounce from 'lodash.debounce';

function NoteGrid() {
    const { notes, fetchNotes,
        fetching,
        fetchingError,
        searchNotes,
        pageReset,
        query, size} = useContext(NotesContext);
    const {width, height} = useWindowDimensions(adaptChunkSize);
    const [chunkSize, setChunkSize] = useState<number>(Math.floor(width/150));
    const [noteChunks, setNoteChunks] = useState<Note[][]>([[]]);
    const {searchState} = useContext(HomeStateContext);
    const debouncedOnScroll = debounce(onScrollBottom, 100);
    function adaptChunkSize(chunk:number)  {
        setChunkSize(chunk);
    }

    useEffect(() => {
        if(notes && !fetchingError){
            setNoteChunks(separateInChunks(notes, chunkSize));
        }
    }, [notes, chunkSize]);


    function onScrollBottom(){
        if(searchState.length === 0){
            if(fetchingError === null)
                fetchNotes?.();
        }else{
            if(fetchingError === null)
                searchNotes?.(searchState);
        }

    }

    const separateInChunks = (list: Note[], chunkSize: number) => {
        console.log(list);
        let row = 0;
        let col = 0;
        var chunks: Note[][] = [[]];
        for( let i = 0; i < list.length; i++){
            if(col === chunkSize){
                col = 0;
                row +=1;
                chunks.push([]);
            }
            chunks[row].push(list[i]);
            col++;
        }
        return chunks;
    }
    return (
        <>
            <IonGrid>
                {noteChunks.map((noteRow, rowIndex) => (
                    <IonRow key={rowIndex}>
                        {noteRow.map((note, colIndex) => (
                            <IonCol key={colIndex}>
                                <NoteCard note = {note} />
                            </IonCol>
                        ))}
                    </IonRow>
                ))}
            </IonGrid>
            <IonInfiniteScroll onIonInfinite={(ev) => {
                debouncedOnScroll();
                ev.target.complete();

            }} threshold={"20%"}>
                <IonInfiniteScrollContent></IonInfiniteScrollContent>
            </IonInfiniteScroll>
        </>

    )
}

export default NoteGrid;