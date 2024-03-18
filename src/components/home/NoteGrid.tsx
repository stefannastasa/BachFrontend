import React, {forwardRef, useCallback, useContext, useEffect, useRef, useState} from "react";
import {IonCol, IonGrid, IonInfiniteScroll, IonInfiniteScrollContent, IonRow, IonSpinner, IonText} from "@ionic/react";
import useWindowDimensions from "../../device/window/WindowDims";
import NoteCard from "./NoteCard";
import {NotesContext} from "./contexts/NotesProvider";
import {Note} from "../../utils/model/Note";
import {HomeStateContext} from "./contexts/HomeStateProvider";
// @ts-ignore
import debounce from 'lodash.debounce';
import {Virtuoso, VirtuosoGrid} from "react-virtuoso";
import style from "./styles/Gallery.module.css";
import Gallery from "./Gallery";
function NoteGrid() {
    const { notes, fetchNotes,
        fetching,
        fetchingError,
        creating,
        createError,
        searchNotes,
        pageReset,
        query, size} = useContext(NotesContext);
    const {width, height} = useWindowDimensions(adaptChunkSize);
    const [chunkSize, setChunkSize] = useState<number>(Math.floor(width/150));
    const [scrolled, setScrolled] = useState(false);
    const virtuosoRef = useRef(null)
    const {searchState} = useContext(HomeStateContext);
    const debouncedOnScroll = debounce(onScrollBottom, 100);
    const [showed, setShowed] = useState<Note[]>([]);
    function adaptChunkSize(chunk:number)  {
        setChunkSize(chunk);
    }

    function onScrollBottom(index: number){
        console.log(`${index} | ${size}`);
        if( (index+1) % size > 0)return; //reached the end
        if(searchState.length === 0){
            if(fetchingError === null)
                fetchNotes?.();
        }else{
            if(fetchingError === null)
                searchNotes?.(searchState);
        }

    }

    function onScrollContent(distance: number){
        if(distance > height){
            setScrolled(true);
            console.log("Content is scrolled!");
        }else{
            setScrolled(false);
        }
    }

    useEffect(() => {
        setShowed(notes ? notes : []);
    }, [notes]);

    return (
        <>
            { notes &&
                <VirtuosoGrid className="ion-content-scroll-host"
                style={{height: '100%', width: '100%'}}
                data={notes}
                ref={virtuosoRef}
                overscan={20}
                listClassName={style.listClass}
                itemClassName={style.itemClass}
                endReached={index => {onScrollBottom(index)}}

                itemContent={(index, note) => (
                    <NoteCard note={note}></NoteCard>
                )}/>

            }
            { (fetching || creating) && !notes &&
                <IonSpinner style={{alignSelf:"center"}} color = "light"></IonSpinner>
            }

        </>

    )
}

export default NoteGrid;