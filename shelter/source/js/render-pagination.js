'use strict';

let pets = [];
let fullPetsList = []; //48
const petsContainer = document.querySelector('#petsContainer');
const prevPage = document.querySelector('#prevPage');
const nextPage = document.querySelector('#nextPage');
const pageId = document.querySelector('#pageId');
const goForward = document.querySelector('#goFrw');
const goBack = document.querySelector('#goBack');

const request = new XMLHttpRequest();
request.open('GET', '../../data/pets.json');

fetch('../../data/pets.json').then(res => res.json()).then(list => {
    pets = list;

    fullPetsList = (() => {
        let tempArr = [];

        for (let i = 0; i < 6; i++) {
            const newPets = pets;

            for (let j = pets.length; j > 0; j--) {
                let randInd = Math.floor(Math.random() * j);
                const randElement = newPets.splice(randInd, 1)[0];
                newPets.push(randElement);
            }

            tempArr = [...tempArr, ...newPets];
        }
        return tempArr
    })();

    fullPetsList = sort863(fullPetsList);

    createPets(fullPetsList);
})

// request.onload = () => {
//     pets = JSON.parse(request.response);
//
// }

const render = (container, template, place = `beforeend`) => {
    container.insertAdjacentHTML(place, template);
};

const createPet = (i) => {
    return(
        `                <div class="looking-for__container__item">
                    <img class="looking-for__container__item__picture" src="${fullPetsList[i].img}" alt="${fullPetsList[i].name}" width="270" height="270">
                    <span class="looking-for__container__item__name">${fullPetsList[i].name}</span>
                    <a class="looking-for__container__item__button" href="#">Learn more</a>
                </div>`
    )
}
const createPets = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        render(petsContainer, createPet(i));
    }
}

request.send();

const sort863 = (list) => {
    list = sort6recursively(list);

    return list
}

const sort6recursively = (list) => {
    const length = list.length;

    for (let i = 0; i < (length / 6); i++) {
        const stepList = list.slice(i * 6, (i * 6) + 6);

        for (let j = 0; j < 6; j++) {
            const duplicatedItem = stepList.find((item, ind) => {
                return item.name === stepList[j].name && (ind !== j);
            });

            if (duplicatedItem !== undefined) {
                const ind = (i * 6) + j;
                const which8OfList = Math.trunc(ind / 8);

                list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);

                sort6recursively(list);
            }
        }
    }

    return list;
}

let pageCounter = 0;

prevPage.addEventListener('click', (e) => {
    if (pageCounter > 0) {
        pageCounter--;
    }
    if (pageCounter === 0) {
        prevPage.classList.add('looking-for__controls__button--disabled');
        goBack.classList.add('looking-for__controls__button--disabled');
    }
    pageId.innerHTML = (pageCounter + 1).toString();
    petsContainer.style.top = `calc(${-933 * pageCounter}px)`;
});

nextPage.addEventListener('click', (e) => {
    prevPage.classList.remove('looking-for__controls__button--disabled');
    goBack.classList.remove('looking-for__controls__button--disabled');
    if (pageCounter < (petsContainer.offsetHeight / 933) - 1) {
        pageCounter++;
    }
    pageId.innerHTML = (pageCounter + 1).toString();
    petsContainer.style.top = `calc(${-933 * pageCounter}px)`;
});

goForward.addEventListener('click', () => {
    prevPage.classList.remove('looking-for__controls__button--disabled');
    goBack.classList.remove('looking-for__controls__button--disabled');
    pageId.innerHTML = Math.ceil(petsContainer.offsetHeight / 933 - 1);
    pageCounter = Math.ceil(petsContainer.offsetHeight / 933 - 1);
    petsContainer.style.top = `calc(${-933 * Math.ceil(petsContainer.offsetHeight / 933 - 1)}px)`;
})

goBack.addEventListener('click', () => {
    goBack.classList.add('looking-for__controls__button--disabled');
    prevPage.classList.add('looking-for__controls__button--disabled');
    pageId.innerHTML = 1;
    pageCounter = 0;
    petsContainer.style.top = `0px`;
})
