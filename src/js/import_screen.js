//For easier manipulation of DOM
var $ = require("jquery");

//Requires to allow users to pickup files
const { dialog } = require('electron').remote;
const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

//Import neccessary Tools and Models used by this file
var DatabaseWrapper = require('../../Tools/Database')
var SearchTool = require("../../Tools/Search")
var Clothe = require("../../Models/Clothe").Clothe

//Variables
var selectedImageID = ''

function main() {
    displayAllImagesOnDatabase();
    $('#import-btn').click(function () {
        importNewImages()
    })
    $('#display-btn').click(function () {
        displayAllImagesOnDatabase()
    })
    $('#img-container').on('contextmenu', '.imported-img', async function (event) {
        event.preventDefault();
        $('.tags-container').css({
            'display': 'block',
            'left': event.pageX,
            'top': event.pageY
        })

        selectedImageID = event.target.id;

        var savedTags = await DatabaseWrapper.readTagsForImageWithID(event.target.id)
        $('span').css({ 'display': 'none' })
        savedTags.forEach(function (savedTag) {
            //Basically check all tags that are previously selected
            $('span#' + savedTag).css({ 'display': 'block' });
        })
    })
    $('#context-menu ul li').click(async function (event) {
        const selectedClotheID = selectedImageID;
        const selectedTag = event.target.id
        await DatabaseWrapper.addOrDeleteTagFromImageWithID(selectedClotheID, selectedTag)
            .then(() => {
                console.log("Successfully save new tags settings.")
            })
        $('.icon-li').css({ 'display': 'none' });
        var savedTags = await DatabaseWrapper.readTagsForImageWithID(selectedClotheID)
        savedTags.forEach(function (savedTag) {
            //Basically check all tags that are previously selected
            $('span#' + savedTag).css({ 'display': 'block' });
        })
        // displayAllImagesOnDatabase()
        // dismissContextMenu()
    })
    $('#import-menu-display').click(function () {
        dismissContextMenu()
    })
    $("#toggle").click(function () {
        $(this).toggleClass("on");
        $("#search-menu").slideToggle();
    });
    $('.search-icon').click(function () {
        $(this).toggleClass('current-search')
    })
    $('#letsearch').click(function () {
        var searchArray = []
        $('.current-search').each(function () {
            searchArray.push(this.id.split('-')[0])
        })
        if (searchArray.length == 0) {
            $('#img-container .top-container-import').append('<h1>Top</h1>')
            $('#img-container .jacket-container-import').append('<h1>Jacket</h1>')
            $('#img-container .bottom-container-import').append('<h1>Bottom</h1>')
            $('#img-container .shoes-container-import').append('<h1>Shoes</h1>')
            $('#img-container .other-container-import').append('<h1>Other</h1>')
            displayAllImagesOnDatabase();
        } else {
            DatabaseWrapper.getAllClothesAndParseItIntoObjects().then(async function (database) {
                var searchArrayUpper = []
                searchResult = await SearchTool.searchClothesWithTagsInDatabaseAND(searchArray.join(), database)
                searchArrayUpper = searchArray.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))
                $('.search-img-container').append('<h1>' + searchArrayUpper.join(' and ') + '</h1>')
                searchResult.forEach(function (clothe) {
                    $('.search-img-container').append("<img class='col span-1-of-5 imported-img' id='" + clothe.imageID + "' src='" + clothe.imagePath + "'>")
                })
            })

            $('.imported-img').remove()
            $('#img-container div h1').remove()
        }
    })
}

function importNewImages() {
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{
            name: "Images",
            extensions: ["jpg", "png"]
        }]
    }, function (imagePaths) {
        // console.log(imagePaths)
        if (imagePaths != undefined) {
            DatabaseWrapper.handleImagesInAndUpdateDatabase(imagePaths)
                .then(() => {
                    console.log("Successfully imported and updated database.")
                })
                .catch(err => {
                    console.log(err)
                })
        }
    })
}

function displayAllImagesOnDatabase() {
    $('.imported-img').remove()
    DatabaseWrapper.getAllClothesAndParseItIntoObjects()
        .then(async function (database) {
            // console.log(database)
            const allTops = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Top, database)
            const allJackets = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Jacket, database)
            const allBots = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Bottom, database)
            const allShoes = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Shoe, database)
            const noneTypes = await SearchTool.searchClothesWithTagsInDatabase(null, database)
            // console.log(noneTypes)
            allTops.forEach(function (clothe) {
                $('.top-container-import').append("<img class='col span-1-of-5 imported-img' id='" + clothe.imageID + "' src='" + clothe.imagePath + "'>")
            })
            allJackets.forEach(function (clothe) {
                $('.jacket-container-import').append("<img class='col span-1-of-5 imported-img' id='" + clothe.imageID + "' src='" + clothe.imagePath + "'>")
            })
            allBots.forEach(function (clothe) {
                $('.bottom-container-import').append("<img class='col span-1-of-5 imported-img' id='" + clothe.imageID + "' src='" + clothe.imagePath + "'>")
            })
            allShoes.forEach(function (clothe) {
                $('.shoes-container-import').append("<img class='col span-1-of-5 imported-img' id='" + clothe.imageID + "' src='" + clothe.imagePath + "'>")
            })
            noneTypes.forEach(function (clothe) {
                $('.other-container-import').append("<img class='col span-1-of-5 imported-img' id='" + clothe.imageID + "' src='" + clothe.imagePath + "'>")
            })
        })
        .catch(err => {
            console.log(err)
        })
}

function dismissContextMenu() {
    $('.tags-container').css({
        'display': 'none'
    })
}

main()