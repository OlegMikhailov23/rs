"use strict";

//DOM Elements

const time = document.querySelector('#time');
const greeting = document.querySelector('#greeting');
const userName = document.querySelector('#name');
const focus = document.querySelector('#focus');

// Option

const showAmPm = true;

// Show Time
const showTime = () => {

    let today = new Date();
    let hour = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    // AM or PM???
    const amPm = hour >= 12 ? 'PM' : 'AM'

    // 12hr Format
    hour = hour % 12 || 12;

    // Output time
    time.innerHTML = `${hour}<span>:</span>${addZero(minutes)}<span>:</span>${addZero(seconds)} ${showAmPm ? amPm : ''}`;

    setTimeout(showTime, 1000);
}

// Add Zero

const addZero = (numb) => {
    return (parseInt(numb, 10) < 10 ? '0' : '') + numb;
}

// Set Backgrounds and Greeting

const setBackgroundGreet = () => {
    let today = new Date();
    // let today = new Date(2020, 10,24, 7, 20, 20 );
    let hour = today.getHours();

    if (hour < 12) {
        // Morning
        console.log('morning')
        greeting.textContent = 'Good Morning!';
        document.body.style.backgroundImage = "url('assets/images/morning/01.jpg')";
    } else if (hour < 18) {
        // Afternoon
        console.log(hour, 'Afternoon')
        greeting.textContent = 'Good Afternoon!';
        document.body.style.backgroundImage = "url('assets/images/day/01.jpg')";
    } else {
        // Evening
        console.log('Evening')
        greeting.textContent = 'Good Evening!';
        document.body.style.backgroundImage = "url('assets/images/evening/01.jpg')";
        document.body.style.color = '#ffffff';
    }
}

// Get name

const getName = () => {
    if (localStorage.getItem('name') === null) {
        userName.textContent = '[Enter Name]'
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
            localStorage.setItem('name', evt.target.innerText);
            userName.blur();
        }
    } else {
        localStorage.setItem('name', evt.target.innerText);
    }
}

// Set Focus

const setFocus = (evt) => {
    if (evt.type === 'keypress') {
        // Make sure enter is pressed
        if (evt.which == 13 || evt.keyCode == 13) {
            localStorage.setItem('focus', evt.target.innerText);
            focus.blur();
        }
    } else {
        localStorage.setItem('focus', evt.target.innerText);
    }
}

userName.addEventListener('keypress', setName);
userName.addEventListener('blur', setName);

focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

// Run
setBackgroundGreet();
showTime();
getName();
getFocus();
