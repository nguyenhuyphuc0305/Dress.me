window.navigation = window.navigation || {},
    function (n) {
        navigation.menu = {
            constants: {
                sectionTemplate: '.section-template',
                contentContainer: '#wrapper',
                startSectionMenuItem: '#welcome-menu',
                startSection: '#welcome',
                list1: ['#about-menu-display', '#welcome-menu-display', '#import-menu-display', '#clothes-menu-display'],
                list2: ['#about-menu', '#welcome-menu', '#import-menu', '#clothes-menu']
            },

            importSectionsToDOM: function () {
                const links = document.querySelectorAll('link[rel="import"]')
                Array.prototype.forEach.call(links, function (link) {
                    let template = link.import.querySelector(navigation.menu.constants.sectionTemplate)
                    let clone = document.importNode(template.content, true)
                    document.querySelector(navigation.menu.constants.contentContainer).appendChild(clone);

                })
            },

            setMenuOnClickEvent: function () {
                document.body.addEventListener('click', function (event) {
                    if (event.target.dataset.section) {
                        navigation.menu.hideAllSections()
                        $('#' + event.target.id + '-display').css({
                            display: 'block'
                        });
                        for (i = 0; i < navigation.menu.constants.list2.length; i++) {
                            $(navigation.menu.constants.list2[i]).removeClass('current-page')
                        }
                        $('#' + event.target.id).addClass('current-page');
                    }
                })
            },

            showStartSection: function () {
                $(navigation.menu.constants.startSectionMenuItem + '-display').css({
                    'display': 'block'
                });
                $('#welcome-menu').addClass('current-page');
            },

            hideAllSections: function () {
                for (i = 0; i < navigation.menu.constants.list1.length; i++) {
                    $(navigation.menu.constants.list1[i]).css({
                        'display': 'none'
                    })
                }
            },

            buttonShowSectionHandler: function () {
                $('#dress-btn').click(function () {
                    navigation.menu.hideAllSections()
                    $('#clothes-menu-display').css({
                        'display': 'block'
                    })
                    $('#welcome-menu').removeClass('current-page')
                    $('#clothes-menu').addClass('current-page');
                })
            },

            init: function () {
                this.importSectionsToDOM()
                this.setMenuOnClickEvent()
                this.showStartSection()
                this.buttonShowSectionHandler()
            }
        };

        n(function () {
            navigation.menu.init()
        })

    }(jQuery);