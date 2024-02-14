import {DocumentScanner, ResponseType, ScanDocumentResponseStatus} from 'capacitor-document-scanner'
import {Filesystem} from "@capacitor/filesystem"



const scanDocument= async () => {
    const { scannedImages, status } = await DocumentScanner.scanDocument(
        {
            letUserAdjustCrop : false,
            croppedImageQuality: 80,
            responseType: ResponseType.Base64
        }
    )

    if(status === ScanDocumentResponseStatus.Success){
        scannedImages?.map((image, index) => {

        })
    }

}
