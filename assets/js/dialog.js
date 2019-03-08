const fs = require('fs');
const { dialog } = require('electron').remote;
const path = require('path');

window.dialog = window.dialog || {},


    function (n) {
        dialog.handler = {
            variables: {
                imgId: ''
            },
            import: function () {
                dialog.showOpenDialog((filename) => {
                    if (filename === undefined) {
                        console.log('No file was chosen')
                        return;
                    }
                    var pathToClothes = path.join('assets', 'database', 'clothes')
                    var pathToTags = path.join('assets', 'database', 'tags')
                    var baseName = path.basename(filename[0])
                    fs.copyFile(filename[0], path.join(pathToClothes, baseName), (err) => {
                        if (err) {
                            return;
                        }
                    })
                    var content = 'Hi!'

                    fs.writeFile(path.join(pathToTags, baseName.split('.')[0]) + '.txt', content, 'utf-8', (err) => {
                        if (err) {
                            return;
                        }
                    })
                })
            },
            displayImages: function () {
                var pathToClothes = path.join('assets', 'database', 'clothes')
                fs.readdir(pathToClothes, (err, files) => {
                    if (err) {
                        console.log('Error!')
                    }
                    $('.imported-img').remove();
                    files.forEach(file => {
                        $('#img-container').append("<img class='col span-1-of-5 imported-img' id='" + file.split('.')[0] + "' src='" + path.join(pathToClothes, file) + "'>")
                    })
                })

            },
            showStoredImagesOnload: function () {
                var pathToClothes = path.join('assets', 'database', 'clothes')
                fs.readdir(pathToClothes, (err, files) => {
                    if (err) {
                        console.log('Error!')
                    }
                    files.forEach(file => {
                        $('#img-container').append("<img class='col span-1-of-5 imported-img' id='" + file.split('.')[0] + "' src='" + path.join(pathToClothes, file) + "'>")
                    })
                })
            },
            init: function () {
                dialog.handler.showStoredImagesOnload();
                $('#import-btn').click(function () {
                    dialog.handler.import()
                })
                $('#read-file').click(function () {
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
                })
                $('#context-menu ul li').click(function (event) {
                    //FIXME: QUANG
                    console.log(dialog.handler.variables.imgId)
                    console.log(event.target.id)
                })
                $('*').click(function () {
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
