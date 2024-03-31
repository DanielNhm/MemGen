'use strict'

function makeId(length = 4) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let counter = 0
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
        counter++
    }
    return result
}