'use strict'


function onInit() {
    renderKeywords()
    renderImgs()
    renderIcons()
    createCarouselForIcon()
    onInitEditor()
    addMouseListeners()
    addTouchListeners()
    if (window.innerWidth <= 800) {
        gCanvas.width = window.innerWidth * 0.7;
    } else {
        gCanvas.width = window.innerWidth * 0.4;
    }


}

function renderImgs() {
    var imgs = getImgs()
    var elGallery = document.querySelector(".gallery")
    var strHtml = imgs.map(img => `<img src="${img.url}" class="img-gallery" onclick="onSelect(${img.id})">`).join('')
    elGallery.innerHTML = strHtml
}

function onSelect(imgId) {
    setImg(imgId)
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.saved-meme-container').classList.add('hidden')
    document.querySelector('.canvas-container').classList.remove('hidden')
    renderMeme()
}

function showGalley() {
    document.querySelector('.gallery-container').classList.remove('hidden')
    document.querySelector('.canvas-container').classList.add('hidden')
    document.querySelector('.saved-meme-container').style.display = 'none'
}
function showSavedMeme() {
    document.querySelector('.saved-meme-container').style.display = 'grid'
    document.querySelector('.canvas-container').classList.add('hidden')
    document.querySelector('.gallery-container').classList.add('hidden')
    renderSavedMemes()
}
function onDeleteLine(){
    deleteLine()
    renderMeme()
}