mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmtpZTI3ODQiLCJhIjoiY2tnbGdtZzd0MmY2djJ5bDdma3p3eWcxciJ9.nrsHiMn_MItCEKEc9di5cQ';

// Set bounds to Victoria
var bounds = [
[138.455243,-40.074262], // Southwest coordinates
[153.550458,-33.784141], // Northeast coordinates
];

var melb_bounds = [
  [144.879811,-37.839983],
  [145.047397,-37.770503],
]

var path = '../letters/';
var map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/frankie2784/cklqdpix464d317ollcx8bcgz', //Standard
center: [144.966267,-37.814889], // starting position
zoom: 10, // starting zoom
maxBounds: bounds
});

// var userCoords = null;

function randomInterval(min, max) { // min and max included 
  return Math.random() * (max - min) + min;
}

map.on('load', function () {
  $('.topsplit').get(0).scrollIntoView();
  $(".letters-map").css({visibility:"visible"});
  $(".loadingpage").remove();

  map.scrollZoom.setWheelZoomRate(0.02); // Default 1/450
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
});

// Add geolocate control to the map.
// var geolocate = new mapboxgl.GeolocateControl({
//   positionOptions: {
//     enableHighAccuracy: true
//     },
//     trackUserLocation: true
//   });

// map.addControl(geolocate);
// geolocate.on("geolocate", locateUser);

// function locateUser(e) {
//   userCoords = new mapboxgl.LngLat(e.coords.longitude, e.coords.latitude);;
// }

d3.json(
'letters.json',
function (err, markersjson) {
if (err) throw err;

  markersjson.forEach(function (marker) {
  // create a DOM element for the marker

    let el = document.createElement('div');
    el.className = 'marker';
    el.id = marker.id;
    el.style.backgroundImage =
    'url(img/heart_pink_map.png)';
    el.style.backgroundSize =
    'cover';
    el.style.width = '51px';
    el.style.height = '48px';

    let coords = marker.coordinates;

    // add marker to map
    let new_marker = new mapboxgl.Marker(el, {
      offset: [0, -29]
    })
    .setLngLat(coords)
    .addTo(map);

    $(document).ready(function() {

      // let _watch = null;
      // let intervalId = setInterval(function() {
      //     if ( _watch !== userCoords ) {
      //         _watch = userCoords;
      //         let distanceText;
      //         if (userCoords) {
      //           let markerCoords = new mapboxgl.LngLat(coords[0],coords[1]);
      //           let dist = userCoords.distanceTo(markerCoords);
      //           if (dist > 1000) {
      //             distanceText = (dist / 1000).toFixed(1)+'km';
      //           } else {
      //             distanceText = ((dist / 10).toFixed(0) * 10)+'m'
      //           }
      //         } else {
      //           distanceText = "";
      //         }

      //         $.fn.displayDistance = function() { 
      //           return $(this).text(distanceText);
      //         }
        
      //         $('.letterbox .distance#'+marker.id).displayDistance();

      //         clearInterval(intervalId);
      //     }
      // }, 1000);

      $(el).hover(function(event) {
        event.preventDefault();

        // let distanceText;
        // if (userCoords) {
        //   let markerCoords = new mapboxgl.LngLat(coords[0],coords[1]);
        //   let dist = userCoords.distanceTo(markerCoords);
        //   if (dist > 1000) {
        //     distanceText = (dist / 1000).toFixed(1)+'km';
        //   } else {
        //     distanceText = ((dist / 10).toFixed(0) * 10)+'m'
        //   }
        // } else {
        //   distanceText = "";
        // }

        $(el).append('<a class="heart-highlight" id="'+marker.id+'" href="#lightbox" onClick="return loadImages(this)"></a>');
        let pixels = map.project(coords);
        $('#letter-text-title').text(marker.title);
        $('#letter-text-from').text(marker.from);
        $('.letter-image').css({"background-image":'url('+path+marker.images[0]+')','transform':'blur(2px)'});
        $('.marker').css({"background-image":'url(img/heart_pink_map.png)',"z-index":"unset"});
        $(el).css({'background-image':'url(img/heart_blue_map.png)',"z-index":"1"});

        $('.letter-highlight').css("display", "flex").hide().fadeIn(200);
        positionHighlight(coords);

        map.on('move', function() {
          positionHighlight(coords);
        });

      }, function() {
        $('.letter-highlight').hide();
        $(".heart-highlight").remove();
        $(el).css({"background-image":"url(img/heart_pink_map.png)", "z-index":"unset"});
      });


      $(window).on('touchend',function(event) {
        if ($(event.target).closest(el).length) {
          event.preventDefault();

          // let distanceText;
          // if (userCoords) {
          //   let markerCoords = new mapboxgl.LngLat(coords[0],coords[1]);
          //   let dist = userCoords.distanceTo(markerCoords);
          //   if (dist > 1000) {
          //     distanceText = (dist / 1000).toFixed(1)+'km';
          //   } else {
          //     distanceText = ((dist / 10).toFixed(0) * 10)+'m'
          //   }
          // } else {
          //   distanceText = "";
          // }
          
          $('.letter-highlight').css("display", "flex").hide().fadeIn(200);
          positionHighlight(coords);
          $('.letter-highlight').attr("id", marker.id);
          $('.divLink-highlight').attr("id", marker.id);
          $('#letter-text-title').text(marker.title);
          $('#letter-text-from').text(marker.from);
          $('.letter-image').css({'background-image':'url(../letters/'+marker.images[0]+')'});
          $('.marker').css({"background-image":'url(img/heart_pink_map.png)',"z-index":"unset"});
          $(el).css({'background-image':'url(img/heart_blue_map.png)',"z-index":"1"});

          window.addEventListener('resize', function () {
            positionHighlight(coords);
          });

          map.on('move', function() {
            positionHighlight(coords);
          });

        } else if (!$(event.target).closest('.divLink-highlight').length && !$(event.target).closest('.marker').length) {
          $('.letter-highlight#'+marker.id).hide();
          $('.divLink-highlight').removeAttr("id");
          $(el).css({"background-image":"url(img/heart_pink_map.png)", "z-index":"unset"});
        }
      });

      $(".divLink").hover(function(event) {
        event.preventDefault();

        if (this.id == el.id && window.innerWidth > window.innerHeight) {
          $(el).css({"background-image":"url(img/heart_blue_map.png)", "z-index":"1"});}}, function() {
        if (this.id == el.id && window.innerWidth > window.innerHeight) {
          $(el).css({"background-image":"url(img/heart_pink_map.png)", "z-index":"unset"});}
      });
    });
  });
});

function closePopup() {
  $('.popup-close').css({backgroundColor: '#d3e0e9', boxShadow: '0px 0px 0px var(--grey)'})
  setTimeout(function() {
    $('.letters-landing').hide();
  }, 500);
}

function positionHighlight(coords) {
  let pixels = map.project(coords);
  if (window.innerWidth > window.innerHeight || window.innerWidth >= 769) {
    $('.letter-highlight').css({"transition":"unset","top":pixels['y'].toString()+'px',"left":pixels['x'].toString()+"px"});
  } else {
    $('.letter-highlight').css({"top":"unset","left":"unset"});
  }
}