const user = require("../models/user")

module.exports = {
    index(idx) {
        let i = idx + 1
        return i
    },
    isUser(a, options) {
        //console.log(this)
        if (a.toString() === 'user') {
            return 'checked'
        } 
    },
    isModerator(a, options) {
        //console.log(this)
        if (a.toString() === 'moderator') {
            return 'checked'
        } 
    },
    isAdmin(a, options) {
        //console.log(this)
        if (a.toString() === 'admin') {
            return 'checked'
        } 
    },
}

