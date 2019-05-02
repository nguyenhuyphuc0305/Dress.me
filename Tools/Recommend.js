var Clothe = require("../Models/Clothe").Clothe
var WeatherTool = require('./Weather')
var SearchTool = require('./Search')

class Recommendation {
    constructor(top, jacket, bottom, shoe) {
        this.top = top
        this.jacket = jacket
        this.bottom = bottom
        this.shoe = shoe
    }
}

function recommendTodayOutfit(clotheDatabase) {
    return new Promise(async function(resolve) {
        //Get weather first
        const temperature = await WeatherTool.getWeatherForZip(19104, "imperial")

        var allTops = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Top, clotheDatabase)
        var allJackets = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Jacket, clotheDatabase)
        var allBots = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Bottom, clotheDatabase)
        var allShoes = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Shoe, clotheDatabase)

        const newRecommendation = new Recommendation(allTops[0], allJackets[0], allBots[0], allShoes[0])
        resolve(newRecommendation)
    })
}

module.exports = {recommendTodayOutfit}

// async function main() {
//     const a = await recommendTodayOutfit()
//     console.log(a)
// }

// main()