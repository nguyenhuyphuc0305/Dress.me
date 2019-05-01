const path = require('path');
const recommendation = require('../../Quang_Libs/recommendation')

window.clothes = window.clothes || {},
    function (n) {
        clothes.handler = {
            constants: {
                clotheDatabase: {},
                buttonList: ['icon-button-top', 'icon-button-jacket', 'icon-button-bottom', 'icon-button-shoes'],
                current: ''
            },
            showTopOnLoad: function () {
                clothes.handler.constants.current = 'top'
                $('.main-clothes').remove()
                if (this.constants.clotheDatabase.top.length != 0) {
                    this.constants.clotheDatabase.top.forEach(function (cloth) {
                        $('.below-below-clothes-select-header').append("<img class='col span-1-of-3 main-clothes' id='main." + path.parse(cloth).name + "' src='" + cloth + "'>")
                    })
                }
                $('#icon-button-top').addClass('current-one')
                $('#icon-button-top path').addClass('current-one-path')
                $('#clothes-select-header-text').append('Top')
            },
            setTypeOnClick: function () {
                $('.clothes-select-box').click(function (event) {
                    var currentOne = event.target.id.split('-')[2]
                    if (currentOne !== undefined) {
                        clothes.handler.constants.current = currentOne
                    }
                    console.log(currentOne)
                    console.log(clothes.handler.constants.current)
                    if (clothes.handler.constants.buttonList.includes(event.target.id)) {
                        $('.main-clothes').remove()
                        if (clothes.handler.constants.clotheDatabase[currentOne].length != 0) {
                            clothes.handler.constants.clotheDatabase[currentOne].forEach(function (cloth) {
                                $('.below-below-clothes-select-header').append("<img class='col span-1-of-3 main-clothes' id='main." + path.parse(cloth).name + "' src='" + cloth + "'>")
                            })
                        }
                        $('#clothes-select-header-text').text(clothes.handler.constants.current.charAt(0).toUpperCase() + clothes.handler.constants.current.slice(1))
                        $('.icon-button').removeClass('current-one')
                        $('.icon-button path').removeClass('current-one-path')
                        $('#icon-button-' + currentOne).addClass('current-one')
                        $('#icon-button-' + currentOne + ' path').addClass('current-one-path')
                    }
                    $('.main-clothes').click(function (event) {
                        console.log(currentOne)
                        console.log(clothes.handler.constants.current)
                        $('.' + clothes.handler.constants.current).remove()
                        $('.clothes-display-container').append("<img class='" + clothes.handler.constants.current + "' src='" + event.target.src + "'>")
                    })
                })
            },
            init: function () {
                this.showTopOnLoad()
                this.setTypeOnClick()
            }
        },

            n(async function () {
                clothes.handler.constants.clotheDatabase = await recommendation.helloworld()
                console.log(clothes.handler.constants.clotheDatabase)
                clothes.handler.init()
            })
    }(jQuery);