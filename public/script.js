let menu = document.querySelector('.menu')
console.log('1')

menu.addEventListener("click", function() {
    console.log('2')
    menu.classList.toggle('menu-visible')
    console.log('3')
});