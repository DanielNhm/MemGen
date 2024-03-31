'use strict'
let gCount = 1
let isFrameClicked = true
var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['kids', ''] },
    { id: 2, url: 'img/2.jpg', keywords: ['friendship', 'animals'] },
    { id: 3, url: 'img/3.jpg', keywords: ['friendship', 'animals'] },
    { id: 4, url: 'img/4.jpg', keywords: ['party', ''] },
    { id: 5, url: 'img/5.jpg', keywords: ['animals', ''] },
    { id: 6, url: 'img/6.jpg', keywords: ['animals', ''] },
    { id: 7, url: 'img/7.jpg', keywords: ['kids', 'animals'] },
    { id: 8, url: 'img/8.jpg', keywords: ['movies', ''] },
    { id: 9, url: 'img/9.jpg', keywords: ['kids', 'funny'] },
    { id: 10, url: 'img/10.jpg', keywords: ['politics', 'funny'] },
    { id: 11, url: 'img/11.jpg', keywords: ['party', 'friendship'] },
    { id: 12, url: 'img/12.jpg', keywords: ['funny', ''] },
    { id: 13, url: 'img/13.jpg', keywords: ['movies', 'cool'] },
    { id: 14, url: 'img/14.jpg', keywords: ['movies', 'cool'] },
    { id: 15, url: 'img/15.jpg', keywords: ['party', ''] },
    { id: 16, url: 'img/16.jpg', keywords: ['politics', 'funny'] },
    { id: 17, url: 'img/17.jpg', keywords: ['kids', ''] },
    { id: 18, url: 'img/18.jpg', keywords: ['animals', ''] },
    { id: 19, url: 'img/19.jpg', keywords: ['evil', 'politics'] },
    { id: 20, url: 'img/20.jpg', keywords: ['sport', 'party'] },
    { id: 21, url: 'img/21.jpg', keywords: ['movies', 'party'] },
    { id: 22, url: 'img/22.jpg', keywords: ['friendship', 'party'] },
    { id: 23, url: 'img/23.jpg', keywords: ['movies', 'cool'] },
    { id: 24, url: 'img/24.jpg', keywords: ['funny', ''] },
    { id: 25, url: 'img/25.jpg', keywords: ['funny', ''] },
    { id: 26, url: 'img/26.jpg', keywords: ['politics', 'evil'] },
    { id: 27, url: 'img/27.jpg', keywords: ['movies', ''] },
]
var gMode = {
    isDrag: false,
}
function setDragMode(isDrag) {
    gMode.isDrag = isDrag
}
function getDragMode() {
    return gMode.isDrag
}
var gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isFrameClicked)
        return
    setDragMode(true)

    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}
function onMove(ev) {
    const isDrag = getDragMode()
    if (!isDrag) {
        document.body.style.cursor = 'auto'
        return
    }
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()


}
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}
function onUp() {
    setDragMode(false)
    document.body.style.cursor = 'grab'
}
function moveLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].x += dx
    gMeme.lines[gMeme.selectedLineIdx].y += dy
}
function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (TOUCH_EVS.includes(ev.type)) {
        // Prevent triggering the mouse ev
        ev.preventDefault()
        // Gets the first touch point
        ev = ev.changedTouches[0]
        // Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}


let gIcons = [
    '😀',
    '🎈',
    '✨',
    '🕶',
    '🎩',
    '🎵',
    '💰',
    '🌌',
    '❄',
    '🔥',
    '🌠',
    '🍕',
    '🍺',
    '🤣',
    '😍',
    '🤑',
    '😢',
    '☠',
    '🐾',
    '🐢',
    '🐍']



var gFilter
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Put your text here',
            size: 20,
            color: 'white',
            x: 30,
            y: 50
        }
        ,
    ],
    uploadData: ''

}
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

const STORAGE_KEY = 'MemesDB'
const STORAGE_KEY_COUNT_MAP = 'countMapDB'

