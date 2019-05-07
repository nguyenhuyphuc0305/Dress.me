//#region Stupid lengthy import
//For copying and moving files
var path = require('path')

//For hash generation (id for image)
const md5File = require('md5-file')

//For firestore (database)
const admin = require('firebase-admin')
const serviceAccount = require('../ServiceAccountKey.json')
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
function uploadFileToStorageAndReturnLink(imagePath) {
    return new Promise(async function (resolve) {
        // Uploads a local file to the bucket
        await storage.bucket(bucketName).upload(imagePath, {
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
    })
}

function handleImagesInAndUpdateDatabase(imagePaths) {
    return new Promise(function (resolve) {
        var allClothes = []
        //Copy to database
        imagePaths.forEach(async function (imagePath) {
            const imageID = md5File.sync(imagePath)
            const imagePathOnStorage = await uploadFileToStorageAndReturnLink(imagePath)

            const imageData = {
                imageID: imageID,
                imageName: imageID,
                imagePath: imagePathOnStorage,
                tags: [],
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

function addOrDeleteTagFromImageWithID(clotheID, tagName) {
    return new Promise(function (resolve) {
        db.collection('clothes').doc(clotheID).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log("No image found")
                } else {
                    // console.log(doc.data())
                    var savedTags = doc.data().tags
                    if (savedTags.indexOf(tagName) > -1) {
                        savedTags.splice(savedTags.indexOf(tagName), 1)
                    } else {
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
                    const savedTags = doc.data().tags
                    savedTags.clean("")
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
                        const receivedSavedClothe = new Clothe(doc.data().imageID, doc.data().imageName, doc.data().imagePath, doc.data().tags)
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
    const test = await handleImagesInAndUpdateDatabase(["/Users/crzqag/Desktop/NodeJS/Electron/Dress.me/DevelopmentMode/1.png", "/Users/crzqag/Desktop/NodeJS/Electron/Dress.me/DevelopmentMode/2.png"])
    await addOrDeleteTagFromImage(test[0], "red")
    // var a = await readTagsForImage(test[0])
    // console.log(a)
    // const sample = await getAllClothesAndParseItIntoObjects()
}

// main()

module.exports = { handleImagesInAndUpdateDatabase, addOrDeleteTagFromImageWithID, readTagsForImageWithID, getAllClothesAndParseItIntoObjects, deleteClotheWithImageID }