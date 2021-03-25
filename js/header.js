$("#header").load("header.html");
closeMenu();


function navbar() {
    let checkbox = document.querySelector('#nav-menu4');
    if (checkbox.checked) {
        $('.dropdown').removeClass('closed').addClass('open');
        $('#span1, #span2, #span3').css({backgroundColor: "#818181"});
    } else {
        $('.dropdown').removeClass('open').addClass('closed');
        $('#span1, #span2, #span3').css({backgroundColor: "var(--grey)"});
    }
}

function closeMenu() {
    $('#nav-menu4').prop('checked', false);
}