import config from "../../config.json";
import axios from "axios";
import {baseConfig} from "./index";
import {Note} from "../model/Note";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {Buffer} from "buffer";
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
    const url = new URL(presignedUrl);

    let objectPath = url.pathname;

    let index1 = objectPath.indexOf("/");
    let index2 = objectPath.indexOf("?");

    const result = objectPath.slice(index1 + 1, index2 - 1);

    return result;

}
const awsInstance = axios.create();
delete awsInstance.defaults.headers.common["Authorization"];
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

    awsGetImage: async (url: string): Promise<string> => {
        try{

            const objectKey = getObjectKeyFromPresignedURL(url) || "";
            console.log(`Object key is ${objectKey}`);

            const result = await awsInstance.get(url, {
                responseType: "arraybuffer"
            });
            const buffer = Buffer.from(result.data).toString("base64");
            await Filesystem.writeFile({
                data: buffer,
                path: `cache/${objectKey}`,
                directory: Directory.Data,

            });

            return objectKey;

        }catch(e){
            console.log(e);
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
            const file = await readFile(filePath);

            if (!file) throw new Error("Unable to read the specified file");


            let formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`${notesUrl}/upload?id=${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (e) {
            // @ts-ignore
            console.log(e.message);
            throw e;
        }
    }

}

const readFile = async(name: string) => {
    const file = await Filesystem.readFile({
        path: `to_upload/${name}`,
        directory: Directory.Data,

    });
    if(typeof file.data === "string"){
        const base64data = file.data;
        const byteNumbers = atob(base64data).split('');

        const byteArrays = new Uint8Array(byteNumbers.length);
        for (let i = 0; i < byteNumbers.length; ++i){
            byteArrays[i] = byteNumbers[i].charCodeAt(0);
        }

        const blob = new Blob([byteArrays]);

        return new File([blob], name, {type: 'image/jpg'});

    }else{
        return file.data;
    }
}