var colors = require('colors');
const { dialog } = require('electron')

var DatabaseWrapper = require('./Database')

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'gFAejnywyJHc_TV32_avt-2bDJZKFBP7SgLvFLNMuCUr',
    headers: { 'X-Watson-Learning-Opt-Out': 'true' }
});

function getTagsForAllClothes(allClothes) {
    var errorAlreadyShown = false
    return new Promise(function (resolve, reject) {
        notProcessedClothes = allClothes.filter(function (clothe) {
            return !clothe.isProcessed
        })
        var completedClothes = 0
        if (notProcessedClothes.length == 0) {
            resolve()
        }
        var error = undefined
        notProcessedClothes.forEach(async function (clothe, index) {

            var params = {
                url: clothe.imagePath,
                owners: ['me'],
                threshold: 0.2,
            };

            // if (index == 0) {
            await visualRecognition.classify(params, function (err, response) {
                if (err) {
                    if (!errorAlreadyShown){
                        dialog.showErrorBox("Unexpected error occurred.", "Failed on attempting to connect to IBM. Error code: 183.")
                        errorAlreadyShown = !errorAlreadyShown
                        console.log(err);
                    }
                    reject(error)
                } else {
                    handleIBMResultAndPutTagsOnDatabase(response, clothe.imageID).then(function () {
                        DatabaseWrapper.updateIsProcessedState(clothe.imageID).then(() => {
                            completedClothes += 1
                            console.log(`${completedClothes / notProcessedClothes.length * 100}% processed.`.yellow)
                            if (completedClothes == notProcessedClothes.length) {
                                resolve()
                            }
                        })
                    })
                }
            });
        // }
        })
    })
}

async function handleIBMResultAndPutTagsOnDatabase(response, imageID) {
    return new Promise(function (resolve) {
        //Do some manipulation and push got tags here here
        // console.log(JSON.stringify(response, null, 2).green)
        if (response.images.length <= 0) { resolve() }
        else {
            const classes = response.images[0].classifiers[0].classes
            var allTags = []
            classes.forEach(function (iClass) {
                if (iClass.class) {
                    var gotTag = iClass.class
                    if (gotTag == "Shoes") { gotTag = "shoe" }
                    else if (gotTag == "Bottom") { gotTag = "bottom" }
                    else if (gotTag == "Top") { gotTag = "top" }
                    else {
                        gotTag = gotTag.toLowerCase()
                    }
                    //FIXME
                    allTags.push(gotTag)
                }
            })
            // console.log(allTags)
            DatabaseWrapper.applyTagsToImageWithID(imageID, allTags).then(() => {
                resolve()
            })
        }
    })
}

async function main() {
    DatabaseWrapper.getAllClothesAndParseItIntoObjects().then(function(database) {
        getTagsForAllClothes(database).then(() => {
            console.log("Successfully loaded tags.".rainbow)
        })
    })
}

// main()

module.exports = { getTagsForAllClothes }