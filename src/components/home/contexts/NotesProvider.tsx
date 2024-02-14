import {Note} from "../../../utils/model/Note";
import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import PropTypes from "prop-types";
import {NoteService} from "../../../utils/api/noteApi";
import {AuthenticationContext} from "../../auth/context/AuthProvider";
import {HomeStateContext} from "./HomeStateProvider";

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
    size: 5,
}


const reducer: (state: NotesState, action: ActionProps) => NotesState
    = (state, {type, payload}) => {
    switch(type) {
        case ActionType.FETCH_STARTED:
            return {...state, fetching: true, fetchingError: null};

        case ActionType.FETCH_SUCCEEDED:
            return {...state, fetching: false, notes: [...(state.notes || []), payload.notes].flat()};

        case ActionType.FETCH_FAILED:
            return {...state, fetching: false, fetchingError: payload.error };

        case ActionType.SAVE_STARTED:
            return {...state, creating: true};
        case ActionType.SAVE_SUCCEEDED:

            return {...state, saving: false};

        case ActionType.SAVE_FAILED:
            return {...state, creating: false, createError: payload.error};

        case ActionType.PAGE_RESET:
            return {...state, notes: []};
        default:
            return state;
    }
}

export const NotesContext = React.createContext<NotesState>(initialState);

interface NoteProviderProps {
    children: PropTypes.ReactNodeLike
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
                const response = await NoteService.apiGetNotes(page, size);
                setPage(1);
                console.log(`fetchnotes successful ${response.notes}`);
                if(!canceled){
                    dispatch({type: ActionType.FETCH_SUCCEEDED, payload: {notes: response.notes}});
                }
            }catch( e ){
                console.log('fetchnotes failed');
                dispatch({type: ActionType.FETCH_FAILED, payload: {error: e}});
            }
        }


    }

    async function createNoteCallback(title: string, image_data: string[]){
        try{
            console.log('saveNote started ');
            dispatch({type: ActionType.SAVE_STARTED});
            const response = await NoteService.apiCreateNote(title, image_data);
            console.log('saveNote successful ');
            dispatch({type: ActionType.SAVE_SUCCEEDED, payload: { note: response.createdNote} } );
            return true;
        }catch(e){
            console.log('saveNote failed');
            dispatch({type: ActionType.SAVE_FAILED, payload: { error: e}});
        }
    }

    async function fetchNotesCallback() {
        try{
            console.log('fetchnotes Started');
            dispatch({type: ActionType.FETCH_STARTED});
            const response = await NoteService.apiGetNotes(page, size);
            setPage(page+1);
            console.log('fetchnotes successful');
            dispatch({type: ActionType.FETCH_SUCCEEDED, payload: {notes: response.notes}});
        }catch( e ){
            console.log(`fetchnotes failed ${e}`);
            dispatch({type: ActionType.FETCH_FAILED, payload: {error: e}});
        }

    }

    async function searchNotesCallback(searchStr: string){
        try{
            console.log(`fetchnotes Started ${searchStr}`);
            dispatch({type: ActionType.FETCH_STARTED, payload:{query: searchStr}});
            const response = await NoteService.apiSearchNotes(searchStr, page, size);
            setPage(page+1);
            console.log('fetchnotes successful');
            dispatch({type: ActionType.FETCH_SUCCEEDED, payload: {notes: response.notes}});
        }catch( e ){
            console.log('fetchnotes failed');
            dispatch({type: ActionType.FETCH_FAILED, payload: {error: e}});
        }

    }

    function pageResetCallback(){
        setPage(0);
        dispatch({type: ActionType.PAGE_RESET});
    }

}