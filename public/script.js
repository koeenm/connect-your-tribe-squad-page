const toggleButton = document.querySelector('.menu-opener')
const menu = document.querySelector('.menu')

toggleButton.addEventListener('click', function() {
    menu.classList.toggle("menu-translate")
})