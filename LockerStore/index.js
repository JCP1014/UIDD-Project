$(() => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log(`SW is registered with scope: ${reg.scope}`)
            })
            .catch(err => {
                console.log('SW Error ', err)
            })
    }
})

var map, marker, autocomplete, lat, lng, addr;
var isLocate = false;
var styles = {
    default: null,
    hide: [ // Hide stores and bus stations in the map
        {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'transit.station.bus',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
        }
    ],
    hide_more: [ // Hide stores and bus stations in the map
        {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'poi.attraction',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'poi.place_of_worship',
            stylers: [{ visibility: 'off' }]
        },
    ]
};
function initMap() {
    lat = 22.9988146;
    lng = 120.2195148;
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 16,
        center: { lat: lat, lng: lng },
        styles: styles['hide_more'],
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
    });
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('addressBlank'));
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);
    autocomplete.addListener('place_changed', function () {
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
    });

}

/* Only locate once when click */
function locate_once() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        /************ Get location ************/
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            /************ Draw Map ************/
            map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 18,
                center: { lat: lat, lng: lng },
                styles: styles['hide'],
            });
            marker = new google.maps.Marker({
                map: map,
                position: { lat: lat, lng: lng },
                icon: {
                    url: './public/images/about_us/part5/part5-logo.svg',
                    scaledSize: new google.maps.Size(50, 50),
                },
                animation: google.maps.Animation.DROP,
            });
        }, function () {
            //alert('Error: The Geolocation service failed.');
            alt_locate();
        });
    } else { // Browser doesn't support Geolocation
        //alert('Error: Your browser doesn\'t support geolocation.');
        alt_locate();
    }
}

/* Alternative way of locating for http */
function alt_locate() {
    /************ Get location ************/
    xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA7WQssz_5EAQLX-Xc1HwuZ1p-wJV7ubwk",
        true
    );
    xhr.onload = function () {
        var response = JSON.parse(this.responseText);
        lat = response.location.lat;
        lng = response.location.lng;
        //console.log(lat + ' ' + lng);

        /************ Draw Map ************/
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 18,
            center: { lat: lat, lng: lng },
            styles: styles['hide'],
        });
        marker = new google.maps.Marker({
            map: map,
            position: { lat: lat, lng: lng },
            icon: {
                url: './public/images/about_us/part5/part5-logo.svg',
                scaledSize: new google.maps.Size(50, 50),
            },
            animation: google.maps.Animation.DROP,
        });
    };
    xhr.send();
}

/* Always relocate when changing position */
function locate_watch() {
    navigator.geolocation.watchPosition((position) => {
        if (!isLocate) {
            isLocate = true;
            console.log(position.coords);
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 18,
                center: { lat: lat, lng: lng }
            });
            marker = new google.maps.Marker({
                map: map,
                position: { lat: lat, lng: lng },
                icon: {
                    url: './public/images/about_us/part5/part5-logo.svg',
                    scaledSize: new google.maps.Size(50, 50),
                },
                animation: google.maps.Animation.DROP,
            });
            map.setOptions({ styles: styles['hide'] });
        }
    });
}

function codeAddress() {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': addr }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results[0].geometry.location)
            map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 18,
                center: results[0].geometry.location,
                styles: styles['hide'],
            });
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: {
                    url: './public/images/about_us/part5/part5-logo.svg',
                    scaledSize: new google.maps.Size(50, 50),
                },
                animation: google.maps.Animation.DROP,
            });
        } else {
            alert("Failed, reason: " + status);
        }
    })
}

$('#find_btn').click((event) => {
    if (!$('#addressBlank').val()) {
        event.preventDefault();
        alert("Please enter your delivery address");
    }
})
$(document).ready(function () {
    initMap();
});