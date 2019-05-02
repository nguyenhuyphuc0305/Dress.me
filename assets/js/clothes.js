var DatabaseWrapper = require('../../Tools/Database')
var SearchTool = require("../../Tools/Search")
var Clothe = require("../../Models/Clothe").Clothe
var RecommendTool = require("../../Tools/Recommend")

window.clothes = window.clothes || {},
    function (n) {
        clothes.handler = {
            constants: {
                clothesDatabase: [],
                buttonList: ['icon-button-top', 'icon-button-jacket', 'icon-button-bottom', 'icon-button-shoes'],
                current: ''
            },
            displayRecommendation: async function () {
                const recommendation = await RecommendTool.recommendTodayOutfit(clothes.handler.constants.clothesDatabase)
                console.log(recommendation)

                $(".top").remove()
                $('.clothes-display-container').append("<img class='" + "top" + "' src='" + recommendation.top.imagePath + "'>")

                $(".jacket").remove()
                $('.clothes-display-container').append("<img class='" + "jacket" + "' src='" + recommendation.jacket.imagePath + "'>")

                $(".bottom").remove()
                $('.clothes-display-container').append("<img class='" + "bottom" + "' src='" + recommendation.bottom.imagePath + "'>")

                $(".shoes").remove()
                $('.clothes-display-container').append("<img class='" + "shoes" + "' src='" + recommendation.shoe.imagePath + "'>")
            },
            showTopOnLoad: async function () {
                clothes.handler.constants.current = 'top'
                $('.main-clothes').remove()

                const allTops = await SearchTool.searchClothesWithTagsInDatabase(Clothe.Top, clothes.handler.constants.clothesDatabase)
                allTops.forEach(function (clothe) {
                    $('.below-below-clothes-select-header').append("<img class='col span-1-of-3 main-clothes' id='main." + clothe.imageID + "' src='" + clothe.imagePath + "'>")
                })

                $('#icon-button-top').addClass('current-one')
                $('#icon-button-top path').addClass('current-one-path')
                $('#clothes-select-header-text').append('Top')
            },
            setTypeOnClick: function () {
                $('.clothes-select-box').click(async function (event) {
                    var selectedTag = event.target.id.split('-')[2]
                    if (selectedTag !== undefined) {
                        clothes.handler.constants.current = selectedTag
                    }
                    // console.log(selectedTag)
                    // console.log(clothes.handler.constants.current)
                    if (clothes.handler.constants.buttonList.includes(event.target.id)) {
                        $('.main-clothes').remove()

                        const allClothesWithSelectedTags = await SearchTool.searchClothesWithTagsInDatabase(selectedTag, clothes.handler.constants.clothesDatabase)
                        allClothesWithSelectedTags.forEach(function (clothe) {
                            $('.below-below-clothes-select-header').append("<img class='col span-1-of-3 main-clothes' id='main." + clothe.imageID + "' src='" + clothe.imagePath + "'>")
                        })
                        $('#clothes-select-header-text').text(clothes.handler.constants.current.charAt(0).toUpperCase() + clothes.handler.constants.current.slice(1))
                        $('.icon-button').removeClass('current-one')
                        $('.icon-button path').removeClass('current-one-path')
                        $('#icon-button-' + selectedTag).addClass('current-one')
                        $('#icon-button-' + selectedTag + ' path').addClass('current-one-path')
                    }
                    $('.main-clothes').click(function (event) {
                        // console.log(selectedTag)
                        // console.log(clothes.handler.constants.current)
                        $('.' + clothes.handler.constants.current).remove()
                        $('.clothes-display-container').append("<img class='" + clothes.handler.constants.current + "' src='" + event.target.src + "'>")
                    })
                })
            },
            init: function () {
                this.displayRecommendation()
                this.showTopOnLoad()
                this.setTypeOnClick()
            }
        },

            n(async function () {
                clothes.handler.constants.clothesDatabase = await DatabaseWrapper.getAllClothesAndParseItIntoObjects()
                clothes.handler.init()
            })
    }(jQuery);