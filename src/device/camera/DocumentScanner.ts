import {DocumentScanner, ResponseType, ScanDocumentResponseStatus} from "capacitor-document-scanner";
import {Directory, Filesystem} from "@capacitor/filesystem";

export const scanDocument = async () : Promise<string[] | null> => {
    try {
        const { scannedImages, status }
            = await DocumentScanner.scanDocument({
            responseType: ResponseType.ImageFilePath
        });
        const fileUris : string[] = Array.of();

        if (status === ScanDocumentResponseStatus.Success && scannedImages?.length) {
            // set the image src to the scanned image file path
            // TODO: send the images to the server in an async manner
            for (const scannedImage of scannedImages) {
                console.log(scannedImage);
                const filename =  generateRandomFilename();

                const result = await rewriteFile(`to_upload/${filename}`, scannedImage);
                fileUris.push(filename);
            }
            return fileUris;
        }

    } catch (error) {
        // something went wrong during the document scan
        console.log(error);
        throw error;
    }
    return null;
}

function grabFileName(path: string) {
    const ind1 = path.lastIndexOf("/");
    return path.slice(ind1+1);
}

async function rewriteFile(path: string, sourcePath: string){
    try{
        const stat = await Filesystem.stat({
            path: "to_upload",
            directory: Directory.Data
        });

    }catch(e){
        await Filesystem.mkdir({
            path: "to_upload",
            directory: Directory.Data
        });
    }
    const filename = grabFileName(sourcePath);

    const image = await Filesystem.readFile({
        path: sourcePath
    })
    return await Filesystem.writeFile({
        path,
        data: image.data,
        directory: Directory.Data,

    });
}

function generateRandomFilename(): string {
    const time = new Date().getTime();
    const fileBaseName = Math.random().toString(36).substring(2, 8);
    return `${time}-${fileBaseName}`;
}