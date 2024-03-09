import {DocumentScanner, ResponseType, ScanDocumentResponseStatus} from "capacitor-document-scanner";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";

export const scanDocument = async () : Promise<string[] | null> => {
    try {
        const { scannedImages, status }
            = await DocumentScanner.scanDocument({
            responseType: ResponseType.Base64
        });
        const fileUris : string[] = Array.of();

        if (status === ScanDocumentResponseStatus.Success && scannedImages?.length) {
            // set the image src to the scanned image file path
            // TODO: send the images to the server in an async manner
            for (const scannedImage of scannedImages) {
                const filename = generateRandomFilename();
                const result = await Filesystem.writeFile({
                    path: filename,
                    data: scannedImage,
                    directory: Directory.Data,

                });
                fileUris.push(filename);
            }
            return fileUris
        }

    } catch (error) {
        // something went wrong during the document scan
        throw error;
    }
    return null;
}

async function writeFile(path: string, data: string){
    return await Filesystem.writeFile({
        path,
        data,
        directory: Directory.Data,
    });
}

function generateRandomFilename(): string {
    const time = new Date().getTime();
    const fileBaseName = Math.random().toString(36).substring(2, 8);
    return `${time}-${fileBaseName}`;
}