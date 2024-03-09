import config from "../../config.json";
import axios from "axios";
import {baseConfig} from "./index";
import {Note} from "../model/Note";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";


export interface GetResponse {
    notes: Note[],
}
export interface CreateResponse{
    createdNote: Note,
}
export interface UploadResponse {
    uploadStatus: string,
}
const notesUrl = `http://${config.baseUrl}/api/notes`;

function getObjectKeyFromPresignedURL(presignedUrl: string) {
    const result =  presignedUrl.match("\\/\\d+-[a-zA-Z0-9]+\\?") ;
    if(result)
        return result[0].slice(1, result[0].length-1);

    return null;

}

export const NoteService = {

    apiCreateNote: async (title: string, nr_of_images: number): Promise<CreateResponse> => {
        try {
            const result = await axios.post(`${notesUrl}`, {
                title: title,
                number_of_files: nr_of_images
            }, baseConfig);
            return result.data;
        } catch (e) {
            throw e;
        }
    },

    apiGetNotes: async (page: number, size: number): Promise<GetResponse> => {
        try {

            const result = await axios.get(`${notesUrl}?page=${page}&size=${size}`, baseConfig);
            return result.data;

        } catch (e) {
            throw e;
        }
    },

    awsGetImage: async (url: string): Promise<any> => {
        try{
            console.log(url);
            const objectKey = getObjectKeyFromPresignedURL(url) || "";
            console.log(objectKey);
            let fileExists: boolean | null = null;

            try{
                await Filesystem.stat({
                    path: objectKey,
                    directory: Directory.Data
                });
                fileExists = true;
            }catch(e){
                fileExists = false;
            }

            if(!fileExists){
                const result = await axios.get(url, {
                    responseType: "arraybuffer"
                });
                const blob = new Blob([result.data]);
                await Filesystem.writeFile({
                    data: blob,
                    path: objectKey,
                    directory: Directory.Data,

                });
            }

            return objectKey;

        }catch(e){
            throw e;
        }
    },

    apiSearchNotes: async (searchString: string, page: number, size: number): Promise<GetResponse> => {
        try {
            const result = await axios.get(`${notesUrl}/filter?title=${searchString}&page=${page}&size=${size}`);
            return result.data;
        } catch (e) {
            throw e;
        }
    },

    apiUploadImage: async (id: string, filePath: string): Promise<UploadResponse> => {
        try {
            let formData = new FormData();
            const file = await Filesystem.readFile({
                path: filePath,
                directory: Directory.Data,
                encoding: Encoding.UTF8
            });
            if(typeof file.data === "string"){
                const encoder = new TextEncoder();
                const uint8Array = encoder.encode(file.data);
                const blob = new Blob([uint8Array], { type: 'text/plain' });

                formData.set("file", blob, filePath);
            }else{
                formData.set("file", file.data, filePath);
            }

            const response = await axios.post(`${notesUrl}/upload?id=${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

}