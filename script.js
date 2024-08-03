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
  //// --- SCROLLING
  // const scrollSc1 = section1.getBoundingClientRect();
  // console.log(scrollSc1); // lấy vị trí của section--1 so với top viewport (KO PHẢI SO VỚI TOP PAGE)
  // console.log(e.target.getBoundingClientRect()); // lấy vị trí của btn-scroll-to so với top viewport

  // console.log(
  //   'x, y đã dich chuyen x/y? so với vi tri TOP PAGE: ',
  //   window.pageXOffset,
  //   window.pageYOffset
  // );

  // console.log(
  //   'height/width of viewport right now: ',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // cách 1: muốn trả về đầu section 1 : vi tri hien thoi của nut bam so với view màn hình hiện thời + gia tri đã scroll từ dau den vi tri màn hình hien thời
  // window.scrollTo(
  //   scrollSc1.left + window.pageXOffset,
  //   scrollSc1.top + window.pageYOffset
  // );
  // cách 2 làm cho scroll smoother ( structure giống như 1 object)
  // window.scrollTo({
  //   left: scrollSc1.left + window.pageXOffset,
  //   top: scrollSc1.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  //
  // Cách 3: modern js
  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////
//----- scrolling nav link
// document.querySelectorAll('.nav__link').forEach(val =>
//   val.addEventListener('click', function (el) {
//     el.preventDefault();
//     console.log(el.target);
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );
///// nếu làm cách trên phải chạy vòng lặp forEach, nếu có quá nhiều link, forEach sẽ làm châm web
// cách 2 ko cần chạy forEach, querySelector đối tượng cha rồi tìm đến con
/// 1. Add event listener to direct parent element
/// 2. Find the element want to do action by (contains(''))
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
  // nếu không phải click vào tab (tabClicked doesNOT exist), thoát khỏi/return khỏi hàm, không thực hiện code bên dưới
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
    // chỉ muốn tạo hành động lên các a.nav_link, hover lên chỗ khác a.nav__link sẽ ko có efect
    // quay về tìm closest cha roi tìm con .nav_link
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
///- sticky navigation
// const initialSec1Top = section1.getBoundingClientRect();
// console.log(initialSec1Top);

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialSec1Top.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
///
// cách 2:  intersection observer API for sticky navigation
// const obsCallback = function (entries, observer) {
//   // entries dựa vào dữ liệu truyền vào ở threshold
//   entries.forEach(val => {
//     console.log(val);
//   });
// };

// const obsOptions = {
//   // root: diểm để target (section1) so sánh,
//   // root: document.querySelector('body') : có thề dùng element cha của section1 làm mốc
//   root: null, //so với toàn bộ man hình
//   // khi target (section1) hiển thị 0.1 (10%) so với viewport (root: null) sẽ gọi hàm obsCallback (scroll up/down đều đc gọi)
//   // có thề truyền vào nhiều vi trí : threshold: [0,0.2] => vi trí 0 và 20% so với view port
//   threshold: [0, 0.2],
// };

