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

async function main() {
    // const a = await searchClothesWithTagsInDatabase('find me red clothes')
    // console.log(a)
}

// main()

module.exports = { searchClothesWithTagsInDatabase }