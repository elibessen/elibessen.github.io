const [red, green, blue] = [255, 255, 255];
const changedSection = document.querySelector('body');
const footer = document.querySelector("#footer")

let elementPosition = (footer.getBoundingClientRect().y) / 150;

$(window).resize(function(){
    elementPosition = (footer.getBoundingClientRect().y) / 150;
})

window.addEventListener('scroll', () => {
    let y = 1 + (window.scrollY || window.pageYOffset) / 150;
    console.log(y);
    if (y < elementPosition + 5){
        y = 1;
    }else{
        y = y - elementPosition - 5;
        const [r, g, b] = [red/y-elementPosition - 45, green/y-elementPosition - 45, blue/y-elementPosition- 45].map(Math.round);
        changedSection.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        document.querySelector(".footer").style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
})