// // khỏi tạo biến cho IntersectionObserver
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// // section1 là target của IntersectionObserver
// observer.observe(section1);
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

  /// Start: trình bày đầy đủ để hiểu
  // slides.forEach((val, i) => {
  //   val.style.transform = `translateX(${100 * i}%)`;
  // });
  // // 0%, 100%, 200%, 300%
  /// next slide
  // rightArrow.addEventListener('click', function () {
  //   if (curSlide === maxSlide - 1) {
  //     // do curSlide chạy từ 0
  //     curSlide = 0;
  //   } else {
  //     curSlide++;
  //   }

  //   slides.forEach((val, i) => {
  //     val.style.transform = `translateX(${100 * (i - curSlide)}%)`;
  //   });

  //   // 1st click : i = 0 , curSlide = 1 // -100%, 0%, 100%, 200% ==> đang hiển thị slide số 2
  //   // 2nd       ; i = 0,  curSlide = 2  ==> -200%,-100%, 0%, 100% ==> đang hiển thị slide số 3
  // });
  //
  /// previous Slide
  // leftArrow.addEventListener('click', function () {
  //   if (curSlide === 0) {
  //     curSlide = maxSlide - 1;
  //   } else {
  //     curSlide--;
  //   }

  //   slides.forEach((val, i) => {
  //     val.style.transform = `translateX(${100 * (i - curSlide)}%)`;
  //   });

  // });
  // end: đầy đủ
  //
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
//
//
//------- lecture/example
//
/// selecting
// const header = document.querySelector('.header'); // trả về .section dau tien
// const allSections = document.querySelectorAll('.section');
// // .querySelectorAll : trả về 1 Nodelist, biến Nodelist sẽ ko bị thay đổi
// console.log(allSections);
// const allButton = document.getElementsByTagName('button');
// // .getElementsByTagName trả về 1 HTMLCollection(9)
// // HTMLCollection(9) là 1 biến động có thể bị thay đổi theo HTML sau khi khởi tạo
// console.log(allButton);
// //
// // creating and inserting
// // use : .insertAdjacentHTML()
// const message = document.createElement('div'); // create a dom element
// message.classList.add('cookie-message');
// message.textContent = 'We use cookie for improve functionality and analytics';
// message.innerHTML =
//   'We use cookie for improve functionality and analytics. <button class=btn btn--close--cookie>Got it</button>'; // innerHTML có thể dùng để read and add HTML
// ///// add child element for header
// // header.prepend(message); // add at first position (first child) of .header
// header.append(message); // add at last position (last child) of .header
//
///// add silbings for header
// header.before(message);
// header.after(message);
//
// nếu add cùng 1 biến khi dùng prepend(message),append(message), before(message), after(message) thì chỉ có dòng code cuối cùng đc thực thi
// /// chỉ có 1 biến message đc add tại vi trí cuối, không thể vừa add tai prepend và append cúng lúc
// muốn add cho cac dòng còn lại phải thêm .cloneNode(true) phải dùng:  header.prepend(message.cloneNode(true))

///// delete elements
// gọi trực tiếp created Element khi dùng addEventListener sẽ báo lỗi (null)
// document
//   .querySelector('.btn--close--cookie')  // thực thi trực tiếp .btn--close--cookie sẽ lỗi null
//   .addEventListener('click', function () {
//     message.remove();
//   });
//
// gọi parent element rồi tìm nó đê thực thi
// document
//   .querySelector('.cookie-message')
//   .addEventListener('click', function (e) {
//     if (e.target.classList.contains('btn'))
//       // code đề tìm child ele bên trong parent ele
//       // message.remove();
//       message.parentElement.removeChild(message); // cách remove thông dụng
//   });
// //
// //
// ////// style
// message.style.backgroundColor = 'lightBlue';
// message.style.width = '120%'; // viết giong như trong css

// console.log(getComputedStyle(message)); // lấy đc tất cả các style của message
// console.log(getComputedStyle(message).color); // chỉ lấy thuộc tính color của message

// console.log(getComputedStyle(message).height);

// // gán giá trị mới (+ 40px) cho thuộc tính height có sẵn trong message
// //  Number.parseFloat(getComputedStyle(message).height, 10) : chỉ lấy phần số trong height ( bỏ chữ px)
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
// console.log(getComputedStyle(message).height);
// //
// // set gia tri mới cho biến css (documentElement)
// document.documentElement.style.setProperty('--color-primary', 'lightblue');
// //
// //
// //------- Attribute
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt); // Bankist logo
// logo.alt = 'alt da thay doi'; // đổi attribute có san
// // non standard attribute
// console.log(logo.designer); // undefined
// console.log(logo.getAttribute('designer')); // Jonas - với các attribute non-standard phải lấy ba82nmg getAttribute
// logo.setAttribute('company', 'tantrinh'); // thêm attribute mới
// //
// // specical
// console.log(logo.src); // http://127.0.0.1:8080/img/logo.png : absolute link
// console.log(logo.getAttribute('src')); // img/logo.png  : ralative link

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); // http://127.0.0.1:8080/# => absolute link
// console.log(link.getAttribute('href')); // # => relative link
// ///
// //******-- Data attribute - dùng trong UI
//// các thuộc tính bắt đầu bằng data-xxx khi gọi phải gọi là .dataset.xxx
// console.log(logo.dataset.versionNumber); // 3.0
// //
// ///-- cLASS
// logo.classList.add('c', 'j');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('j');
//
// đùng dùng vì khi add bằng logo.className="aa" nó sẽ bỏ hết class cũ
//
///----------- .addEventListener nâng cao
// const h1Title = document.querySelector('.header__title > h1');
// // có thể select .header__title > h1 giống trong css
// const alertH1 = function (e) {
//   alert('H1 is so important');
// };

