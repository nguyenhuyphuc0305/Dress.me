var Clothe = require("../Models/Clothe").Clothe
var DatabaseWrapper = require('./Database')

function searchClothesWithTagsInDatabase(searchString, database) {
    return new Promise(async function (resolve) {
        const allClothes = database
        var result = []
        if (searchString == null) {
            allClothes.forEach(function (clothe) {
                if (clothe.tags.length == 0) {
                    result.push(clothe)
                }
                else if (!clothe.tags.includes(Clothe.Top) && !clothe.tags.includes(Clothe.Bottom) && !clothe.tags.includes(Clothe.Jacket) && !clothe.tags.includes(Clothe.Shoe)) {
                    result.push(clothe)
                }
            })
        }
        else {
            searchString = searchString.toLowerCase()
            allClothes.forEach(function (clothe) {
                clothe.tags.forEach(function (tag) {
                    if (searchString.includes(tag)) {
                        result.push(clothe)
                    }
                })
            })
        }
        result = [...new Set(result)];
        resolve(result)
    })
}

function searchClothesWithTagsInDatabaseAND(searchString, database) {
    return new Promise(function (resolve) {
        const allClothes = database
        var result = []
        const allTags = searchString.split(",")
        allClothes.forEach(function (clothe) {
            var score = 0
            allTags.forEach(function (tag) {
                if (clothe.tags.includes(tag)) {
                    score += 1
                }
            })
            if (score == allTags.length) {
                result.push(clothe)
            }
        })
        result = [...new Set(result)];
        resolve(result)
    })
}

async function main() {
    // const a = await searchClothesWithTagsInDatabase('find me red clothes')
    // console.log(a)
}

// main()

module.exports = { searchClothesWithTagsInDatabase, searchClothesWithTagsInDatabaseAND }