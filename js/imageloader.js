var imagesHTML, numImages, topZ;
var path = "letters/";
var prevbtn = document.getElementById('prev');
var nextbtn = document.getElementById('next');
var closebtn = document.querySelector('.btn-close');
var lightbox = document.querySelector('.lightbox');

function preloadImage(url) {
    (new Image()).src=url;
}

function loadImages(element) {
    let divChild;
    imagesHTML = document.getElementsByClassName('lightbox-img');
    for (let i=imagesHTML.length-1; i>=0; i--) {
        imagesHTML[i].remove();
    }

    $('label').css({"visibility":"hidden"});
    $('.header').css({"visibility":"hidden"});
    $('.header-text').css({"visibility":"visible"});

    d3.json(
    'letters.json',
    async function (err, markersjson) {
        if (err) throw err;
        let letter = markersjson.filter(function(d){
            return d.id == element.id;
          });
        let imgs = letter[0].images;

        for (let i=0; i<imgs.length; i++) {
            preloadImage(path+imgs[i]);
        }

        let tree = document.createDocumentFragment();

        imgs.forEach(function (img) {
            divChild = document.createElement('img');
            divChild.setAttribute('class', 'lightbox-img');
            divChild.setAttribute('src',path+img);
            tree.appendChild(divChild);
        });

        lightbox.appendChild(tree);

        imagesHTML = document.getElementsByClassName('lightbox-img');
        numImages = imagesHTML.length;
        
        topZ = 2;
        currentImage = 0;

        for (let i=0; i<numImages; i++) {
            imagesHTML[i].style.opacity = 0;
        }

        imagesHTML[0].style.zIndex = topZ;
        imagesHTML[0].id = 'selected';


        if (numImages > 1) {
            prevbtn.style.display = 'unset';
            nextbtn.style.display = 'unset';
        }

        await transition(0.01,true,0);

        //Key listener

        window.onkeydown = function() {
            switch (window.event.key) {
                case "ArrowLeft":
                    if (numImages > 1) {
                        prevbtn.click();
                    }
                    break;
                case "ArrowRight":
                    if (numImages > 1) {
                        nextbtn.click();
                    }
                    break;
                case "Escape":
                    closebtn.click();
                    break;
            }
        };

        // Swipe listener

        var start = null;
        lightbox.addEventListener("touchstart",function(event){
            if(event.touches.length === 1 && numImages > 1){
                //just one finger touched
                start = event.touches.item(0).clientX;
            }else{
                //a second finger hit the screen, abort the touch
                start = null;
            }
        });

        lightbox.addEventListener("touchend",function(event){
            var offset = 100;//at least 100px are a swipe
            if(start){
                //the only finger that hit the screen left it
                var end = event.changedTouches.item(0).clientX;
                if(end > start + offset){
                    prevbtn.click();
                }
                if(end < start - offset ){
                    nextbtn.click();
                }
            }
        });


        return;
    });

    
}

function transition(speed,first,nextImage) { 
    return new Promise((resolve) => { 

        let del = speed;

        let id = setInterval(changeOpacity, 5); 

        function changeOpacity() {
            for (let i=0; i<numImages; i++) {
                if (i != nextImage) {
                    imagesHTML[i].style.opacity = Math.max(parseFloat(imagesHTML[i].style.opacity) - del,0);
                }
            }
            imagesHTML[nextImage].style.opacity = Math.min(parseFloat(imagesHTML[nextImage].style.opacity) + del,1);
            if (parseFloat(imagesHTML[nextImage].style.opacity) == 1) { 
                clearInterval(id);
                resolve(); 
            } 
        }
    });
}

// Function to transitions from one image to other 
async function changeImage(element,speed) { 

    if (numImages > 1 && parseFloat(imagesHTML[currentImage].style.opacity) == 1) {
        
        let nextImage;
        if (element.id == "next") {
        // Stores index of next image 
            nextImage = (currentImage + 1) % numImages;
        } else if (element.id == "prev") {
        // Stores index of prev image 
            nextImage = (currentImage + numImages - 1) % numImages;
        }

        imagesHTML[nextImage].style.zIndex = topZ;
        imagesHTML[currentImage].style.zIndex = topZ - 1;

        await transition(speed,false,nextImage); 

        $('.lightbox-img').removeAttr('id');
        imagesHTML[nextImage].id = "selected"
        imagesHTML[currentImage].style.zIndex = 'unset';

        currentImage = nextImage;
    }

    // }
    return
} 

function removeImages() {
    imagesHTML = document.getElementsByClassName('lightbox-img');
    for (let i=imagesHTML.length-1; i>=0; i--) {
        imagesHTML[i].remove();
    }
    prevbtn.style.display = 'none';
    nextbtn.style.display = 'none';

    $('.header').css({"visibility":"visible"});
    $('label').css({"visibility":"visible"});

    currentImage = null;

    return
}

$(document).ready(function () {  

    $(".letter-highlight").click(function(){
        window.location = $(this).find("a:first").attr("href");
        return false;
    });

    $(".letterbox").click(function(){
        window.location = $(this).find("a:first").attr("href");
        return false;
    });
});


