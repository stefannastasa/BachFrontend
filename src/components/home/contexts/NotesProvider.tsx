import {Note} from "../../../utils/model/Note";
import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import PropTypes from "prop-types";
import {NoteService} from "../../../utils/api/noteApi";
import {AuthenticationContext} from "../../auth/context/AuthProvider";
import {HomeStateContext} from "./HomeStateProvider";
import {scanDocument} from "../../../device/camera/DocumentScanner";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {Capacitor} from "@capacitor/core";

type CreateNoteFn = (title: string, image_data: string[]) => Promise<any>;
type FetchNotesFn = () => Promise<void>;
type SearchNotesFn = (searchStr: string) => Promise<void>;
type PageControllerFn = () => void;
export interface NotesState {
    notes?: Note[],
    fetching: boolean,
    fetchingError?: Error | null,
    creating: boolean,
    createError?: Error | null,
    createNote?: CreateNoteFn,
    fetchNotes?: FetchNotesFn,
    searchNotes?: SearchNotesFn,
    pageReset?: PageControllerFn,
    size: number,
    query?: string
}

const enum ActionType {
    FETCH_STARTED,
    FETCH_SUCCEEDED,
    FETCH_FAILED,
    SAVE_STARTED,
    SAVE_SUCCEEDED,
    SAVE_FAILED,
    SEARCH_STARTED,
    SEARCH_SUCCEEDED,
    SEARCH_FAILED,
    PAGE_RESET
}

interface ActionProps {
    type: ActionType,
    payload?: any,
}

const initialState: NotesState = {
    fetching: false,
    creating: false,
    size: 6,
}


const reducer: (state: NotesState, action: ActionProps) => NotesState
    = (state, {type, payload}) => {
    switch(type) {
        case ActionType.FETCH_STARTED:
            return {...state, fetching: true, fetchingError: null};

        case ActionType.FETCH_SUCCEEDED:
            let newNotes;
            if(payload.search !== state.query){
                newNotes = [...payload.notes];
            }else{
                newNotes = [...(state.notes || [])];
                for(const note of payload.notes){
                    if(newNotes.indexOf(note) === -1){
                        newNotes.push(note);
                    }
                }
            }
            return {...state, fetching: false, notes: newNotes, query: payload.search };

        case ActionType.FETCH_FAILED:
            return {...state, fetching: false, fetchingError: payload.error };

        case ActionType.SAVE_STARTED:
            return {...state, creating: true};

        case ActionType.SAVE_SUCCEEDED:
            return {...state, creating: false };

        case ActionType.SAVE_FAILED:
            return {...state, creating: false, createError: payload.error};

        case ActionType.PAGE_RESET:
            return {...state, notes: [], query: ""};
        default:
            return state;
    }
}

export const NotesContext = React.createContext<NotesState>(initialState);

interface NoteProviderProps {
    children: PropTypes.ReactNodeLike
}

async function checkCacheFolder(){
    try{
        await Filesystem.stat({
            path: `cache`,
            directory: Directory.Data
        });
    }catch(e){
        console.log("Cache dir doesnt exist, creating...")
        await Filesystem.mkdir({
            path: 'cache',
            directory: Directory.Data
        });
    }
}

async function fetchExistingKeys(){
    const cachedFiles = await Filesystem.readdir({
        path: "cache",
        directory: Directory.Data
    });
    return cachedFiles.files.map(e => e.name);
}

function getObjectKeyFromPresignedURL(presignedUrl: string) {
    const url = new URL(presignedUrl);

    let objectPath = url.pathname;

    let index1 = objectPath.indexOf("/");
    let index2 = objectPath.indexOf("?");

    const result = objectPath.slice(index1 + 1, index2 - 1);

    return result;

}

async function fetchImages(notes: Note[]){
    console.log(`starting to fetch ${notes.length} notes from aws...`);

    const existingKeys = await fetchExistingKeys();
    console.log(existingKeys);

    const step = 20;
    for(let j = 0; j < notes.length; j += step) {
        const notesSubarray = notes.slice(j, notes.length < j + step ? notes.length : j + step);
        const promises: Promise<void>[] = [];
        for(const note of notesSubarray){
            for(let i = 0; i < note.imageUrls.length; ++i){
                const imageUrl = note.imageUrls[i];
                const image = getObjectKeyFromPresignedURL(imageUrl) || "";
                let promise;
                console.log(image);
                if(existingKeys.indexOf(image) === -1){
                    promise = NoteService.awsGetImage(imageUrl).then(key => {

                        Filesystem.getUri({path: `cache/${key}`, directory: Directory.Data})
                            .then(uri =>{
                                note.imageUrls[i] = Capacitor.convertFileSrc(uri.uri);
                            })

                    }).catch(e => {
                        console.log(e);
                        throw e;
                    });

                }else{
                    console.log(`Image ${image} found locally`);
                    promise = Filesystem.getUri({path: `cache/${image}`, directory: Directory.Data})
                        .then(uri => {
                            note.imageUrls[i] = Capacitor.convertFileSrc(uri.uri);
                        });
                }

                promises.push(promise);
            }

            for(let i = 0; i < note.thumbnailUrls.length; ++i){
                const imageUrl = note.imageUrls[i];
                const image = getObjectKeyFromPresignedURL(imageUrl) || "";
                let promise;

                if(existingKeys.indexOf(image) === -1){
                    promise = NoteService.awsGetImage(imageUrl).then(key => {
                        Filesystem.getUri({path: `cache/${key}`, directory: Directory.Data})
                            .then(uri =>{
                                note.thumbnailUrls[i] = Capacitor.convertFileSrc(uri.uri);
                            });
                    }).catch(e => {
                        console.log(e);
                        throw e;
                    });

                }else{
                    console.log(`Image ${image} found locally`);
                    promise = Filesystem.getUri({path: `cache/${image}`, directory: Directory.Data})
                        .then(uri => {
                            note.thumbnailUrls[i] = Capacitor.convertFileSrc(uri.uri);
                        });
                }
                promises.push(promise);
            }
        }
        await Promise.all(promises);
    }

}

