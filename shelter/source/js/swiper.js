'use strict';

  const ourFriendsSlider = new Swiper('#ourFriends', {
    grabCursor: 'true',
    loopedSlides: 1,
    slidesPerGroup: 1,
    spaceBetween: 20,
    initialSlide: 1,
    centeredSlides: false,
    loop: true,
    navigation: {
      nextEl: '.our-friends__slider__control--next',
      prevEl: '.our-friends__slider__control--prev',
    },
    breakpoints: {
      768: {
        centeredSlides: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 40,
        loopedSlides: 4,
      },
      1280: {
        centeredSlides: false,
        slidesOffsetBefore: 0,
        slidesPerView: 3,
        slidesPerGroup: 3,
        loopedSlides: 9,
        spaceBetween: 90,
      }
    }
  });



