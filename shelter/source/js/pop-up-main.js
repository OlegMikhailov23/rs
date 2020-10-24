'use strict'

const documentBody = document.querySelector('body');
const render = (container, template, place = `beforeend`) => {
    container.insertAdjacentHTML(place, template);
};

const closeElement = (el) => {
    documentBody.removeChild(el);
}

const createPopupTemplate = (id) => {
    return (
        `<div class="pop-up">
    <div class="pop-up__background" title="Close"></div>
    <div class="pop-up__wrapper">
    <button type="button" id="closePopUp" title="Close">Close</button>
    <div class="pop-up__picture">
        <img src="${petsData[id].img}" alt="${petsData[id].name}">
    </div>
    <div class="pop-up__content">
        <h3 class="pop-up__content__name" id="name">${petsData[id].name}</h3>
        <span class="pop-up__content__type">${petsData[id].type} - ${petsData[id].breed}</span>
        <p class="pop-up__content__depict">${petsData[id].description}</p>
        <ul class="pop-up__content__property-list">
            <li><span>Age:</span>${petsData[id].age}</li>
            <li><span>Inoculations:</span> ${petsData[id].inoculations}</li>
            <li><span>Diseases:</span> ${petsData[id].diseases}</li>
            <li><span>Parasites:</span> ${petsData[id].parasites}</li>
        </ul>
    </div>
</div>
</div>`
    );
};

setTimeout(() => {
    const slideCollection = document.querySelectorAll('.swiper-slide');
    slideCollection.forEach(slide => {
            slide.addEventListener('click', () => {
                const slideId = slide.getAttribute('data-swiper-slide-index');
                render(documentBody, createPopupTemplate(slideId));
                const closePopupButton = document.querySelector('#closePopUp');
                const popUp = document.querySelector('.pop-up');
                const popUpBackground = document.querySelector('.pop-up__background');

                closePopupButton.addEventListener('click', () => {
                    closeElement(popUp);
                })
                popUpBackground.addEventListener('click', () => {
                    closeElement(popUp);
                })
            });
        }
    )
}, 800)



