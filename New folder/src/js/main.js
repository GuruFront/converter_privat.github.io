'use strict';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .then(function () {
            console.log("Service Worker Registered");
        })
        .catch(function(err) {
            console.log("Service Worker Failed to Register" + err);
        });
}

if (localStorage.lastTimeOfRequest) {
    var today = document.getElementById("today");
    today.innerText = localStorage.lastTimeOfRequest;
}

var cyFrom ='UAH';

var	
    url1= 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    list,
    input = document.getElementById('input'),
    cy = document.getElementById("cy"),
    cyType = document.getElementById("type");

var get = function(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    const result = xhr.responseText;
                    list = JSON.parse(result);
                    newTimeOfRequest();
                    callback(list);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
};

get(url1, updateList);

function updateList() {
    for(let item in list ){
        let opt = document.createElement('option');
        opt.innerHTML = opt.value = list[item].ccy;
        if ( list[item].ccy !== 'BTC' ) { cy.appendChild(opt);}
    }
}

function convert() {
    let result = document.getElementById('result'),
        type = cyType.options[cyType.selectedIndex].value,
    selected = cy.selectedIndex;
    result.value = input.value * list[selected][type] + ' ' + cyFrom;
}

cy.addEventListener('change', convert);
cyType.addEventListener('change', convert);
input.addEventListener('keyup', convert);


function addDateFormat(int) {
    int = int.toString();
    if (int.charAt(1)) {
        return int;
    } else {
        return '0' + int;
    }
}

function newTimeOfRequest() {
    if (window.navigator.onLine){
        let today    = document.getElementById('today'),
            newDate  = new Date(),
            now;

        today.innerText = '00:00:00 00.00.0000';
        today.innerText = now =
            addDateFormat(newDate.getHours()) + ':' +
            addDateFormat(newDate.getMinutes()) + ':' +
            addDateFormat(newDate.getSeconds()) + ' ' +
            newDate.toLocaleDateString();
        localStorage.lastTimeOfRequest = now;

    }
}

setInterval(function () {
    let internetStatus = document.getElementById('internet-status');
    if (window.navigator.onLine){
        internetStatus.classList.add("active");
    } else {
        internetStatus.classList.remove("active");
    }
}, 1000);