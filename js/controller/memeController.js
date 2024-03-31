'use strict'
let gCanvas
let gCtx
// document.querySelector('.meme-container').offsetWidth = 500 +'px'



function onInitEditor() {
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
}

function renderMeme(callback) {
    const meme = getMeme()
    const elImg = new Image()
    elImg.src = meme.uploadData || `img/${meme.selectedImgId}.jpg`
    if (meme.uploadData)
        gMeme.selectedImgId = makeId()
    elImg.onload = () => {
        gCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gCanvas.width
        gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height)

        meme.lines.forEach((line, index) => {
            gCtx.beginPath()
            gCtx.fillStyle = line.color
            gCtx.font = `${line.size}px impact`
            gCtx.textAlign = 'left'
            gCtx.textBaseline = 'top'
            gCtx.fillText(line.txt, line.x, line.y)
            gCtx.strokeText(line.txt, line.x, line.y)

            if (gMeme.selectedLineIdx === index && isFrameClicked) {
                gCtx.rect(line.x, line.y, gCtx.measureText(line.txt).width, parseInt(gCtx.font))
                gCtx.strokeStyle = 'black'
                gCtx.lineWidth = 1
                gCtx.stroke()
            }
        })
    }

}

function onSetLineText() {
    var elInput = document.querySelector('input[name="txt"]')
    var txt = elInput.value
    setLineText(txt)
    renderMeme()
}

function onSetColor() {
    var elInput = document.querySelector('input[name="color"]')
    setColor(elInput.value)
    renderMeme()
}

function onChangeSize(val) {
    changeSize(val)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
}



function downloadImg() {
  // Get a reference to the download button
const downloadBtn = document.getElementById('downloadBtn');

// Add event listener to the button
downloadBtn.addEventListener('click', () => {
    // Call the function to download canvas content as an image
    downloadCanvasAsImage(gCanvas, 'my-meme.jpg');
});
}



function downloadCanvasAsImage(canvas, filename = 'image.jpg') {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = filename;
    link.click();
}
function OnCanvasClicked(event) {
    const { offsetX, offsetY } = event
    canvasClicked(offsetX, offsetY)
    renderMeme()

}
// function resizeCanvas() {
//     const elContainer = document.querySelector('.meme-container')
//     gCanvas.width = elContainer.offsetWidth
//     gCanvas.height = elContainer.offsetHeight


// }

function resizeCanvas() {

    const elContainer = document.querySelector('.meme-container')
    const elInputContainer = document.querySelector('.input-container')
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
  



}
function toggleMenu() {
    document.body.classList.toggle('menu-open')
}
function onCloseMenu() {
    document.body.classList.remove('menu-open')

}
function onSaveMeme() {
    saveMeme()
}

function renderSavedMemes() {

    const savedMemes = getSavedMemes()
    var strHTMLs = ''

    strHTMLs = savedMemes.map(meme => `<div><img src="${meme.imgURI}"
    class="saved-meme-img" onclick="onEditMeme('${meme.id}')">
    <button class="del-btn" onclick="onRemoveSavedMeme('${meme.id}')"><img src="img/icons/delete.png"></button></div>`)

    document.querySelector('.saved-meme-container').innerHTML = strHTMLs.join('')

}
function onRemoveSavedMeme(memeId) {
    removeSavedMeme(memeId)
    renderSavedMemes()
}
function onEditMeme(memeId) {
    editMeme(memeId)
    document.querySelector('.saved-meme-container').style.display = 'none'
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.canvas-container').classList.remove('hidden')

}

function onSetFilter(val) {
    setFilter(val)
    document.querySelector(`#filter`).value = val
    renderKeywords()
    renderImgs()
}

function renderKeywords() {
    const maxKey = findMaxKeyword()
    const minKey = findMinKeyword()
    const maxFSize = 3
    const minFSize = 1

    const keywordMap = getKeywordCountMap()
    var strHTML = ''
    for (const keyword in keywordMap) {
        var keyCount = keywordMap[keyword]

        // Calculate desired fontsize relative to max and min previous searches
        var fontSize =
            ((keyCount - minKey) * (maxFSize - minFSize)) / (maxKey - minKey) +
            minFSize
        strHTML += `<li onclick="onSetFilter('${keyword}')" style="font-size:${fontSize}em;">${keyword}</li>\n`
    }
    document.querySelector('.keywords-container').innerHTML = strHTML
}
function onCleanFilter() {
    document.querySelector(`#filter`).value = ''
    setFilter('')
    renderImgs()
}

function renderIcons() {
    const icons = getIcons()
    var strHTML = icons.map((icon) => {
        return `<button class="item" onclick="onSetIcon('${icon}')">${icon}</button>`
    })
    document.querySelector('.item-list').innerHTML = strHTML.join('')
}

function onSetIcon(val) {
    setIcon(val)
    renderMeme()

}

function createCarouselForIcon() {
    const prev = document.getElementById('prev-btn')
    const next = document.getElementById('next-btn')
    const list = document.getElementById('item-list')
    const itemWidth = 150
    const padding = 10

    prev.addEventListener('click', () => {
        list.scrollLeft -= (itemWidth + padding)
    })
    next.addEventListener('click', () => {
        list.scrollLeft += (itemWidth + padding)
    })
}

// UPLOAD TO FACE BOOK FUNCTIONS 

function onUploadImg() {
    const imgDataUrl = gCanvas.toDataURL('image/jpeg')
    function onSuccess(uploadedImgUrl) {
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData,
    })
        .then((res) => res.text())
        .then((url) => {
            console.log('Got back live url:', url)
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

// Read the file from the input
// When done send the image to the callback function
function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    // Draw the img on the canvas
    gMeme.uploadData = img.src
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.saved-meme-container').classList.add('hidden')
    document.querySelector('.canvas-container').classList.remove('hidden')
    renderMeme()
}
function onShare() {
    if (navigator.share) {
      const title = window.document.title
      const url = window.document.location.href
      navigator.share({
        title: `${title}`,
        url: `${url}`,
        text: 'Check out this meme generator!',
      })
   
  }
}









