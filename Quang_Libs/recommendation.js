var fs = require('fs');
var path = require('path');
var WeatherTool = require('../Quang_Libs/weather')

class Clothe {

    //For types
    //#region 
    static get Top() {
        return "top"
    }
    static get Bottom() {
        return "bottom"
    }
    static get Jacket() {
        return "jacket"
    }
    static get Shoe() {
        return "shoes"
    }
    //#endregion

    //For colors
    //#region 
    static get Black() {
        return 'black'
    }
    static get Brown() {
        return 'brown'
    }
    static get Blue() {
        return 'blue'
    }
    static get Green() {
        return 'green'
    }
    static get Purple() {
        return 'purple'
    }
    static get Red() {
        return 'red'
    }
    static get Yellow() {
        return 'yellow'
    }
    static get White() {
        return 'white'
    }
    static get Pink() {
        return 'pink'
    }
    static get Orange() {
        return 'orange'
    }
    static get Gray() {
        return 'gray'
    }
    //#endregion

    //For conditions
    //#region 
    static get Sunny() {
        return 'sunny'
    }
    static get Chilly() {
        return 'chilly'
    }
    static get Warm() {
        return 'warm'
    }
    static get Cold() {
        return 'cold'
    }
    //#endregion

    //For abilities
    //#region 
    static get Waterproof() {
        return "waterproof"
    }
    static get Snowproof() {
        return "snowproof"
    }
    //#endregion

    constructor(imagePath, type, colors = [], suitableConditions = [], abilities = []) {
        this.imagePath = imagePath
        this.type = type
        this.colors = colors
        this.suitableConditions = suitableConditions
        this.abilities = abilities
    }
}

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


    // var result = await getClothesWithTags("orange top")
    // console.log(result.length + " result(s) for search 'orange top'.")

    // var latestRecommend = await letsRecommend()
    // console.log(latestRecommend)
    return new Promise(async function (resolve) {
        var result = {
            'top': [],
            'bottom': [],
            'jacket': [],
            'shoes': [],
            'black': [],
            'brown': [],
            'blue': [],
            'green': [],
            'purple': [],
            'red': [],
            'yellow': [],
            'white': [],
            'pink': [],
            'orange': [],
            'grey': [],
            'sunny': [],
            'chilly': [],
            'warm': [],
            'cold': [],
            'waterproof': [],
            'snowproof': [],
            'nottype': [],
            'all': []
        }
        var tops = await getClothesWithTags(Clothe.Top)
        var bottoms = await getClothesWithTags(Clothe.Bottom)
        var jackets = await getClothesWithTags(Clothe.Jacket)
        var shoes = await getClothesWithTags(Clothe.Shoe)
        var blacks = await getClothesWithTags(Clothe.Black)
        var browns = await getClothesWithTags(Clothe.Brown)
        var blues = await getClothesWithTags(Clothe.Blue)
        var greens = await getClothesWithTags(Clothe.Green)
        var purples = await getClothesWithTags(Clothe.Purple)
        var reds = await getClothesWithTags(Clothe.Red)
        var yellows = await getClothesWithTags(Clothe.Yellow)
        var whites = await getClothesWithTags(Clothe.White)
        var pinks = await getClothesWithTags(Clothe.Pink)
        var oranges = await getClothesWithTags(Clothe.Orange)
        var grays = await getClothesWithTags(Clothe.Gray)
        var sunnys = await getClothesWithTags(Clothe.Sunny)
        var chillys = await getClothesWithTags(Clothe.Chilly)
        var warms = await getClothesWithTags(Clothe.Warm)
        var colds = await getClothesWithTags(Clothe.Cold)
        var waterproofs = await getClothesWithTags(Clothe.Waterproof)
        var snowproofs = await getClothesWithTags(Clothe.Snowproof)
        tops.forEach(top => { result.top.push(top.imagePath) })
        bottoms.forEach(bottom => { result.bottom.push(bottom.imagePath) })
        jackets.forEach(jacket => { result.jacket.push(jacket.imagePath) })
        shoes.forEach(shoe => { result.shoes.push(shoe.imagePath) })
        blacks.forEach(black => { result.black.push(black.imagePath) })
        browns.forEach(brown => { result.brown.push(brown.imagePath) })
        blues.forEach(blue => { result.blue.push(blue.imagePath) })
        greens.forEach(green => { result.green.push(green.imagePath) })
        purples.forEach(purple => { result.purple.push(purple.imagePath) })
        reds.forEach(red => { result.red.push(red.imagePath) })
        yellows.forEach(yellow => { result.yellow.push(yellow.imagePath) })
        whites.forEach(white => { result.white.push(white.imagePath) })
        pinks.forEach(pink => { result.pink.push(pink.imagePath) })
        oranges.forEach(orange => { result.orange.push(orange.imagePath) })
        grays.forEach(gray => { result.gray.push(gray.imagePath) })
        sunnys.forEach(sunny => { result.sunny.push(sunny.imagePath) })
        chillys.forEach(chilly => { result.chilly.push(chilly.imagePath) })
        warms.forEach(warm => { result.warm.push(warm.imagePath) })
        colds.forEach(cold => { result.cold.push(cold.imagePath) })
        waterproofs.forEach(waterproof => { result.waterproof.push(waterproof.imagePath) })
        snowproofs.forEach(snowproof => { result.snowproof.push(snowproof.imagePath) })

        var isType = result.top.concat(result.bottom, result.jacket, result.shoes)
        var allClothe = await convertDatabaseToClasses('Clothes')
        var allPath = []
        allClothe.forEach(clothe => allPath.push(clothe.imagePath))
        var notType = allPath.filter(path => { return (isType.indexOf(path) < 0) })
        notType.forEach(nottype => { result.nottype.push(nottype) })
        allPath.forEach(each => result.all.push(each))
        resolve(result)
    })
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

