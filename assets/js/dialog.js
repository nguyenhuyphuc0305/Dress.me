const fs = require('fs');
const { dialog } = require('electron').remote;
const path = require('path');
const recommendation = require('../../Quang_Libs/recommendation')
const ObjectDatabase = require('objecttagdatabase');

var DatabaseWrapper = require('../../Tools/Database')

window.dialog = window.dialog || {},
    function (n) {
        dialog.handler = {
            variables: {
                imgId: '',
                clotheDatabase: {}
            },
            importNewImages: function() {
                dialog.showOpenDialog({
                    properties: ['openFile', 'multiSelections'],
                    filters: [{
                        name: "Images",
                        extensions: ["jpg", "png"]
                    }]
                }, async function(imagePaths) {
                    // console.log(imagePaths)
                    if (imagePaths.length > 0) {
                        await DatabaseWrapper.handleImagesInAndUpdateDatabase(imagePaths)
                    }
                })
            },
            displayAllImagesOnDatabase: function() {
                DatabaseWrapper.getAllClothesAndParseItIntoObjects()
                    .then(database => {
                        $('.imported-img').remove()
                        if (database.length == 0) { return }
                        database.forEach(function(clothe) {
                            $('#img-container').append("<img class='col span-1-of-5 imported-img' id='" + clothe.imageName.split('.')[0] + "' src='" + clothe.imagePath + "'>")
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            import: function () {
                dialog.showOpenDialog({ properties: ['multiSelections'] }, (imagePaths) => {
                    if (imagePaths === undefined) { return; }
                    ObjectDatabase.saveImagesAsDatabase(imagePaths)
                })

            },
            displayImages: async function () {
                var clotheDatabase = await recommendation.helloworld()
                dialog.handler.variables.clotheDatabase = clotheDatabase
                $('.imported-img').remove()
                if (clotheDatabase.top.length != 0) {
                    clotheDatabase.top.forEach(function (cloth) {
                        $('.top-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                if (clotheDatabase.jacket.length != 0) {
                    clotheDatabase.jacket.forEach(function (cloth) {
                        $('.jacket-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                if (clotheDatabase.bottom.length != 0) {
                    clotheDatabase.bottom.forEach(function (cloth) {
                        $('.bottom-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                if (clotheDatabase.shoes.length != 0) {
                    clotheDatabase.shoes.forEach(function (cloth) {
                        $('.shoes-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                if (clotheDatabase.nottype.length != 0) {
                    clotheDatabase.nottype.forEach(function (cloth) {
                        $('.other-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
            },
            showStoredImagesOnload: async function () {
                var clotheDatabase = await recommendation.helloworld()
                dialog.handler.variables.clotheDatabase = clotheDatabase
                if (clotheDatabase.top.length != 0) {
                    clotheDatabase.top.forEach(function (cloth) {
                        $('.top-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                if (clotheDatabase.jacket.length != 0) {
                    clotheDatabase.jacket.forEach(function (cloth) {
                        $('.jacket-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                if (clotheDatabase.bottom.length != 0) {
                    clotheDatabase.bottom.forEach(function (cloth) {
                        $('.bottom-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                if (clotheDatabase.shoes.length != 0) {
                    clotheDatabase.shoes.forEach(function (cloth) {
                        $('.shoes-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                if (clotheDatabase.nottype.length != 0) {
                    clotheDatabase.nottype.forEach(function (cloth) {
                        $('.other-container-import').append("<img class='col span-1-of-5 imported-img' id='" + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }

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


