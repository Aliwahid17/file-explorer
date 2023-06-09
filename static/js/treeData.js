'use strict';

function TreeData(data, select) {
    let main = document.querySelector(select);
    let treecanvas = document.createElement('div');
    treecanvas.className = 'tree';

    let treeCode = buildTree(data, Object.keys(data)[0]);
    treecanvas.innerHTML = treeCode;
    main.appendChild(treecanvas);
}

function buildTree(obj, node) {
    let treeString = `<li><span class="tree-value" data-active="false" data-value="${obj[node].name}" title="Number of files : ${obj[node].files}" >` + obj[node].name + "</span>";
    let sons = [];
    for (let i in obj) {
        if (obj[i].parent == node)
            sons.push(i);
    }
    if (sons.length > 0) {
        treeString += "<ul>";
        for (let i in sons) {
            treeString += buildTree(obj, sons[i]);
        }
        treeString += "</ul>";
    }
    return treeString;
}