function convertDatabaseToClasses(databasePath) {
    return new Promise(resolve => {
        const tempPath = path.join(__dirname, "..", databasePath)
        var result = []
        fs.readdir(tempPath, function (err, files) {
            if (err != undefined) { console.log("Error loading database") }
            files.forEach(function (file, index) {
                //Only accept png or jpeg
                if (path.parse(file).ext != ".png" && path.parse(file).ext != ".jpg" && path.parse(file).ext != ".jpeg") {
                    return
                }
                const filePath = path.join(__dirname, "..", databasePath, file)
                const tagPath = path.join(__dirname, "..", databasePath, path.parse(file).name) + ".txt"
                // console.log(filePath)
                // console.log(tagPath)

                var tags = fs.readFileSync(tagPath).toString().split("\n");
                tags = tags.filter(v => v != '');
                // console.log(tags)

                var type = ""
                var colors = []
                var suitableConditions = []
                var abilities = []

                tags.forEach(function (tag, index) {
                    //Handle type
                    if (tag.toLowerCase() == Clothe.Bottom) { type = Clothe.Bottom }
                    else if (tag.toLowerCase() == Clothe.Top) { type = Clothe.Top }
                    else if (tag.toLowerCase() == Clothe.Jacket) { type = Clothe.Jacket }
                    else if (tag.toLowerCase() == Clothe.Shoe) { type = Clothe.Shoe }

                    //Handle colors
                    if (tag.toLowerCase() == Clothe.Black) { colors.push(Clothe.Black) }
                    else if (tag.toLowerCase() == Clothe.Brown) { colors.push(Clothe.Brown) }
                    else if (tag.toLowerCase() == Clothe.Blue) { colors.push(Clothe.Blue) }
                    else if (tag.toLowerCase() == Clothe.Green) { colors.push(Clothe.Green) }
                    else if (tag.toLowerCase() == Clothe.Purple) { colors.push(Clothe.Purple) }
                    else if (tag.toLowerCase() == Clothe.Red) { colors.push(Clothe.Red) }
                    else if (tag.toLowerCase() == Clothe.Yellow) { colors.push(Clothe.Yellow) }
                    else if (tag.toLowerCase() == Clothe.White) { colors.push(Clothe.White) }
                    else if (tag.toLowerCase() == Clothe.Pink) { colors.push(Clothe.Pink) }
                    else if (tag.toLowerCase() == Clothe.Orange) { colors.push(Clothe.Orange) }
                    else if (tag.toLowerCase() == Clothe.Gray) { colors.push(Clothe.Gray) }

                    //Handle conditions
                    if (tag.toLowerCase() == Clothe.Sunny) { suitableConditions.push(Clothe.Sunny) }
                    else if (tag.toLowerCase() == Clothe.Chilly) { suitableConditions.push(Clothe.Chilly) }
                    else if (tag.toLowerCase() == Clothe.Warm) { suitableConditions.push(Clothe.Warm) }
                    else if (tag.toLowerCase() == Clothe.Cold) { suitableConditions.push(Clothe.Cold) }

                    //Handle abilities
                    if (tag.toLowerCase() == Clothe.Waterproof) { abilities.push(Clothe.Waterproof) }
                    else if (tag.toLowerCase() == Clothe.Snowproof) { abilities.push(Clothe.Snowproof) }
                })
                const newClothe = new Clothe(filePath, type, colors, suitableConditions, abilities)
                result.push(newClothe)
            })
            resolve(result)
        })
    })
}

// helloworld()

module.exports = { helloworld }