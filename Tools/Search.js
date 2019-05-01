var Clothe = require("../Models/Clothe").Clothe
var DatabaseWrapper = require('./Database')

function searchClothesWithTags(searchString) {
    return new Promise(async function (resolve) {
        const allClothes = await DatabaseWrapper.getAllClothesAndParseItIntoObjects()
        var result = []
        searchString = searchString.toLowerCase()
        allClothes.forEach(function (clothe) {
            clothe.tags.forEach(function (tag) {
                if (searchString.includes(tag)) {
                    result.push(clothe)
                }
            })
        })
        result = [...new Set(result)];
        resolve(result)
    })
}

async function main() {
    const a = await searchClothesWithTags('find me red clothes')
    console.log(a)
}

// main()

module.exports = { searchClothesWithTags }