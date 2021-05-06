const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

const navLogo = document.querySelector('#navbar__logo');

//Display mobile menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
}

menu.addEventListener('click', mobileMenu);

//Show active menu when scrolling

const highlightMenu = () => {
    const elem = document.querySelector('.highlight');
    const homeMenu = document.querySelector('#home-page');
    const mapsMenu = document.querySelector('#maps-page');
    const tableMenu = document.querySelector('#table-page');
    let scrollPos = window.scrollY;

    //adds 'highlight' class to my menu items

    if(window.innerWidth > 960 && scrollPos < 600) {
        homeMenu.classList.add('highlight');
        mapsMenu.classList.remove('highlight');
    return;
    } else if (window.innerWidth > 960 && scrollPos < 1400) {
        mapsMenu.classList.add('highlight');
        homeMenu.classList.remove('highlight');
        tableMenu.classList.remove('highlight');
        return;
      } else if (window.innerWidth > 960 && scrollPos < 2870) {
        tableMenu.classList.add('highlight');
        mapsMenu.classList.remove('highlight');
        return;
      }
      if ((elem && window.innerWIdth < 960 && scrollPos < 600) || elem) {
        elem.classList.remove('highlight');
      }

};

window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);

//  Close mobile Menu when clicking on a menu item
const hideMobileMenu = () => {
  const menuBars = document.querySelector('.is-active');
  if (window.innerWidth <= 768 && menuBars) {
    menu.classList.toggle('is-active');
    menuLinks.classList.remove('active');
  }
};

menuLinks.addEventListener('click', hideMobileMenu);
navLogo.addEventListener('click', hideMobileMenu);


//Get the button:
mybutton = document.getElementById("search-icon");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "block";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}