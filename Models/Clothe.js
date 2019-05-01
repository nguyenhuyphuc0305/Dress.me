class Clothe {
    /* #region For types */
    static get Top() {
        return "top"
    }
    static get Bottom() {
        return "bottom"
    }
    static get Dress() {
        return "dress"
    }
    static get Shoe() {
        return "shoe"
    }
    /* #endregion */

    /* #region For colors */
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
    /* #endregion */

    /* #region For conditions */
    static get Hot() {
        return 'hot'
    }
    static get Warm() {
        return 'warm'
    }
    static get Cool() {
        return 'cool'
    }
    static get Cold() {
        return 'cold'
    }
    /* #endregion */

    /* #region For abilities */
    static get Waterproof() {
        return "waterproof"
    }
    static get Snowproof() {
        return "snowproof"
    }
    /* #endregion */

    constructor(imageID, imageName, imagePath, tags) {
        this.imageID = imageID
        this.imageName = imageName
        this.imagePath = imagePath
        this.tags = tags
    }
}

module.exports = { Clothe }