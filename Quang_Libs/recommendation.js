var fs = require('fs');
var path = require('path');
var WeatherTool = require('../Quang_Libs/weather')

class Recommendation {
    constructor(top, bot, jacket, shoe, dress) {
        this.top = top
        this.bot = bot
        this.jacket = jacket
        this.shoe = shoe
        this.dress = dress
    }
}

async function helloworld() {
    // var newClothe = new Clothe('top', ['red'], ['sunny'], ['waterproof'])
    // console.log(newClothe.colors)
    // console.log(Clothe.Top)
    // var a = await convertDatabaseToClasses('Clothes')
    // console.log("Number of images found:", a.length)
    var result = await getClothesWithTags("orange top")
    console.log(result.length + " result(s) for search 'orange top'.")

    var latestRecommend = await letsRecommend()
    console.log(latestRecommend)
}

async function letsRecommend() {
    return new Promise(async function (resolve) {
        //Get weather first
        const temperature = await WeatherTool.getWeatherForZip(19104, "imperial")
        console.log("Temperature: " + temperature + "˚F")

        var allTops = await getClothesWithTags(Clothe.Top)
        var allBots = await getClothesWithTags(Clothe.Bottom)
        var allShoes = await getClothesWithTags(Clothe.Shoe)

        //FIXME: Ricky, pls write your if/else code here
        //Everything is on your hands now

        const newRecommendation = new Recommendation(allTops[0], allBots[0], undefined, allShoes[0], undefined)
        resolve(newRecommendation)
    })
}

function getClothesWithTags(searchString) {
    return new Promise(async function (resolve) {
        var allClothes = await convertDatabaseToClasses('Clothes')
        var result = []
        searchString = searchString.toLowerCase()
        allClothes.forEach(function (clothe, index) {
            if (clothe.type) {
                if (searchString.includes(clothe.type)) {
                    result.push(clothe)
                }
            }
            if (clothe.colors.length > 0) {
                clothe.colors.forEach(function (color) {
                    if (searchString.includes(color)) {
                        result.push(clothe)
                    }
                })
            }
            if (clothe.suitableConditions.length > 0) {
                clothe.suitableConditions.forEach(function (condition) {
                    if (searchString.includes(condition)) {
                        result.push(clothe)
                    }
                })
            }
            if (clothe.abilities.length > 0) {
                clothe.abilities.forEach(function (ability) {
                    if (searchString.includes(ability)) {
                        result.push(clothe)
                    }
                })
            }
        })
        result = [...new Set(result)];
        resolve(result)
    })
}

// function convertDatabaseToClasses(databasePath) {
//     return new Promise(resolve => {
//         const tempPath = path.join(__dirname, "..", databasePath)
//         var result = []
//         fs.readdir(tempPath, function (err, files) {
//             if (err != undefined) { console.log("Error loading database") }
//             files.forEach(function (file, index) {
//                 //Only accept png or jpeg
//                 if (path.parse(file).ext != ".png" && path.parse(file).ext != ".jpg" && path.parse(file).ext != ".jpeg") {
//                     return
//                 }
//                 const filePath = path.join(__dirname, "..", databasePath, file)
//                 const tagPath = path.join(__dirname, "..", databasePath, path.parse(file).name) + ".txt"
//                 // console.log(filePath)
//                 // console.log(tagPath)

//                 var tags = fs.readFileSync(tagPath).toString().split("\n");
//                 tags = tags.filter(v => v != '');
//                 // console.log(tags)

//                 var type = ""
//                 var colors = []
//                 var suitableConditions = []
//                 var abilities = []

//                 tags.forEach(function (tag, index) {
//                     //Handle type
//                     if (tag.toLowerCase() == Clothe.Bottom) { type = Clothe.Bottom }
//                     else if (tag.toLowerCase() == Clothe.Top) { type = Clothe.Top }
//                     else if (tag.toLowerCase() == Clothe.Dress) { type = Clothe.Dress }
//                     else if (tag.toLowerCase() == Clothe.Shoe) { type = Clothe.Shoe }

//                     //Handle colors
//                     if (tag.toLowerCase() == Clothe.Black) { colors.push(Clothe.Black) }
//                     else if (tag.toLowerCase() == Clothe.Brown) { colors.push(Clothe.Brown) }
//                     else if (tag.toLowerCase() == Clothe.Blue) { colors.push(Clothe.Blue) }
//                     else if (tag.toLowerCase() == Clothe.Green) { colors.push(Clothe.Green) }
//                     else if (tag.toLowerCase() == Clothe.Purple) { colors.push(Clothe.Purple) }
//                     else if (tag.toLowerCase() == Clothe.Red) { colors.push(Clothe.Red) }
//                     else if (tag.toLowerCase() == Clothe.Yellow) { colors.push(Clothe.Yellow) }
//                     else if (tag.toLowerCase() == Clothe.White) { colors.push(Clothe.White) }
//                     else if (tag.toLowerCase() == Clothe.Pink) { colors.push(Clothe.Pink) }
//                     else if (tag.toLowerCase() == Clothe.Orange) { colors.push(Clothe.Orange) }
//                     else if (tag.toLowerCase() == Clothe.Gray) { colors.push(Clothe.Gray) }

//                     //Handle conditions
//                     if (tag.toLowerCase() == Clothe.Sunny) { suitableConditions.push(Clothe.Sunny) }
//                     else if (tag.toLowerCase() == Clothe.Chilly) { suitableConditions.push(Clothe.Chilly) }
//                     else if (tag.toLowerCase() == Clothe.Warm) { suitableConditions.push(Clothe.Warm) }
//                     else if (tag.toLowerCase() == Clothe.Cold) { suitableConditions.push(Clothe.Cold) }

//                     //Handle abilities
//                     if (tag.toLowerCase() == Clothe.Waterproof) { abilities.push(Clothe.Waterproof) }
//                     else if (tag.toLowerCase() == Clothe.Snowproof) { abilities.push(Clothe.Snowproof) }
//                 })
//                 const newClothe = new Clothe(filePath, type, colors, suitableConditions, abilities)
//                 result.push(newClothe)
//             })
//             resolve(result)
//         })
//     })
// }

helloworld()

module.exports = {convertDatabaseToClasses}