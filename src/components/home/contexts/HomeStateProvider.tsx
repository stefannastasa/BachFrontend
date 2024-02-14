import React, {useContext, useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Note} from "../../../utils/model/Note";
import {AuthenticationContext} from "../../auth/context/AuthProvider";


type setModalStateFn = (state: boolean) => void;
type setNoteStateFn = (note: Note) => void;
type setSearchStateFn = (query: string) => void;

export interface HomeStateType {
    modalState: boolean,
    setModalState?: setModalStateFn,
    noteState?: Note,
    setNoteState?: setNoteStateFn,
    searchState: string,
    setSearchState?: setSearchStateFn
}

const initialState: HomeStateType = {
    modalState: false,
    setModalState: undefined,
    noteState: undefined,
    setNoteState: undefined,
    searchState: "",
    setSearchState: undefined
}

export const HomeStateContext = React.createContext<HomeStateType>(initialState);

interface HomeStateProps {
    children: PropTypes.ReactNodeLike;
}
export const HomeStateProvider: React.FC<HomeStateProps> = ({children}) => {

    const [noteState, setNoteState] = useState<Note | undefined>();
    const [modalState, setModalState ] = useState(false);
    const [searchState, setSearchState] = useState("");
    const value = {noteState, setNoteState, modalState, setModalState, searchState, setSearchState};
    const {isAuthenticated} = useContext(AuthenticationContext);
    useEffect(() => {
        if(!isAuthenticated){
            setNoteState(undefined);
            setModalState(false);
            setSearchState("");
        }
    }, [isAuthenticated]);

    return (
        <HomeStateContext.Provider value = {value}>
            {children};
        </HomeStateContext.Provider>

    );

}