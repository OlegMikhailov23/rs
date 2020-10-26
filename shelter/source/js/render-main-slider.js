// 'use strict';
//
// let petsData;
//
// // Shuffle pets-data array
// const shuffle = (arr) => {
//     for (let i = arr.length - 1; i > 0; i--) {
//         let j = Math.floor(Math.random() * (i + 1));
//         let t = arr[i];
//         arr[i] = arr[j];
//         arr[j] = t;
//     }
//     return arr
// }
//
// // Get pets-data
// fetch('../../data/pets.json')
//     .then(res => res.json())
//     .then(data => petsData = shuffle(data));
//
// // Render slides within swiper's method
// setTimeout(() => {
//     for (let i = 0; i < petsData.length; i++) {
//
//         ourFriendsSlider.appendSlide(`<div class="our-friends__slider__item swiper-slide">
//                             <img class="our-friends__slider__item__picture" src="${petsData[i].img}"
//                                  alt="Pic-${i}">
//                             <span class="our-friends__slider__item__name">${petsData[i].name}</span>
//                             <button class="our-friends__slider__item__button" href="#">Learn more</button>
//                         </div>`);
//     }
// }, 500);

