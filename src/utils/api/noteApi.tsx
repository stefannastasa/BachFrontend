import config from "../../config.json";
import axios from "axios";
import {baseConfig} from "./index";
import {Note} from "../model/Note";


export interface GetResponse {
    notes: Note[],
}
export interface CreateResponse{
    createdNote: Note,
}

const notesUrl = `http://${config.baseUrl}/api/notes`

export const NoteService = {

    apiGetNotes: async (page: number, size: number): Promise<GetResponse> => {
        try{
            const result = await axios.get(`${notesUrl}?page=${page}&size=${size}`, baseConfig);
            return result.data;
            // TODO fetch for each note their images from AWS, if they are not saved in local storage
        }catch(e){
            throw e;
        }
    },

    apiCreateNote: async (title: string, image_data: string[]): Promise<CreateResponse> => {
        try{
            const result = await axios.post(`${notesUrl}`, {title: title, number_of_files: image_data.length}, baseConfig);
            return result.data;
        }catch( e ){
            throw e;
        }
    },

    apiSearchNotes: async (searchString: string, page: number, size: number): Promise<GetResponse> => {
        try{
            const result = await axios.get(`${notesUrl}/filter?title=${searchString}&page=${page}&size=${size}`);
            return result.data;
        }catch(e){
            throw e;
        }
    }

}