export const NotesProvider: React.FC<NoteProviderProps> = ({children}) => {
    const [page, setPage] = useState(0);
    const {isAuthenticated} = useContext(AuthenticationContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [reachedLast, setReachedLast] = useState(false);

    const {notes,
        fetching,
        fetchingError,
        creating,
        createError,
        size,
        } = state;
    const createNote = useCallback<CreateNoteFn>(createNoteCallback, []);
    const fetchNotes = useCallback<FetchNotesFn>(fetchNotesCallback, [page]);
    const searchNotes = useCallback<SearchNotesFn>(searchNotesCallback, [page]);
    const pageReset = useCallback<PageControllerFn>(pageResetCallback, []);
    const { setSearchState} = useContext(HomeStateContext);
    useEffect(getNotesEffect, [isAuthenticated]);

    const value = {notes,
        fetchNotes,
        fetching,
        fetchingError,
        createNote,
        creating,
        createError,
        size,
        searchNotes,
        pageReset,
        };

    return (
      <NotesContext.Provider value = {value}>
          {children}
      </NotesContext.Provider>
    );



    async function uploadImages(id: string, images: string[]){
        const promises: Promise<void>[] = [];

        for (const image of images) {

            const promise = await NoteService.apiUploadImage(id, image)
                .then(res => {
                    console.log(res.uploadStatus);
                    Filesystem.deleteFile({
                            path: `to_upload/${image}`,
                            directory: Directory.Data
                    });
                })
                .catch(e => {
                    console.log(`upload of file failed`);
                    console.log(e);
                });

            // promises.push(promise);
        }
        // await Promise.all(promises);
    }

    function getNotesEffect(){
        let canceled = false;

        if(isAuthenticated){
            fetchNotes();
        }else{
            pageResetCallback();
        }

        return () => {
            canceled = true;
        }

        async function fetchNotes(){
            try{
                console.log('fetchnotes Started');
                dispatch({type: ActionType.FETCH_STARTED});
                let response = await NoteService.apiGetNotes(page, size);
                await fetchImages(response.notes);
                setPage(1);
                console.log(`fetchnotes Successful ${response.notes}`);
                if(!canceled){
                    dispatch({type: ActionType.FETCH_SUCCEEDED, payload: {notes: response.notes, search: ""}});
                }
            }catch( e ){
                console.log(`fetchnotes Failed ${e}`);
                dispatch({type: ActionType.FETCH_FAILED, payload: {error: e}});
            }
        }


    }

    async function createNoteCallback(title: string, image_data: string[]){
        try{
            console.log('saveNote started');
            dispatch({type: ActionType.SAVE_STARTED});
            const results = await scanDocument();
            if( results !== null){
                const response = await NoteService.apiCreateNote(title, image_data.length);
                const note = response.createdNote;
                console.log(`note ${note.id}`);
                await uploadImages(note.id, results);

                console.log('saveNote successful ');
                dispatch({type: ActionType.SAVE_SUCCEEDED, payload: { note: response.createdNote} } );
            }
            return true;
        }catch(e){
            console.log('saveNote failed', e);
            dispatch({type: ActionType.SAVE_FAILED, payload: { error: e}});
        }
    }

    async function fetchNotesCallback() {
        try{
            console.log('fetchnotes Started');
            dispatch({type: ActionType.FETCH_STARTED});
            const response = await NoteService.apiGetNotes(page, size);
            await fetchImages(response.notes);
            setPage(page+1);
            console.log('fetchnotes successful');
            dispatch({type: ActionType.FETCH_SUCCEEDED, payload: {notes: response.notes, search: ""}});
        }catch( e ){
            console.log(`fetchnotes failed ${e}`);
            dispatch({type: ActionType.FETCH_FAILED, payload: {error: e}});
        }

    }

    async function searchNotesCallback(searchStr: string){
        try{
            console.log(`searchnotes Started ${searchStr}`);
            dispatch({type: ActionType.FETCH_STARTED});
            const response = await NoteService.apiSearchNotes(searchStr, page, size);
            await fetchImages(response.notes);
            setPage(page+1);
            console.log('searchnotes successful');
            dispatch({type: ActionType.FETCH_SUCCEEDED, payload: {notes: response.notes, search: searchStr}});
        }catch( e ){
            console.log('searchnotes failed');
            dispatch({type: ActionType.FETCH_FAILED, payload: {error: e}});
        }

    }

    function pageResetCallback(){
        setPage(0);
        dispatch({type: ActionType.PAGE_RESET});
    }

}