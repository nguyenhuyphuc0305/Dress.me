var colors = require('colors');

//#region Stupid lengthy import
//For renaming files
var path = require('path')
var fs = require('fs');

//For hash generation (id for image)
const md5File = require('md5-file')

//For firestore (database)
const admin = require('firebase-admin')
const serviceAccount = require('./ServiceAccountKey.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dressme-asian47.firebaseio.com"
});
const db = admin.firestore()

//For online storage
const { Storage } = require('@google-cloud/storage');
// Creates a client
const storage = new Storage({
    projectId: "dressme-asian47",
    keyFilename: './ServiceAccountKey.json'
});
const bucketName = 'gs://dressme-asian47.appspot.com';
//#endregion

//Custom class
var Clothe = require("../Models/Clothe").Clothe

//All Properties

//All methods
function uploadFileToStorageAndReturnLink(imagePath, newName) {
    return new Promise(async function (resolve) {
        var currentDir = path.dirname(imagePath)
        var newDirName = path.join(currentDir, newName) + "." + imagePath.split('.').pop()
        console.log(newDirName)
        fs.rename(imagePath, newDirName, async function (err) {
            if (err) console.log('ERROR: ' + err);
            // Uploads a local file to the bucket
            await storage.bucket(bucketName).upload(newDirName, {
                // Support for HTTP requests made with `Accept-Encoding: gzip`
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            }, function (err, file) {
                if (err) { console.log(err) } else {
                    const result = `https://firebasestorage.googleapis.com/v0/b/dressme-asian47.appspot.com/o/${file.name}?alt=media&token=bf232cdc-4d68-4f8f-89c7-94388dea3b78`;
                    resolve(result)
                }
            })
        });
    })
}

function handleImagesInAndUpdateDatabase(imagePaths) {
    return new Promise(function (resolve) {
        var allClothes = []
        //Copy to database
        imagePaths.forEach(async function (imagePath) {
            const imageID = md5File.sync(imagePath)
            const imagePathOnStorage = await uploadFileToStorageAndReturnLink(imagePath, imageID)

            const imageData = {
                imageID: imageID,
                imageName: path.basename(imagePath),
                imagePath: imagePathOnStorage,
                tags: [],
                isProcessed: false,
            }

            db.collection('clothes').doc(imageID).set(imageData)

            //Store in variables as well
            const newClothe = new Clothe(imageID, path.basename(imagePath), imagePath, [])
            allClothes.push(newClothe)
            allClothes = [...new Set(allClothes)]

            if (allClothes.length == imagePaths.length) {
                resolve(allClothes)
            }
        })
    })
}

// function getDownloadableLinkForImageWithID(clotheID) {
//     return new Promise(function (resolve) {
//         storage.bucket(bucketName).file(clotheID).getSignedUrl({
//             action: 'read',
//             expires: '03-09-2020'
//         }).then(function (urls) {
//             resolve(urls)
//         })
//     })
// }

function addOrDeleteTagFromImageWithID(clotheID, tagName) {
    return new Promise(function (resolve) {
        db.collection('clothes').doc(clotheID).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log("No image found")
                } else {
                    // console.log(doc.data())
                    var savedTags = doc.data().tags
                    if (savedTags != undefined && savedTags.indexOf(tagName) > -1) {
                        savedTags.splice(savedTags.indexOf(tagName), 1)
                    } else {
                        if (savedTags == undefined) {
                            savedTags = []
                        }
                        savedTags.push(tagName)
                    }
                    savedTags = [...new Set(savedTags)]
                    db.collection('clothes').doc(clotheID).update({
                        tags: savedTags
                    })
                        .then(() => {
                            resolve()
                        })
                }
            })
            .catch(err => {
                console.log(err)
            })
    })
}

function applyTagsToImageWithID(clotheID, newTags) {
    return new Promise(function (resolve) {
        db.collection('clothes').doc(clotheID).update({
            tags: newTags
        })
        .then(() => {
            resolve()
        })
    })
}

function updateIsProcessedState(clotheID) {
    return new Promise(function (resolve) {
        // db.collection('clothes').doc(clotheID).update({
        //     isProcessed: true
        // })
        // .then(() => {
        //     resolve()
        // })
        resolve()
    })
}

Array.prototype.clean = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function readTagsForImageWithID(clotheID) {
    return new Promise(function (resolve) {
        db.collection('clothes').doc(clotheID).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log("No image found")
                } else {
                    var savedTags = doc.data().tags
                    
                    if (savedTags == undefined) {
                        savedTags = []
                    }
                    else {
                        savedTags.clean("")
                    }
                    resolve(savedTags)
                }
            })
            .catch(err => {
                console.log(err)
            })
    })
}

function getAllClothesAndParseItIntoObjects() {
    return new Promise(function (resolve) {
        var allClothes = []
        db.collection('clothes').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log("No image found")
                } else {
                    snapshot.forEach(doc => {
                        const isProcessed = doc.data().isProcessed
                        const receivedSavedClothe = new Clothe(doc.data().imageID, doc.data().imageName, doc.data().imagePath, doc.data().tags, isProcessed)
                        allClothes.push(receivedSavedClothe)
                        if (allClothes.length == snapshot.docs.length) {
                            resolve(allClothes)
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    })
}

function deleteClotheWithImageID(clotheID) {
    db.collection('clothes').doc(clotheID).delete()
}

async function main() {
    // searchClothesWithTags(['red'])
    // const test = await handleImagesInAndUpdateDatabase(["/Users/crzqag/Desktop/NodeJS/Electron/Dress.me/DevelopmentMode/1.png", "/Users/crzqag/Desktop/NodeJS/Electron/Dress.me/DevelopmentMode/2.png"])
    // await addOrDeleteTagFromImage(test[0], "red")
    // const result = await getDownloadableLinkForImageWithID("500ce8ba9d80ce9072703532708fe7f5")
    console.log(result)
    // var a = await readTagsForImage(test[0])
    // console.log(a)
    // const sample = await getAllClothesAndParseItIntoObjects()
}

// main()

module.exports = { handleImagesInAndUpdateDatabase, addOrDeleteTagFromImageWithID, readTagsForImageWithID, getAllClothesAndParseItIntoObjects, deleteClotheWithImageID, applyTagsToImageWithID, updateIsProcessedState }