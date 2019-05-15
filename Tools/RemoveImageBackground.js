import { RemoveBgResult, RemoveBgError, removeBackgroundFromImageFile } from "remove.bg";

function removeBackgroundForImageWithPath() {
    removeBackgroundFromImageFile({
        path: localFile,
        apiKey: "YOUR-API-KEY",
        size: "regular",
        type: "auto",
        outputFile
    }).then(() => {

    })
}