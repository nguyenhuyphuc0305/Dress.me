//For easier manipulation of DOM
var $ = require("jquery");

//Import neccessary Tools and Models used by this file
var DatabaseWrapper = require('../../Tools/Database')
var SearchTool = require("../../Tools/Search")
var Clothe = require("../../Models/Clothe").Clothe
var RecommendTool = require("../../Tools/Recommend")

var clothesDatabase = []
const buttonList = ['icon-button-top', 'icon-button-jacket', 'icon-button-bottom', 'icon-button-shoes']
var current = ''

main()

async function main() {
    clothesDatabase = await DatabaseWrapper.getAllClothesAndParseItIntoObjects()
    displayRecommendation()
    showTopOnLoad()
    setTypeOnClick()
}

async function displayRecommendation() {
    const recommendation = await RecommendTool.recommendTodayOutfit(clothesDatabase)
    console.log(recommendation)

    $(".top").remove()
    $('.clothes-display-container').append("<img class='" + "top" + "' src='" + recommendation.top.imagePath + "'>")

    $(".jacket").remove()
    $('.clothes-display-container').append("<img class='" + "jacket" + "' src='" + recommendation.jacket.imagePath + "'>")

    $(".bottom").remove()
    $('.clothes-display-container').append("<img class='" + "bottom" + "' src='" + recommendation.bottom.imagePath + "'>")

    $(".shoes").remove()
    $('.clothes-display-container').append("<img class='" + "shoes" + "' src='" + recommendation.shoe.imagePath + "'>")
}

async function showTopOnLoad() {
    current = 'top'
    $('.main-clothes').remove()

    const allTops = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Top, clothesDatabase)
    allTops.forEach(function (clothe) {
        $('.below-below-clothes-select-header').append("<img class='col span-1-of-3 main-clothes' id='main." + clothe.imageID + "' src='" + clothe.imagePath + "'>")
    })

    $('#icon-button-top').addClass('current-one')
    $('#icon-button-top path').addClass('current-one-path')
    $('#clothes-select-header-text').append('Top')
}

function setTypeOnClick() {
    $('.clothes-select-box').click(async function (event) {
        var selectedTag = event.target.id.split('-')[2]
        if (selectedTag !== undefined) {
            current = selectedTag
        }
        // console.log(selectedTag)
        // console.log(current)
        if (buttonList.includes(event.target.id)) {
            $('.main-clothes').remove()

            const allClothesWithSelectedTags = await SearchTool.searchClothesWithTagsInDatabase(selectedTag, clothesDatabase)
            allClothesWithSelectedTags.forEach(function (clothe) {
                $('.below-below-clothes-select-header').append("<img class='col span-1-of-3 main-clothes' id='main." + clothe.imageID + "' src='" + clothe.imagePath + "'>")
            })
            $('#clothes-select-header-text').text(current.charAt(0).toUpperCase() + current.slice(1))
            $('.icon-button').removeClass('current-one')
            $('.icon-button path').removeClass('current-one-path')
            $('#icon-button-' + selectedTag).addClass('current-one')
            $('#icon-button-' + selectedTag + ' path').addClass('current-one-path')
        }
        $('.main-clothes').click(function (event) {
            // console.log(selectedTag)
            // console.log(current)
            $('.' + current).remove()
            $('.clothes-display-container').append("<img class='" + current + "' src='" + event.target.src + "'>")
        })
    })
}

