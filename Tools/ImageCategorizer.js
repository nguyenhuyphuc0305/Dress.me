var colors = require('colors');

var DatabaseWrapper = require('./Database')

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'VFXGowsYbtnTttbwHWJAE9zAJwp0DeMMOYO709YjlwRi',
    headers: { 'X-Watson-Learning-Opt-Out': 'true' }
});

function getTagsForAllClothes(allClothes) {
    notProcessedClothes = allClothes.filter(function (clothe) {
        return !clothe.isProcessed
    })
    var completedClothes = 0
    return new Promise(function (resolve) {
        if (notProcessedClothes.length == 0) {
            resolve()
        }
        notProcessedClothes.forEach(function (clothe) {
            var params = {
                url: clothe.imagePath,
                owners: ['me'],
                threshold: 0.6,
            };

            visualRecognition.classify(params, function (err, response) {
                if (err) {
                    console.log(err);
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