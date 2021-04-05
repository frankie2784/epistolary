var parentElement, divChild, titleChild, linkChild, fromChild, imageChild;

var path = "letters/";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

letterbuilder();

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

function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'letters.json', true); // Replace 'appDataServices' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}

function letterbuilder() {
    loadJSON(function(response) {
        // Parsing JSON string into object
        let markersjson = JSON.parse(response);
        
        let tree = document.createDocumentFragment();

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
}