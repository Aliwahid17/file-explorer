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

let pathValue = []

function dataAjax(value) {
    let xhr = new XMLHttpRequest()
    let csrftoken = getCookie('csrftoken')
    xhr.open("POST", '/', true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
    let data = JSON.stringify({
        level: value,
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
            <h3><b>Select Atleast 1 Level</b></h3>
            </div></div>`

            } else {

                firstBox.innerHTML = Object.entries(window.fileData)
                    .map(([key, value]) =>

                        `         
                <div class="file-name-container">
                <div class="folder-name">
                <button type="button" class="toggle" style="all:unset; display:flex ; justify-content: center;align-items: center; " data-active="false" >
                    <img src="/static/assets/arrow.svg" alt="arrow" width="25" height="25" style="pointer-events: none;">
                </button>
                <img src="/static/assets/collection.svg" alt="collection" width="25" height="25">
                <h3><b>${key.split('\\').pop()}</b></h3>
            </div>

            ${Object.values(value).length === 0 ?

                            `<div class="file-name" style="display:none;">
                        <img src="/static/assets/text.svg" alt="text" width="25" height="25">
                <h4><b> - - - - - Empty - - - - - </b></h4>
            </div>`

                            :

                            `${value.map((item, index) =>

                                `<div class="file-name" style="display:none;">
                <input type="checkbox" name="file-name" class="file-input" data-value="${value[index]}" data-path="${key}\\${value[index]}"  >
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
                    value.checked ? pathValue.push(value.dataset.path) : pathValue.splice(pathValue.indexOf(value.dataset.path), 1)

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
                        <img src="/static/assets/file.svg" alt="file" width="25" height="25">
                        <span>${item}</span>
                    </div>
                 
                    `)).join('')


                    }
                })

            })



        }

    }
}


function pathAjax(path = []) {

    let xhr = new XMLHttpRequest()
    let csrftoken = getCookie('csrftoken')
    xhr.open("POST", '/', true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
    let data = JSON.stringify({
        path: path,
    })

    xhr.send(data)
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(path)
        }
    }
}


document.addEventListener('DOMContentLoaded', function () {

    let select = document.querySelector('select[multiple]');
    let selectOptions = select.querySelectorAll('option');

    let newSelect = document.createElement('div');
    newSelect.classList.add('selectMultiple');
    let active = document.createElement('div');
    active.classList.add('active');
    let optionList = document.createElement('ul');
    let placeholder = select.dataset.placeholder;

    let span = document.createElement('span');
    span.innerText = placeholder;
    active.appendChild(span);

    let levelValue = []




    selectOptions.forEach((option) => {
        let text = option.innerText;
        if (option.selected) {
            let tag = document.createElement('a');
            tag.dataset.value = option.value;
            tag.innerHTML = "<em>" + text + "</em><i></i>";
            active.appendChild(tag);
            span.classList.add('hide');
        } else {
            let item = document.createElement('li');
            item.dataset.value = option.value;
            item.innerHTML = text;
            optionList.appendChild(item);
        }
    });


    let arrow = document.createElement('div');
    arrow.classList.add('arrow');
    active.appendChild(arrow);

    newSelect.appendChild(active);
    newSelect.appendChild(optionList);

    select.parentElement.append(newSelect);
    span.appendChild(select);


    document.querySelector('.selectMultiple ul').addEventListener('click', (e) => {
        let li = e.target.closest('li');
        levelValue.push(li.dataset.value)
        const levelSet = new Set(levelValue)
        levelValue.length = 0;
        levelValue.push(...levelSet)
        dataAjax(levelValue)


        if (!li) { return; }
        let select = li.closest('.selectMultiple');
        if (!select.classList.contains('clicked')) {
            select.classList.add('clicked');
            if (li.previousElementSibling) {
                li.previousElementSibling.classList.add('beforeRemove');
            }
            if (li.nextElementSibling) {
                li.nextElementSibling.classList.add('afterRemove');
            }
            li.classList.add('remove');
            let a = document.createElement('a');
            a.dataset.value = li.dataset.value;
            a.innerHTML = "<em>" + li.innerText + "</em><i></i>";
            a.classList.add('notShown');
            select.querySelector('div').appendChild(a); //might have to check later
            let selectEl = select.querySelector('select');
            let opt = selectEl.querySelector('option[value="' + li.dataset.value + '"]');
            opt.setAttribute('selected', 'selected');
            setTimeout(() => {
                a.classList.add('shown');
                select.querySelector('span').classList.add('hide');

            }, 300);
  
            setTimeout(() => {
                let styles = window.getComputedStyle(li);
                let liHeight = styles.height;
                let liPadding = styles.padding;
                let removing = li.animate([
                    {
                        height: liHeight,
                        padding: liPadding
                    },
                    {
                        height: '0px',
                        padding: '0px'
                    }
                ], {
                    duration: 300, easing: 'ease-in-out'
                });
                removing.onfinish = () => {
                    if (li.previousElementSibling) {
                        li.previousElementSibling.classList.remove('beforeRemove');
                    }
                    if (li.nextElementSibling) {
                        li.nextElementSibling.classList.remove('afterRemove');
                    }
                    li.remove();
                    select.classList.remove('clicked');
                }
 
            }, 300); 

        }
    });

    document.querySelector('.selectMultiple > div').addEventListener('click', (e) => {
        let a = e.target.closest('a');
        try {
            levelValue.splice(levelValue.indexOf(a.dataset.value), 1)
        } catch (error) {
            // Nothing
        }

        dataAjax(levelValue)
        let select = e.target.closest('.selectMultiple');
        if (!a) { return; }
        a.className = '';
        a.classList.add('remove');
        select.classList.add('open');
        let selectEl = select.querySelector('select');
        let opt = selectEl.querySelector('option[value="' + a.dataset.value + '"]');
        opt.removeAttribute('selected');
        a.classList.add('disappear');
        setTimeout(() => {
            // start animation
            let styles = window.getComputedStyle(a);
            let padding = styles.padding;
            let deltaWidth = styles.width;
            let deltaHeight = styles.height;

            let removeOption = a.animate([
                {
                    width: deltaWidth,
                    height: deltaHeight,
                    padding: padding
                },
                {
                    width: '0px',
                    height: '0px',
                    padding: '0px'
                }
            ], {
                duration: 0,
                easing: 'ease-in-out'
            });

            let li = document.createElement('li');
            li.dataset.value = a.dataset.value;
            li.innerText = a.querySelector('em').innerText;
            li.classList.add('show');
            select.querySelector('ul').appendChild(li);
            setTimeout(() => {
                if (!selectEl.selectedOptions.length) {
                    select.querySelector('span').classList.remove('hide');
                }
                li.className = '';
            }, 350);

            removeOption.onfinish = () => {
                a.remove();
            }
            //end animation

        }, 300);
    });

    document.querySelectorAll('.selectMultiple  > ul > li').forEach((el) => {
        el.addEventListener('click', (e) => {
            el.closest('.selectMultiple').classList.toggle('open');
        });
    });




    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('toggle')) {

            const img = e.target.querySelector('img');
            const relatedDiv = e.target.closest('.file-name-container').querySelector('.file-name');


            img.classList.toggle('rotated');
            relatedDiv.style.display = relatedDiv.style.display === 'none' ? '' : 'none';

        }
    });

    const sendBtn = document.getElementById('send')

    sendBtn.addEventListener('click' , function() {
            pathAjax(pathValue)
    })

    const openSelect = document.querySelector('.selectMultiple')

    openSelect.addEventListener('click' , function() {
        if(!openSelect.classList.contains('open')){
            openSelect.classList.add('open')
        }else{
            openSelect.classList.remove('open')
        }
    })



})