const gSavedMemes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
var gKeywordSearchCountMap = _loadCountMap()

function getIcons() {
    return gIcons
}
function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function _loadCountMap() {
    let countMap = loadFromStorage(STORAGE_KEY_COUNT_MAP)
    if (!countMap)
        countMap = {
            animals: 17,
            politics: 45,
            friendship: 39,
            kids: 58,
            movies: 21,
            cool: 23,
            funny: 43,
            party: 64,
            crazy: 53,
            evil: 40,
        }
    return countMap
}
function getSavedMemes() {
    return gSavedMemes
}





function getImgs() {
    if (!gFilter)
        return gImgs
    return gImgs.filter((img) => {
        for (let i = 0; i < img.keywords.length; i++) {
            if (img.keywords[i].includes(gFilter.toLowerCase()))
                return true
        }
    })
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
    gMeme.uploadData =''

}

function getMeme() {
    return gMeme
}

function setLineText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}
function changeSize(val) {
    gMeme.lines[gMeme.selectedLineIdx].size += val
}
function addLine() {
    if (gMeme.lines.length === 3)
        return
    var line =
    {
        txt: 'Put your text here',
        size: 20,
        color: 'white',
        x: gCanvas.width / 2,
        y: gCanvas.height / 2 + 40,
    }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}
function switchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx > gMeme.lines.length - 1)
        gMeme.selectedLineIdx = 0
}

function canvasClicked(x, y) {
    isFrameClicked = false
    gMeme.lines.forEach((line, index) => {
        if (x >= line.x && x <= line.x + gCtx.measureText(line.txt).width && line.y <= y && y <= line.y + parseInt(gCtx.font)) {
            gMeme.selectedLineIdx = index
            isFrameClicked = true
        }
    })
}
function addMouseListeners() {
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchend', onUp)
}







function saveMeme() {
    const savedMeme = JSON.parse(JSON.stringify(gMeme))
    const imageURI = gCanvas.toDataURL()
    savedMeme.imgURI = imageURI
    savedMeme.id = makeId()
    gSavedMemes.push(savedMeme)
    saveToStorage(STORAGE_KEY, gSavedMemes)
}



function removeSavedMeme(memeId) {
    const removedMemeIndex = gSavedMemes.findIndex(gMeme => gMeme.id === memeId)
    if (removedMemeIndex !== -1) gSavedMemes.splice(removedMemeIndex, 1)
    saveToStorage(STORAGE_KEY, gSavedMemes)
}
function getMemeById(memeId) {
    const memeObj = gSavedMemes.find(meme => meme.id === memeId)
    return memeObj
}
function editMeme(memeId) {
    const editedMeme = getMemeById(memeId)
    Object.assign(gMeme, editedMeme)
    if(!gMeme.selectedImgId.length)
        gMeme.uploadData=''
    setTimeout(renderMeme(), 4000)
}
function setFilter(val) {
    if (gKeywordSearchCountMap[val]) gKeywordSearchCountMap[val]++
    gFilter = val
    saveToStorage(STORAGE_KEY_COUNT_MAP, gKeywordSearchCountMap)
}
function getKeywordCountMap() {
    return gKeywordSearchCountMap
}

function findMaxKeyword() {
    var max = -Infinity
    for (const keyword in gKeywordSearchCountMap) {
        if (gKeywordSearchCountMap[keyword] > max)
            max = gKeywordSearchCountMap[keyword]
    }
    return max
}

function findMinKeyword() {
    var min = Infinity
    for (const keyword in gKeywordSearchCountMap) {
        if (gKeywordSearchCountMap[keyword] < min)
            min = gKeywordSearchCountMap[keyword]
    }
    return min
}

function setIcon(val) {
    let line = {
        txt: val,
        size: 20,
        color: '',
        x: gCanvas.width / 2,
        y: gCanvas.height / 2
    }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx++
}
function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}








