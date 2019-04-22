const fs = require('fs');
const { dialog } = require('electron').remote;
const path = require('path');

const ObjectDatabase = require('objecttagdatabase');

var database = []

window.dialog = window.dialog || {},
    function (n) {
        dialog.handler = {
            variables: {
                imgId: ''
            },
            import: function () {
                dialog.showOpenDialog({ properties: ['multiSelections'] }, (imagePaths) => {
                    if (imagePaths === undefined) { return; }
                    ObjectDatabase.saveImagesAsDatabase(imagePaths)
                })
            },
            displayImages: function () {
                database = ObjectDatabase.loadDatabase()
                $('.imported-img').remove()
                if (database.length == 0) { return }
                database.forEach(function (cloth) {
                    $('#img-container').append("<img class='col span-1-of-5 imported-img' id='" + path.basename(cloth._imagePath).split('.')[0] + "' src='" + cloth._imagePath + "'>")
                })

            },
            showStoredImagesOnload: function () {
                database = ObjectDatabase.loadDatabase()
                if (database.length == 0) { return }
                database.forEach(function (cloth) {
                    console.log(cloth._imagePath)
                    $('#img-container').append("<img class='col span-1-of-5 imported-img' id='" + path.basename(cloth._imagePath).split('.')[0] + "' src='" + cloth._imagePath + "'>")
                })

            },
            init: function () {
                dialog.handler.showStoredImagesOnload();
                $('#import-btn').click(function () {
                    dialog.handler.import()
                })
                $('#display-btn').click(function () {
                    dialog.handler.displayImages()
                })
                $('#img-container').on('contextmenu', '.imported-img', function (event) {
                    event.preventDefault();
                    $('.tags-container').css({
                        'display': 'block',
                        'left': event.pageX,
                        'top': event.pageY
                    })

                    dialog.handler.variables.imgId = event.target.id;

                    var tagList = fs.readFileSync(path.join('Clothes', event.target.id + '.txt')).toString().split("\n");
                    tagList.pop()
                    $('span').css({ 'display': 'none' })
                    tagList.forEach(function (checkTag) {
                        $('span#' + checkTag).css({ 'display': 'block' });
                    });

                })
                $('#context-menu ul li').click(function (event) {
                    const fileName = dialog.handler.variables.imgId;
                    const tag = event.target.id
                    tagList = ObjectDatabase.addOrDeleteTagFromImage(fileName, tag)
                    $('.icon-li').css({ 'display': 'none' });
                    tagList.forEach(function (checkTag) {
                        $('span#' + checkTag).css({ 'display': 'block' });
                    });
                })
                $('#import-menu-display').click(function () {
                    $('.tags-container').css({
                        'display': 'none'
                    })
                })
            }
        };

        n(function () {
            dialog.handler.init();
        })
    }(jQuery);