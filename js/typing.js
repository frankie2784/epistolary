const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");
const scrolldown = document.querySelector(".scrolldown");
typedTextSpan.setAttribute('style', 'white-space: pre-wrap;');

const textArray = [
    ["Dear reader,",
        "\r\n\r\n",
        "It’s so good to see you here.",
        " I’ve missed you.",
        " The past year has been difficult while we’ve been apart.",
        " I’d like for us to properly get to know each other again.",
        "\r\n\r\n",
        "Will you write me a letter?",
        "\r\n\r\n",
        "Your city",
        "\r\n",
        "xx"
    ],
    ["Dear reader,",
        "\r\n \r\n",
        "I’ve thought a lot about what I want to share with you and it’s this:",
        " don’t take this place for granted.",
        " It’s only here for a short time.",
        " The future could be very different.",
        "\r\n \r\n",
        "Won’t you write a letter about why you love me at this moment, for the epistolary?",
        "\r\n \r\n",
        "Your city",
        " \r\n",
        "xx"
    ],
    ["Dear reader,",
        "\r\n \r\n",
        "Welcome to Epistolary!",
        " I’ve been looking forward to this for a while now.",
        " I finally have a place to gather letters from my admirers.",
        "\r\n \r\n",
        "Will you add a letter to the collection?",
        " I’d love to revisit the good times we’ve had together.",
        "\r\n \r\n",
        "Your city",
        " \r\n",
        "xx"
    ],
    ["Dear reader,",
        "\r\n \r\n",
        "It’s so nice to see you again.",
        " Do you remember last time we met?",
        " I was thinking about how the future could be quite different.",
        "\r\n \r\n",
        "What do you think lies ahead for us?",
        " I’d love it if you would share your thoughts with me in the epistolary.",
        " I’d like to read one of your letters.",
        "\r\n \r\n",
        "Your city",
        " \r\n",
        "xx"
    ],
];
const typingDelay = 35;
const erasingDelay = 100;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;
let randNum = Math.floor((Math.random() * textArray.length));
const randLetter = textArray[randNum];
const randLetterText = randLetter.join('').replace(/(\r\n)/g,'<br>');
const randLetterWords = randLetter.join('').replace(/(\r\n)/g,'').replace(/  /g,' ').split(' ');
let wordIndex = 0;
$('.hidden-text').html(randLetterText);
function type() {
    if (charIndex < randLetter[textArrayIndex].length) {
        typedTextSpan.textContent += randLetter[textArrayIndex].charAt(charIndex);
        if (randLetter[textArrayIndex].charAt(charIndex) == ' ') {
            wordIndex++
            let wordWidth = $('.typed-text').widthOfTextInElement(randLetterWords[wordIndex]);
            let spaceLeft = $('.displayed-text').width()+$('.displayed-text').offset()['left'] - $('.cursor').offset()['left'];
            if (wordWidth > spaceLeft) {
                typedTextSpan.textContent += "\r\n";
            }
        }
        charIndex++;
        setTimeout(type, typingDelay);
    } else if (textArrayIndex < randLetter.length - 1) {
        textArrayIndex++;
        charIndex = 0;
        setTimeout(type, typingDelay + 500);
    } else {
        setTimeout(function() {
            $('.elements, .typed-text').addClass('transition');
            $('.elements').addClass('first');
            $('.cursor').css({opacity: 0});
            $('.elements#riverbuilding').on('transitionend', function() {
                setTimeout(function() {
                    $('.elements').addClass('second');
                    $('.skipintro').css({opacity: 0,transition:'opacity 1.5s'});
                    $('.epistolary-title').addClass('transition').on('transitionend', function() {
                        $('.epistolary-title').css({zIndex: 1});
                    });
                }, 100);
            });
        }, 1500);
    }
}

document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect;
    $('.displayed-text').css($('.hidden-text').offset());
    $('.cursor').css({opacity: 1});
    $('.skipintro').css({opacity: 1,transition:'opacity 1.5s 3s'});
    if (randLetter.length) setTimeout(type, newTextDelay + 250);
});

$.fn.widthOfTextInElement = function (text) {
    if (!$.fn.widthOfTextInElement.fakeEl) $.fn.widthOfTextInElement.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.widthOfTextInElement.fakeEl.text(text).css('font', $(this).css("font"));
    return $.fn.widthOfTextInElement.fakeEl.width();
}

// $(document).scroll(function() {
//     console.log(window.pageYOffset / (document.body.offsetHeight - window.innerHeight))
//     document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
// })