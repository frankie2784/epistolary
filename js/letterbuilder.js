var parentElement, divChild, titleChild, linkChild, fromChild, imageChild;

var path = "letters/";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

d3.json(
    'letters.json',
    function (err, markersjson) {
    if (err) throw err;
    
    var tree = document.createDocumentFragment();

    shuffleArray(markersjson);

    markersjson.forEach(function (marker) {
        divChild = document.createElement('div');
        divChild.setAttribute('class', 'letterbox');
        divChild.setAttribute('id', marker.id);
        imageChild = document.createElement('div');
        imageChild.setAttribute('class', 'letterimage');
        imageChild.setAttribute('style','background-image:url('+path+marker.images[0]+')');
        titleChild = document.createElement('p');
        titleChild.innerHTML = marker.title;
        linkChild = document.createElement('a');
        linkChild.setAttribute('class', 'divLink');
        linkChild.setAttribute('href', '#lightbox');
        linkChild.setAttribute('onClick', 'return loadImages(this)');
        linkChild.setAttribute('id', marker.id);
        fromChild = document.createElement('div');
        fromChild.setAttribute('class', 'from');
        fromChild.innerHTML = marker.from;
        divChild.appendChild(imageChild);
        divChild.appendChild(titleChild);
        divChild.appendChild(linkChild);
        divChild.appendChild(fromChild);
        tree.appendChild(divChild);
    
    });

    // create a DOM element for the marker

    parentElement = document.getElementById('letters-here');
    parentElement.appendChild(tree);

});

let container = document.querySelector('.container');
let letters = document.querySelector('.lettersbody');
let mapreturn = document.querySelector('.map-return');
let stroke = document.querySelector('.stroke-1');
container.addEventListener('scroll', function() {
    if (letters.getBoundingClientRect().top > 0) {
        mapreturn.style.opacity = 0;
        mapreturn.style.visibility = "hidden";
    } else {
        mapreturn.style.opacity = 1;
        mapreturn.style.visibility = "visible";
    }
});

window.addEventListener('resize', function() {
    stroke.setAttribute("x1","calc(50vw - 20px)");
    stroke.setAttribute("x2","calc(50vw + 20px)");
});