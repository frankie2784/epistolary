var imagesHTML, imageshidden, numImages, topZ;
var borderThickness = Math.min(Math.min(window.innerHeight,window.innerWidth)*4.0/100,17);
var lastSet;
var path = "letters/";
var prevbtn = document.getElementById('prev');
var nextbtn = document.getElementById('next');
var closebtn = document.querySelector('.btn-close');
var lightbox = document.querySelector('.lightbox');

function preloadImage(url) {
    (new Image()).src=url;
}

function loadImages(element) {
    loadJSON(async function(response) {
        // Parsing JSON string into object
        let markersjson = JSON.parse(response);

        let divChild, hiddenChild;
        let imgs;
        let imgLeft, imgTop, imgWidth, imgHeight, maxScale, imgNaturalWidth, imgNaturalHeight;
        imagesHTML = document.getElementsByClassName('lightbox-img');
        imageshidden = document.getElementsByClassName('lightbox-img-hidden');
        for (let i=imagesHTML.length-1; i>=0; i--) {
            imagesHTML[i].remove();
            imageshidden[i].remove();
        }
    
        $('label').css({"visibility":"hidden"});
        $('.header').css({"visibility":"hidden"});
        $('.header-text').css({"visibility":"visible"});

        let letter = markersjson.filter(function(d){
            return d.id == element.id;
          });
        
        if (!isTouchDevice()) {
            imgs = letter[0].images;
        } else {
            imgs = letter[0].images_small;
        }

        for (let i=0; i<imgs.length; i++) {
            preloadImage(path+imgs[i]);
        }

        let tree = document.createDocumentFragment();

        imgs.forEach(function(img) {
            divChild = document.createElement('div');
            divChild.setAttribute('class', 'lightbox-img');
            divChild.setAttribute('style','background-image: url(../'+path+img+')');
            hiddenChild = document.createElement('img');
            hiddenChild.setAttribute('class', 'lightbox-img-hidden');
            hiddenChild.setAttribute('src',path+img);
            tree.appendChild(hiddenChild);
            tree.appendChild(divChild);
        });

        lightbox.appendChild(tree);

        if (!isTouchDevice()) {
            imagesHTML = document.getElementsByClassName('lightbox-img');
            imageshidden = document.getElementsByClassName('lightbox-img-hidden');
        } else {
            imagesHTML = document.getElementsByClassName('lightbox-img-hidden');
        }

        numImages = imagesHTML.length;

        topZ = 2;
        currentImage = 0;

        for (let i=0; i<numImages; i++) {
            imagesHTML[i].style.opacity = 0;
        }

        imagesHTML[0].style.zIndex = topZ;
        imagesHTML[0].id = 'selected';

        if (!isTouchDevice()) {
            imageshidden[0].id = 'selected';

            let referenceImage = $('.lightbox-img-hidden#selected');
            imgHeight = referenceImage.height();
            imgWidth = referenceImage.width();
            imgNaturalWidth = referenceImage.get(0).naturalWidth;
            imgNaturalHeight = referenceImage.get(0).naturalHeight;
            imgTop = referenceImage.offset()['top'] - borderThickness;
            imgLeft = referenceImage.offset()['left'] - borderThickness;
            maxScale = imgNaturalHeight / imgHeight;

            let selectedImage = $('.lightbox-img#selected');
            selectedImage.css({height:imgHeight,width:imgWidth,backgroundSize:imgWidth+"px "+imgHeight+"px"});

            selectedImage.mousemove(function(e) {
                if (maxScale > 1) {
                    $this = $(this);
                    Xpx = e.pageX - imgLeft - borderThickness;
                    Ypx = e.pageY - imgTop - borderThickness;
                    let X = 100*Xpx/$this.width();
                    let Y = 100*Ypx/$this.height();
                    if (X >= 0 && X <= 100 && Y >= 0 && Y <= 100) {
                        $this.css({backgroundSize:imgNaturalWidth+"px "+imgNaturalHeight+"px",backgroundPosition:X+"% "+Y+"%",transition:"background-size 0.6s"});
                    } else {
                        $this.css({backgroundSize:imgWidth+"px "+imgHeight+"px",transition:"background-size 0.6s"});
                    }
                }
            });

            selectedImage.mouseleave(function() {
                if (maxScale > 1) {
                    $(this).css({backgroundSize:imgWidth+"px "+imgHeight+"px",transition:"background-size 0.6s"});
                }
            });
        }

        if (numImages > 1) {
            prevbtn.style.display = 'unset';
            nextbtn.style.display = 'unset';
        }

        await transition(0.01,0);

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
        return;
    });
}

function transition(speed,nextImage) { 
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

        let imgLeft, imgTop, imgWidth, imgHeight, maxScale, imgNaturalWidth, imgNaturalHeight;
        
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

        if (!isTouchDevice()) {
            imagesHTML[nextImage].id = "transitioning";
            imageshidden[nextImage].id = "transitioning";

            transitioningImage = $('.lightbox-img-hidden#transitioning');
            imgHeight = transitioningImage.height();
            imgWidth = transitioningImage.width();
            imgNaturalWidth = transitioningImage.get(0).naturalWidth;
            imgNaturalHeight = transitioningImage.get(0).naturalHeight;
            imgTop = transitioningImage.offset()['top'] - borderThickness;
            imgLeft = transitioningImage.offset()['left'] - borderThickness;
            maxScale = imgNaturalHeight / imgHeight;

            $('.lightbox-img#transitioning').css({height:imgHeight,width:imgWidth,backgroundSize:imgWidth+"px "+imgHeight+"px"});
        }

        await transition(speed,nextImage); 

        $('.lightbox-img').removeAttr('id');
        imagesHTML[nextImage].id = "selected"
        imagesHTML[currentImage].style.zIndex = 'unset';

        if (!isTouchDevice()) {

            $('.lightbox-img-hidden').removeAttr('id');

            let selectedImage = $('.lightbox-img#selected');

            selectedImage.mousemove(function(e) {
                if (maxScale > 1) {
                    $this = $(this);
                    Xpx = e.pageX - imgLeft - borderThickness;
                    Ypx = e.pageY - imgTop - borderThickness;
                    let X = 100*Xpx/$this.width();
                    let Y = 100*Ypx/$this.height();
                    if (X >= 0 && X <= 100 && Y >= 0 && Y <= 100) {
                        $this.css({backgroundSize:imgNaturalWidth+"px "+imgNaturalHeight+"px",backgroundPosition:X+"% "+Y+"%",transition:"background-size 0.6s"});
                    } else {
                        $this.css({backgroundSize:imgWidth+"px "+imgHeight+"px",transition:"background-size 0.6s"});
                    }
                }
            });

            selectedImage.mouseleave(function() {
                if (maxScale > 1) {
                    $(this).css({backgroundSize:imgWidth+"px "+imgHeight+"px",transition:"background-size 0.6s"});
                }
            });
        }

        currentImage = nextImage;
    }

    // }
    return
} 

function removeImages() {
    imagesHTML = document.getElementsByClassName('lightbox-img');
    imageshidden = document.getElementsByClassName('lightbox-img-hidden');
    for (let i=imagesHTML.length-1; i>=0; i--) {
        imagesHTML[i].remove();
        imageshidden[i].remove();
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

function isTouchDevice() {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
  }