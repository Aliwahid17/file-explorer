'use strict';


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function copyToClipboard(button) {
    let value = button.getAttribute("data-value");
    navigator.clipboard.writeText(value);
}


function dataAjax(folder) {
    let xhr = new XMLHttpRequest()
    let csrftoken = getCookie('csrftoken')
    xhr.open("POST", '/', true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
    let data = JSON.stringify({
        folder: folder,
    })

    xhr.send(data)
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.fileData = JSON.parse(xhr.responseText)

            const firstBox = document.getElementsByClassName('first-box')[0]
            let totalPath = []

            if (typeof window.fileData === "undefined" || Object.values(window.fileData).length === 0) {
                firstBox.innerHTML = `           <div class="file-name-container">         <div class="folder-name">
            <img src="static/assets/collection.svg" alt="collection" width="25" height="25">
            <h3><b>Select Atleast 1 Folder</b></h3>
            </div></div>`
            } else {

                firstBox.innerHTML = Object.entries(window.fileData)
                    .map(([key, value]) =>

                        `         
                <div class="file-name-container">
                <div class="folder-name">
                <img src="/static/assets/collection.svg" alt="collection" width="25" height="25">
                <h3><b>${key}</b></h3>
            </div>

            ${Object.values(value.file).length === 0 ?

                            `<div class="file-name">
                        <img src="/static/assets/text.svg" alt="text" width="25" height="25">
                <h4><b> - - - - - Empty - - - - - </b></h4>
            </div>`

                            :

                            `${value.file.map((item, key) =>

                                `<div class="file-name">
                <input type="checkbox" name="file-name" class="file-input" data-value="${value.path[key]}" data-checked="${totalPath.includes(value.path[key])}" >
                <img src="/static/assets/text.svg" alt="text" width="25" height="25">
                <span>${item}</span>
            </div>`

                            ).join('')}`

                        }
            
        </div>
            `
                    )
                    .join('');
            }

            const fileInput = document.querySelectorAll('.file-input')
            const secondBox = document.getElementsByClassName('second-box')[0]


            fileInput.forEach((value, index) => {
                value.addEventListener('click', function () {
                    value.checked ? totalPath.push(value.dataset.value) : totalPath.splice(totalPath.indexOf(value.dataset.value), 1)

                    if (totalPath.length === 0) {

                        secondBox.innerHTML = `
                        <div class="path-name-container">
                        <div class="path-name">
                <img src="/static/assets/link.svg" alt="Link" width="25" height="25">
                <h3><b>Select Atleast 1 File</b></h3>
            </div> 
            </div> 
                        
                        `

                    } else {



                        secondBox.innerHTML = totalPath.map(((item) => `
                  
                    <div class="file-name" style="padding : 10px;">
                        <img src="/static/assets/link.svg" alt="link" width="25" height="25">
                        <span>${item}</span>
                        <button style="all : unset;"  data-value="${item}" class="link-btn" onclick="copyToClipboard(this)" >
                            <img src="/static/assets/clipboard.svg" alt="clipboard" width="30" height="30" style="cursor: pointer;" >
                        </button>
                    </div>
                 
                    `)).join('')
                    }
                })

            })


        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const optionBox = document.querySelectorAll('.option-box')
    const optionFolder = document.getElementById('folder')
    const optionFile = document.getElementById('file')


    optionBox.forEach((box, index) => {
        box.addEventListener('click', function () {
            box.dataset.active = 'true'
            optionBox[index !== 0 ? 0 : 1].dataset.active = 'false'
            index === 1 ? optionFolder.style.display = 'none' : optionFolder.style.display = 'unset'
            index === 0 ? optionFile.style.display = 'none' : optionFile.style.display = 'unset'
        })
    })


    TreeData(window.dataJSON, '#tree')

    const treeValue = document.querySelectorAll('.tree-value')
    const folderInput = document.getElementById('folder-input')

    let folderInputData = []

    treeValue.forEach((value, index) => {
        value.addEventListener('click', function () {
            value.dataset.active === "false" ? value.dataset.active = 'true' : value.dataset.active = 'false'
            value.dataset.active === "true" ? folderInputData.push(value.dataset.value) : folderInputData.splice(folderInputData.indexOf(value.dataset.value), 1)
            folderInput.dataset.value = folderInputData
            dataAjax(folderInput.dataset.value)
        })
    })


})
