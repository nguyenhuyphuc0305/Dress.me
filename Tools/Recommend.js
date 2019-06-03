// Tool that recommends set of clothes when initializes the app
var Clothe = require("../Models/Clothe").Clothe
var WeatherTool = require('./Weather')
var SearchTool = require('./Search')
var DatabaseTool = require('./Database')
var colors = require('colors');

class Recommendation {
    constructor(top, bottom, jacket, shoe) {
        this.top = top
        this.bottom = bottom
        this.jacket = jacket
        this.shoe = shoe
    }
}

// Given the database of user's clothes, this function will get current weather temperature and recommend a set of clothes 
function recommendTodayOutfit(clotheDatabase) {
    return new Promise(async function (resolve) {
        //Get weather first
        var weatherState = ""
        const temperature = await WeatherTool.getWeatherForZip(19104, "imperial")
        console.log("Temperature: " + temperature + "˚F")

        //Get current temperature tag.
        var weather
        if (temperature >= 80) {
            weatherState = "hot"
        }
        else if (temperature >= 60) {
            weatherState = "cool"
        }
        else {
            weatherState = "cold"
        }
        console.log(weatherState)

        var allTops = await SearchTool.searchClothesWithTagsInDatabaseORAND(Clothe.Top, clotheDatabase)
        var topsWithWeather = await SearchTool.searchClothesWithTagsInDatabaseORAND(Clothe.Top + "," + weatherState, clotheDatabase)
        if (topsWithWeather.length > 0) {
            allTops = [...topsWithWeather]
        }
        // console.log(allTops.length)
        // console.log("==========================")
        var allBots = await SearchTool.searchClothesWithTagsInDatabaseORAND(Clothe.Bottom, clotheDatabase)
        var botsWithWeather = await SearchTool.searchClothesWithTagsInDatabaseORAND(Clothe.Bottom + "," + weatherState, clotheDatabase)
        if (botsWithWeather.length > 0) {
            allBots = [...botsWithWeather]
        }
        // console.log(allBots.length)
        // console.log("==========================")
        var allJackets = await SearchTool.searchClothesWithTagsInDatabaseORAND(Clothe.Jacket, clotheDatabase)
        var jacketsWithWeather = await SearchTool.searchClothesWithTagsInDatabaseORAND(Clothe.Jacket + "," + weatherState, clotheDatabase)
        if (jacketsWithWeather.length > 0) {
            allJackets = [...jacketsWithWeather]
        }
        // console.log(allJackets.length)
        // console.log("==========================")
        var allShoes = await SearchTool.searchClothesWithTagsInDatabaseORAND(Clothe.Shoe, clotheDatabase)
        var shoesWithWeather = await SearchTool.searchClothesWithTagsInDatabaseORAND(Clothe.Shoe + "," + weatherState, clotheDatabase)
        if (shoesWithWeather.length > 0) {
            allShoes = [...shoesWithWeather]
        }
        // console.log(allShoes.length)
        // console.log("==========================")

        //Done weather selection for now
        //Next step is color matching
        const matchColors = {
            "black": "red",
            "brown": "blue",
            "blue": "white",
            "green": "yellow",
            "purple": "blue",
            "red": "blue",
            "yellow": "green",
            "white": "pink",
            "pink": "white",
            "orange": "black",
            "gray": "blue"
        }

        var finalTop = undefined
        var finalBot = undefined
        var finalJacket = undefined
        var foundBot = false
        var foundJacket = false

        // Find the matching clothes 
        allTops.forEach((top, indexT) => {
            const allTags = top.tags
            allTags.forEach((tag, indexTag) => {
                allBots.forEach((bottom, indexB) => {
                    if (matchColors[tag] != undefined) { //Is color tag
                        bottom.tags.forEach((iTag) => {
                            if (matchColors[tag] == iTag || matchColors[iTag] == tag) {
                                // Stop all
                                finalTop = top
                                finalBot = bottom
                                foundBot = true
                                return
                            }
                        })
                    }
                    if (foundBot) { return }
                })
                allJackets.forEach((jacket, indexJ) => {
                    if (matchColors[tag] != undefined) { //Is color tag
                        jacket.tags.forEach((iTag) => {
                            if (matchColors[tag] == iTag || matchColors[iTag] == tag) {
                                // Stop all
                                if (finalTop == undefined) {
                                    finalTop = top
                                }
                                finalJacket = jacket
                                foundJacket = true
                                return
                            }
                        })
                    }
                    if (foundJacket) { return }
                })
            })
        })

        // console.log(finalTop)
        // console.log(finalBot)
        // console.log(finalJacket)
        //Final selection
        if (finalTop == undefined) {
            finalTop == allTops[Math.floor(Math.random() * allTops.length)];
        }
        if (finalBot == undefined) {
            finalBot = allBots[Math.floor(Math.random() * allBots.length)];
        }
        if (finalJacket == undefined) {
            finalJacket = allJackets[Math.floor(Math.random() * allJackets.length)];
        }
        const finalShoes = allShoes[Math.floor(Math.random() * allShoes.length)];

        const newRecommendation = new Recommendation(finalTop, finalBot, finalJacket, finalShoes)
        resolve(newRecommendation)
    })
}

// async function main() {
//     DatabaseTool.getAllClothesAndParseItIntoObjects().then(async database => {
//         const a = await recommendTodayOutfit(database)
//         console.log(a)
//     })
// }

// main()

module.exports = { recommendTodayOutfit }