// h1Title.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1Title.removeEventListener('mouseenter', alertH1), 3000);
// phải dùng addEventListener trước 3s từ khi load trang, sau 3s nó sẽ bị remove
// practice
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// /// tạo random color
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// //
// // target: element đang đc tác động (click)
// // currentTarget: vi trí element dừng lại sau khi đã được bubling ()
// // đang click vào link (feature) xem khac biet giua target và currentTarget
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('link target', e.target); // link
//   console.log('link curtarget', e.currentTarget); // link
//   console.log(e.target === this); //true
//   console.log(e.currentTarget === this); //true

//   // //// stop propagation : làm mát tac dung của hanh dong len parent, ko nên dùng
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('nlinks target', e.target); //link
//   console.log('nlinks curtarget', e.currentTarget); // nav_links
//   console.log(e.target === this); //false
//   console.log(e.currentTarget === this); //true
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('nav target', e.target); // link
//   console.log('nav curtarget', e.currentTarget); // nav
//   console.log(e.target === this); //false
//   console.log(e.currentTarget === this); //true
// });
/////////
///----- DOM traversing ( DOM relatives)

/// GOing downwards ( - selecting children)
// const h1 = document.querySelector('h1');
// console.log(h1.childNodes); // nodelist hiển thị tất cả ele trong h1 ( text,commment,,,)
// console.log(h1.children); // html collections ( chỉ html tag : 1 level )
// console.log(h1.firstChild); // text
// console.log((h1.firstElementChild.style.color = 'blue')); //span.highlight
// console.log(h1.lastChild); // text
// console.log((h1.lastElementChild.style.color = 'red')); //span.highlight

// ///// GOing upwards ( -selecting parents)
// console.log(h1.parentNode); // nodelist hiển thị tất cả ele trong h1 ( text,commment,,,)
// console.log(h1.parentElement); // html collections ( chỉ html tag : 1 level )

// // h1.closest('.header').style.backgroundColor = 'red'; // set style bình thường dùng backgroundColor
// h1.closest('.header').style.background = 'var(--gradient-secondary)'; //gọi biến trong css chỉ dùng background
// ///// closet('.header') tìm first parent có class là header
// h1.closest('h1').style.background = 'var(--gradient-primary)'; // nếu h1.closet(h1) : gọi chính nó thì trả về chính nó
// ////*******  closet() là hàm opposite của querySelector()
// // querySelector() : tìm first Child
// // closet() : tìm first PARENT

// ///// GOing sideward ( selecting siblings)
// console.log(h1.previousElementSibling); // null
// console.log(h1.nextElementSibling); // h4

// console.log(h1.nextSibling); //text
// console.log(h1.previousSibling); //text
// ///// chỉ tìm đc direct siblings, muốn selecting all siblings
// console.log(h1.parentElement.children);
// // [...h1.parentElement.children].forEach(function (el) {
// //   if (el !== h1) el.style.transform = 'scale(.5)';
// // });

// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.transform = 'scale(.5)';
// });
///
//----------DOM event lifecycle
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log(
//     'this happened after only all HTML AND JS loaded (donot wait for imgs'
//   );
// });

// window.addEventListener('load', function (e) {
//   console.log('this happened after everything loaded (HTML,CSS,JS,imgs');
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log('this happened before close tab');
//   e.returnValue = '';
// });
