'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault(); // stop scrolling up
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///// scrolling button
btnScrollTo.addEventListener('click', function (e) {
  // modern js
  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////
//----- scrolling nav link

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//
// -----  Tabbed component

tabContainer.addEventListener('click', function (e) {
  const tabClicked = e.target.closest('.operations__tab');

  // Guard clause :  modern JS

  // FIX LỖI : click trong khung tab-container nhưng ko clcik vào tab nào cả
  if (!tabClicked) return;
  // end: Guard clause

  // Remove active classes
  Array.from(tabs, val => val.classList.remove('operations__tab--active'));
  tabContent.forEach(val =>
    val.classList.remove('operations__content--active')
  );

  // active tab
  tabClicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(
      `.operations__content--${tabClicked.getAttribute('data-tab')}`
    )
    .classList.add('operations__content--active');
});
//
//
///------------- fade in/out menu animation
//
const handleHover = function (e) {
  const link = e.target;

  if (link.classList.contains('nav__link')) {
    //console.log(this); // 0.5 cho mouseoverf và 1 cho mouseout

    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(val => {
      // tất cả các nav__link sẽ có opacity = this trừ CÁI ĐANG ĐƯỢC HOVER
      if (val !== link) val.style.opacity = this;
      // this được gọi từ argument của hàm handle.bind(this) tại addEventListener
    });
    logo.style.opacity = this;
  }
};
/// handleHover.bind(0.5) trả về 1 hàm mới có this = 0.5
nav.addEventListener('mouseover', handleHover.bind(0.5));
/// handleHover.bind(0.5) trả về 1 hàm mới có this = 1
nav.addEventListener('mouseout', handleHover.bind(1));
//
//

/// ///- sticky navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // lấy đc height của nav
const obsStickyNav = function (entries) {
  const [entry] = entries; // destructuring lấy gía trị trong mảng entries thanh biến entry
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(obsStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // khi section1 sroll đến vị trí -navHeight nó sẽ hiển thị sticky nav
});
headerObserver.observe(header);
//
/// HIỀN THỊ all Section
const allSection = document.querySelectorAll('.section');

const obsAllSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; // isIntersecting :false thi ko chay dòng code bên dưới
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // chỉ chạy lần đầu khi scroll down
};

const secObserver = new IntersectionObserver(obsAllSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  // mỗi section sẽ đc observer 1 secObserver riêng
  secObserver.observe(section);
  // section.classList.add('section--hidden'); // đầu tiên ẩn tất cả section
});
//
/// Lazy img
//// 'img[data-src]': lấy img có thuộc tính data-src
const allLazyImg = document.querySelectorAll('img[data-src]');

const obsLazyImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  const newLink = entry.target.getAttribute('data-src');
  entry.target.setAttribute('src', newLink);

  // chỉ bõ class blur khi img full load để ta tah61y đc hiệu ứng
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target); // chỉ chạy lần đầu khi scroll down
};

const lazyImgObserver = new IntersectionObserver(obsLazyImg, {
  root: null,
  threshold: 0,
});

allLazyImg.forEach(img => lazyImgObserver.observe(img));
//
//
////------- building SLIDER

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const rightArrow = document.querySelector('.slider__btn--right');
  const leftArrow = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0; // slide hien thi luon ở vị trí slide 0%
  let maxSlide = slides.length; // 4 slides ==> length = 4

  /// cách 2 tạo hàm ngắn gọn
  const goToSlide = function (slide) {
    slides.forEach((val, i) => {
      val.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      // do curSlide chạy từ 0 => max curSlide = maxSlide - 1
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  };

  /// previous Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  };

  /// event listeners
  leftArrow.addEventListener('click', prevSlide);
  rightArrow.addEventListener('click', nextSlide);
  ///
  /// move slide bằng key trái/phải trên keyboard
  document.addEventListener('keydown', function (e) {
    console.log(e.key);
    if (e.key === 'ArrowLeft') prevSlide();
    // gọi if bằng 2 cách khác nhau
    e.key === 'ArrowRight' && nextSlide();
  });
  //
  //// move slide bằng dấu chấm phía dưới
  const createDot = function () {
    // cứ 1 slide sẽ tạo ra 1 button .
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    const dot = document.querySelectorAll('.dots__dot');
    dot.forEach(val => {
      val.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // hiển thị ban đầu
  const init = function () {
    goToSlide(0); // 0%, 100%, 200%, 300%
    createDot();
    activeDot(0); // gan cho slide dau tien class active
  };

  init();

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // cach 1 : const slide = e.target.getAttribute('data-slide');
      // cách 2
      // const slide = e.target.dataset.slide;// các thuộc tính bắt đầu bằng data-xxx khi gọi phải gọi là .dataset.xxx
      // destructuring cho slide trong object bằng cách gọi cùng tên slide trong {} ==>
      //  slide = e.target.dataset.slide  ====  { slide } = e.target.dataset;
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};

slider();
