var Clothe = require("../Models/Clothe").Clothe
var WeatherTool = require('../Quang_Libs/weather')
var SearchTool = require('./Search')

class Recommendation {
    constructor(top, bot, shoe) {
        this.top = top
        this.bot = bot
        this.shoe = shoe
    }
}

function recommendTodayOutfit() {
    return new Promise(async function (resolve) {
        //Get weather first
        const temperature = await WeatherTool.getWeatherForZip(19104, "imperial")

        var allTops = await SearchTool.searchClothesWithTags(Clothe.Top)
        var allBots = await SearchTool.searchClothesWithTags(Clothe.Bottom)
        var allShoes = await SearchTool.searchClothesWithTags(Clothe.Shoe)

        const newRecommendation = new Recommendation(allTops[0], allBots[0], allShoes[0])
        resolve(newRecommendation)
    })
}

async function main() {
    const a = await recommendTodayOutfit()
    console.log(a)
}

main()