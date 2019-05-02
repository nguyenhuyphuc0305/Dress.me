//For easier manipulation of DOM
var $ = require("jquery");

//Varibales
const sectionTemplate = '.section-template'
const contentContainer = '#wrapper'
const startSectionMenuItem = '#welcome-menu'
const startSection = '#welcome'
const list1 = ['#about-menu-display', '#welcome-menu-display', '#import-menu-display', '#clothes-menu-display']
const list2 = ['#about-menu', '#welcome-menu', '#import-menu', '#clothes-menu']

function main() {
    importSectionsToDOM()
    setMenuOnClickEvent()
    showStartSection()
    buttonShowSectionHandler()
}

function importSectionsToDOM() {
    const links = document.querySelectorAll('link[rel="import"]')
    Array.prototype.forEach.call(links, function (link) {
        let template = link.import.querySelector(sectionTemplate)
        let clone = document.importNode(template.content, true)
        document.querySelector(contentContainer).appendChild(clone);

    })
}

function setMenuOnClickEvent() {
    document.body.addEventListener('click', async function (event) {
        if (event.target.dataset.section) {
            hideAllSections()
            $('#' + event.target.id + '-display').css({
                display: 'block'
            });
            for (i = 0; i < list2.length; i++) {
                $(list2[i]).removeClass('current-page')
            }
            $('#' + event.target.id).addClass('current-page');
        }
    })
}

function showStartSection() {
    $(startSectionMenuItem + '-display').css({
        'display': 'block'
    });
    $(startSectionMenuItem).addClass('current-page');
}

function hideAllSections() {
    for (i = 0; i < list1.length; i++) {
        $(list1[i]).css({
            'display': 'none'
        })
    }
}

function buttonShowSectionHandler() {
    $('#dress-btn').click(function () {
        hideAllSections()
        $('#clothes-menu-display').css({
            'display': 'block'
        })
        $('#welcome-menu').removeClass('current-page')
        $('#clothes-menu').addClass('current-page');
    })
}

main()