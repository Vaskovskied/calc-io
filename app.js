const $circle = document.querySelector('.circle');
const $calcDiv = document.querySelector('.calc-div');
const $line0 = document.querySelector('.line0');
const $line1 = document.querySelector('.line1')

$circle.addEventListener('click', function() {
    $circle.classList.add('circle-clicked');
    $calcDiv.classList.add('calc-div-clicked');
    $line0.classList.add('line0-clicked');
    $line1.classList.add('line1-clicked')
})