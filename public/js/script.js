window.onscroll = function() {
  myfunction();
};
// DOM Select
var nav = document.querySelector("nav");
var features = document.querySelector(".features");

function myfunction() {
  var dftop = window.pageYOffset;
  if (dftop > features.offsetTop) {
    nav.classList.add("sticky");
  } else if (dftop < features.offsetTop) {
    nav.classList.remove("sticky");
  }
}
