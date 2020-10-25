"use strict";

let quotesList;
const time = document.querySelector('#time');
const greeting = document.querySelector('#greeting');
const userName = document.querySelector('#name');
const focus = document.querySelector('#focus');
const dateDay =document.querySelector('#date');
const monthList = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Декабря'];
const nextScreenBtn = document.querySelector('.switcher');
const auth = document.querySelector('.author');
const quotes = document.querySelector('#quote');

let bgCount = 0;
let prevOur = '';
const SCREEN_AMOUNT = 20;

const getRandomeNumber = (min, max) => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
    return arr
}

fetch('https://type.fit/api/quotes')
    .then(res => res.json())
    .then(data => quotesList = shuffle(data));
setTimeout(() => {
    let index = getRandomeNumber(0, quotesList.length);

    quotes.textContent = quotesList[index].text;
    auth.textContent = quotesList[index].author;

}, 1000);

// Show Time
const showTime = () => {
    // let today = new Date(2019, 6, 10, 20, 59,59);
    let today = new Date();
    let hour = today.getHours();
    if (prevOur !== today.getHours()) {
        setBackgroundGreet();
    }
    prevOur = hour;
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let options = { weekday: 'long'};
    let getDay = new Intl.DateTimeFormat('ru-Ru', options).format(today);
    let getDate = today.getDate();
    let readableMonth = monthList[today.getMonth()];
    // Output time
    time.innerHTML = `${hour}<span>:</span>${addZero(minutes)}<span>:</span>${addZero(seconds)}`;


    // Output Date
    dateDay.innerHTML = `${getDay}, ${getDate} ${readableMonth}`;

    setTimeout(showTime, 1000);
}

// Add Zero

const addZero = (numb) => {
    return (parseInt(numb, 10) < 10 ? '0' : '') + numb;
}

// Set Backgrounds and Greeting

const changeBg = (part) => {
    bgCount === SCREEN_AMOUNT ? bgCount = 1 : bgCount++;
    document.body.style.backgroundImage = "url('assets/images/" + part + "/" + `${addZero(bgCount)}`+ ".jpg')";
}

const setBackgroundGreet = () => {
    let today = new Date();
    let hour = today.getHours();
    let part = '';
    if (hour < 6){
        greeting.textContent = 'Доброй ночи!';
        part = 'night'
        changeBg(part);
    }else if (hour < 12) {
        greeting.textContent = 'Доброе утро!';
        part = 'morning';
        changeBg(part);
    } else if (hour < 18) {
        greeting.textContent = 'Добрый день!';
        part = 'day';
        changeBg(part);
    } else if (hour < 24) {
        greeting.textContent = 'Добрый вечер!';
        part = 'evening';
        changeBg(part);
        document.body.style.color = '#ffffff';
    }
}

// Get name

const getName = () => {
    if (localStorage.getItem('name') === null) {
        userName.textContent = '[Введите имя]'
    } else {
        userName.textContent = localStorage.getItem('name');
    }
}

// Get Focus

const getFocus = () => {
    if (localStorage.getItem('focus') === null) {
        focus.textContent = '[Enter Focus]'
    } else {
        focus.textContent = localStorage.getItem('focus');
    }
}

// Set name
const setName = (evt) => {
    if (evt.type === 'keypress') {
        // Make sure enter is pressed
        if (evt.which == 13 || evt.keyCode == 13) {
            if (userName.innerHTML === '') {
                userName.textContent = localStorage.getItem('name');
            } else {
                localStorage.setItem('name', evt.target.innerText);
                userName.blur();
            }
        }
    } else {
        if (userName.innerHTML === '') {
            userName.textContent = localStorage.getItem('name');
        } else {
            localStorage.setItem('name', evt.target.innerText);
        }
    }
}

// Set Focus

const setFocus = (evt) => {
    if (evt.type === 'keypress') {
        // Make sure enter is pressed
        if (evt.which == 13 || evt.keyCode == 13) {
            if (focus.innerHTML === '') {
                focus.textContent = localStorage.getItem('focus');
            } else localStorage.setItem('focus', evt.target.innerText);
            focus.blur();
        }
    } else {
        if (focus.innerHTML === '') {
            focus.textContent = localStorage.getItem('focus')
        } else {
            localStorage.setItem('focus', evt.target.innerText);
        }
    }
}

const clearField = () => {
    userName.textContent = '';
}

const clearFocus = () => {
    focus.textContent = '';
}

const changeScreen = () => {
    setBackgroundGreet()
}


userName.addEventListener('click', clearField);
userName.addEventListener('focus', clearField);
userName.addEventListener('keypress', setName);
userName.addEventListener('blur', setName);

focus.addEventListener('click', clearFocus);
focus.addEventListener('focus', clearFocus);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

nextScreenBtn.addEventListener('click', changeScreen);
// Run
showTime();
getName();
getFocus();
