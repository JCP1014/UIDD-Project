$(document).ready(function () {
    initMap();
    $('.toast').toast('show');
    $('[data-toggle="popover"]').popover();
    //$('#infoBox').hide();
    //$('.sorterBox_after').hide();
    //$('#clear_btn').hide();
    $('.sorter img:nth-child(' + sorter_state + ')').addClass('disabled');
    $('#sorter_left').attr('src', './public/images/a2改/enabled_' + sorter_state + '.svg');
    $('#usedSorter').attr('src', './public/images/a2改/enabled_' + sorter_state + '.svg');
    //$('#save_btn').hide();
    //$('#cancel_btn').hide();
    //$('#shop_card').hide();
    //$('#shopTab_group').hide();
    //$('#shareBox').hide();
    $('#type_result').hide();
});
const english = /^[A-Za-z0-9]*$/;
var map, marker, lat, lng;
var autocomplte, autocompleteLsr;
var pos_marker = './public/images/a1/a1-08.svg';
var locker_marker = './public/images/a1/a1-31前.svg'
var isLocate = false;
var sorter_state = 1;
var card_state = 0; // 1:result_card, 2:explore_card, 3:shop_card
var input_state = 1; // 1:search, 2:set home, 3:set work
var shopTab_state = 1; // 1: single, 2:group
var checkNum = 0;
var page = 1;
var max_page = 1;
var otherExpand = false;
var latlng_list = [];
var minLat, maxLat, minLng, maxLng;
var result = 0;
var pageItems = 6;
var isSelectLocker = false;
var isOut_result = false;
var isOut_shop = false;
var isDown_result = false;
var isDown_shop = false;
var press_y = 0
var stationID;
var stationName;
var stationAddr;
var storeID;
var storeName;
var storeAddr;
var storeTel;
var storeImg;
var singleItemNum;
var orderNum = 0;
var itemName = []
var itemAmount = []
var itemPrice = []
var itemImg = []
var peopleNum = 0;
var targetNum = 0;
var typingTimer;                //timer identifier
var doneTypingInterval = 400;
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
    ]
};
function initMap() {
    document.getElementById('map-canvas').style.opacity = '0';
    var urlParams = new URLSearchParams(window.location.search);
    var isAuto = urlParams.get('locate_btn.x');
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
    if (isAuto) {
        locate_once();
        document.getElementById('map-canvas').style.opacity = '1';
    }
    else {
        var addr = urlParams.get('address');
        codeAddress(addr);
        document.getElementById('map-canvas').style.opacity = '1';
    }
    addAutocomplete();
}

function addAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('keywordBlank'));
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);
    autocompleteLsr = autocomplete.addListener('place_changed', function () {
        // var place = autocomplete.getPlace();
        // if (!place.geometry) {
        //     // User entered the name of a Place that was not suggested and
        //     // pressed the Enter key, or the Place Details request failed.
        //     window.alert("No details available for input: '" + place.name + "'");
        //     return;
        // }
    });

}
function removeAutocomplete() {
    google.maps.event.removeListener(autocompleteLsr);
    google.maps.event.clearInstanceListeners(autocomplete);
    $(".pac-container").remove();
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
                zoom: 16,
                center: { lat: lat, lng: lng },
                styles: styles['hide'],
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                zoomControl: false,
            });
            createMarker(pos_marker, { lat: lat, lng: lng }, true);
            getLockerPos({ lat: lat, lng: lng }, '7-11');
        }, function () {
            alert('Error: The Geolocation service failed.');
            alt_locate();
        });
    } else { // Browser doesn't support Geolocation
        alert('Error: Your browser doesn\'t support geolocation.');
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
            zoom: 16,
            center: { lat: lat, lng: lng },
            styles: styles['hide'],
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: false,
        });
        createMarker(pos_marker, { lat: lat, lng: lng }, true);
        getLockerPos({ lat: lat, lng: lng }, '7-11');
    };
    xhr.send();
}

/* Always relocate when changing position */
function locate_watch() {
    navigator.geolocation.watchPosition((position) => {
        if (!isLocate) {
            isLocate = true;
            //console.log(position.coords);
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 16,
                center: { lat: lat, lng: lng },
                styles: styles['hide'],
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                zoomControl: false,
            });
            createMarker(pos_marker, { lat: lat, lng: lng }, true);
            getLockerPos({ lat: lat, lng: lng }, '7-11');
        }
    });
}
function createMarker(marker_url, location, isDrop) {
    var marker;
    marker = new google.maps.Marker({
        map: map,
        position: location,
        icon: {
            url: marker_url,
            scaledSize: new google.maps.Size(60, 60),
        },
    });
    if (isDrop) {
        marker.setAnimation(google.maps.Animation.DROP);
    }
    marker.addListener('click', function () {
        //map.setZoom(8);
        //map.setCenter(marker.getPosition());
        $.get('/searchLocker', {
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng(),
        }, (data) => {
            $('#info_t1').html(data.name + '站');
            $('#info_t2').html(data.addr);
            stationName = data.name;
            stationAddr = data.addr;
        })
        // $('#shareBox').hide();
        $('#infoBox').show();
        isSelectLocker = false;
        // $('#goto').attr('src', 'public/images/a1/a1-16前.svg')
    });
}

function codeAddress(address) {
    var request = {
        query: address,
        fields: ['name', 'geometry', 'formatted_address'],
    };
    var service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 16,
                center: results[0].geometry.location,
                styles: styles['hide'],
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                zoomControl: false,
            });
            createMarker(pos_marker, results[0].geometry.location, true);
            getLockerPos(results[0].geometry.location, '7-11');
        } else {
            alert("Failed, reason: " + status);
        }
    });
    // geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ 'address': address }, function (results, status) {
    //     if (status == google.maps.GeocoderStatus.OK) {
    //         map = new google.maps.Map(document.getElementById('map-canvas'), {
    //             zoom: 18,
    //             center: results[0].geometry.location,
    //             styles: styles['hide'],
    //             mapTypeControl: false,
    //             fullscreenControl: false,
    //             streetViewControl: false,
    //             zoomControl: false,
    //         });
    //         var marker = new google.maps.Marker({
    //             map: map,
    //             position: results[0].geometry.location,
    //             icon: {
    //                 url: pos_marker,
    //                 scaledSize: new google.maps.Size(60, 60),
    //             },
    //             animation: google.maps.Animation.DROP,
    //         });
    //     } else {
    //         alert("Failed, reason: " + status);
    //     }
    // })
}

function getLockerPos(center, query) {
    var service = new google.maps.places.PlacesService(map);
    // Perform a nearby search.
    service.nearbySearch(
        { location: center, keyword: query, rankBy: google.maps.places.RankBy.DISTANCE },
        function (results, status, pagination) {
            if (status !== 'OK') {
                alert("Failed, reason: " + status);
                return;
            }
            for (var i = 0; i < results.length; i++) {
                var tmp = results[i].name;
                var start = tmp.indexOf(' ');
                var end = tmp.indexOf('門市');
                var lockerName = tmp.slice(start + 1, end);
                tmp = results[i].plus_code.compound_code;
                end = tmp.lastIndexOf('市');
                if (end > -1) {
                    var county = tmp.slice(end - 2, end + 1);
                }
                else {
                    end = tmp.lastIndexOf('縣');
                    var county = tmp.slice(end - 2, end + 1);
                }
                var address = county + results[i].vicinity;
                //console.log(lockerName + '站');
                //console.log(address);
                createMarker(locker_marker, results[i].geometry.location, false);
                latlng_list.push({ lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng() });
                $.get('/insertLocker', {
                    lat: results[i].geometry.location.lat(),
                    lng: results[i].geometry.location.lng(),
                    name: lockerName,
                    addr: address,
                }, (data) => {
                    //console.log(data)
                })
            }
            if (pagination.hasNextPage) {
                sleep: 2;
                pagination.nextPage();
            }
            minLat = Math.min.apply(Math, latlng_list.map(function (o) { return o.lat; }));
            maxLat = Math.max.apply(Math, latlng_list.map(function (o) { return o.lat; }));
            minLng = Math.min.apply(Math, latlng_list.map(function (o) { return o.lng; }));
            maxLng = Math.max.apply(Math, latlng_list.map(function (o) { return o.lng; }));
        });
}
function getSearchResult(keywords) {
    // console.log(minLat + ' ' + maxLat + ' ' + minLng + ' ' + maxLng)
    var sorter;
    // console.log('sorter=' + sorter_state)
    switch (sorter_state) {
        case 1:
            {
                sorter = 'starNum';
                break;
            }
        case 2:
            {
                sorter = 'like';
                break;
            }
        case 3:
            {
                sorter = 'priceNum';
                break;
            }
        case 4:
            {
                sorter = 'isGroup'
                break;
            }
        default:
            {
                sorter = 'starNum'
                break;
            }
    }
    $.get('/searchTag', {
        keywords: keywords,
        minLat: minLat,
        maxLat: maxLat,
        minLng: minLng,
        maxLng: maxLng,
        sorter: sorter,
    }, (data) => {
        if (data.results.length < 1) {
            alert("No result");
            $('#result_list').hide();

        }
        else {
            $('#result_list').show();
            $('.result_container').not(':first').remove();
            for (var i = 0; i < data.results.length; i++) {
                if (i) {
                    $('.result_container').eq(i - 1).clone('withDataAndEvents').appendTo($('#result_list'));
                }
                else {
                    $('.result_container').eq(0).css('display', 'block');
                }
                $('.result_container').eq(i).find('p.result_name').text(data.results[i].name);
                $('.result_container').eq(i).find('div.result_tag').text(data.results[i].tag);
                for (var j = 0; j < 5; j++) {
                    if (j < Math.trunc(data.results[i].starNum))
                        $('.result_container').eq(i).find('img.star').eq(j).attr('src', './public/images/a2/a2-14.svg');
                    else
                        $('.result_container').eq(i).find('img.star').eq(j).attr('src', './public/images/a2/a2-15.svg');
                }
                for (var j = 0; j < 3; j++) {
                    if (j < Math.trunc(data.results[i].priceNum))
                        $('.result_container').eq(i).find('img.money').eq(j).attr('src', './public/images/a2/a2-36.svg');
                    else
                        $('.result_container').eq(i).find('img.money').eq(j).attr('src', './public/images/a2/a2-32.svg');
                }
                // $('.result_container').eq(i).find('div.tag').text(data.results[i].tag);
                $('.result_container').eq(i).find('img.result_pic').attr('src', data.results[i].img + '?width=180&height=180');
                // if (i > 5) {
                //     $('.result_container').eq(i).hide();
                // }
            }
        }
    })
}

function getShopInfo(name) {
    $.get('/searchShop', {
        name: name,
    }, (data) => {
        $('#shopRect_top img.shopImg').attr('src', data.img + '?width=180&height=180');
        $('#shopName').val(data.name);
        $('#shopRect_top span.shopAddr_txt').text(data.addr);
        $('#shopRect_top span.shopTime_txt').text(data.openTime);
        for (var j = 0; j < 5; j++) {
            if (j < Math.trunc(data.starNum)) {
                // $('#shopRect_top div.starBar :nth-child(' + j + ')').attr('src', './public/images/b1/開始使用部分切圖用-65.svg');
                $('#shopRect_top img.star').eq(j).attr('src', './public/images/b1/開始使用部分切圖用-65.svg');
            }
            else {
                $('#shopRect_top img.star').eq(j).attr('src', './public/images/b1/開始使用部分切圖用-66.svg');
            }
        }
        for (var j = 0; j < 3; j++) {
            if (j < Math.trunc(data.priceNum)) {
                $('#shopRect_top img.money').eq(j).attr('src', './public/images/b1/開始使用部分-32.svg');
            }
            else {
                $('#shopRect_top img.money').eq(j).attr('src', './public/images/b1/開始使用部分-27.svg');
            }
        }
        $('#shopRect_top div.shopType').text(data.shopType);
        $('#shop_card').show()
        $('#nameBox').show();
        getShopItem_single(data.id);
        // getShopItem_group(data.id);
        storeName = data.name;
        storeAddr = data.addr;
        storeID = data._id;
        storeImg = data.img;
    })
}

function getShopItem_single(id) {
    $.get('/getItem_single', {
        id: id,
    }, (data) => {
        data.results.items = data.results.items.filter(function (obj) {
            return obj.price !== 0;
        });
        data.results.items.sort((a, b) => b.img.length - a.img.length);
        for (var i = 0; i < data.results.items.length; i++) {

            if (i) {
                $('#singleItemList div.shopItem').eq(i - 1).clone('withDataAndEvents').appendTo($('#singleItemList'));
            }
            else {
                $('#singleItemList div.shopItem').eq(0).css('display', 'block');
            }
            $('#singleItemList div.shopItem_name').eq(i).text(data.results.items[i].name);
            $('#singleItemList span.shopItem_intro').eq(i).text(data.results.items[i].introduce);
            $('#singleItemList div.shopItem_price').eq(i).text('$ ' + data.results.items[i].price);
            if (data.results.items[i].img) {
                $('#singleItemList img.shopItem_img').eq(i).attr('src', data.results.items[i].img);
            }
            else {
                $('#singleItemList img.shopItem_img').eq(i).removeAttr('src').replaceWith($('#singleItemList img.shopItem_img').eq(i).clone());
            }
        }
        for (var i = 0; i < data.results.items.length; i += 2) {
            if (i) {
                if (data.results.items[i].img.length > 1) {
                    $('#groupItemList div.shopItem').eq(i / 2 - 1).clone('withDataAndEvents').appendTo($('#groupItemList'));
                }
                else {
                    break;
                }
                $('#groupItemList div.shopItem_name').eq(i / 2).text(data.results.items[i].name);
                $('#groupItemList span.shopItem_intro').eq(i / 2).text(data.results.items[i].introduce);
                $('#groupItemList div.shopItem_price').eq(i / 2).text('$ ' + data.results.items[i].price);
                if (data.results.items[i].img) {
                    $('#groupItemList img.shopItem_img').eq(i / 2).attr('src', data.results.items[i].img);
                }
                else {
                    $('#groupItemList img.shopItem_img').eq(i / 2).removeAttr('src').replaceWith($('#groupItemList img.shopItem_img').eq(i / 2).clone());
                }
            }
            else {
                if (data.results.items[i].img.length > 1) {
                    $('#groupItemList div.shopItem').eq(0).css('display', 'block');
                }
                else {
                    break;
                }
                $('#groupItemList div.shopItem_name').eq(i).text(data.results.items[i].name);
                $('#groupItemList span.shopItem_intro').eq(i).text(data.results.items[i].introduce);
                $('#groupItemList div.shopItem_price').eq(i).text('$ ' + data.results.items[i].price);
                if (data.results.items[i].img) {
                    $('#groupItemList img.shopItem_img').eq(i).attr('src', data.results.items[i].img);
                }
                else {
                    $('#groupItemList img.shopItem_img').eq(i).removeAttr('src').replaceWith($('#groupItemList img.shopItem_img').eq(i).clone());
                }
            }

        }
    })
}
function getShopItem_group(id) {
    $.get('/getItem_group', {
        id: id,
    }, (data) => {
        data.results.items = data.results.items.filter(function (obj) {
            return obj.price !== 0;
        });
        data.results.items.sort((a, b) => b.img.length - a.img.length);
        for (var i = 0; i < data.results.items.length; i++) {
            if (i) {
                $('#groupItemList div.shopItem').eq(i - 1).clone('withDataAndEvents').appendTo($('#groupItemList'));
                $('#groupItemList div.optionContent').eq(i - 1).clone('withDataAndEvents').appendTo($('#groupItemList'));
            }
            else {
                $('#groupItemList div.shopItem').eq(0).css('display', 'block');
            }
            $('#groupItemList div.shopItem_name').eq(i).text(data.results.items[i].name);
            $('#groupItemList span.shopItem_intro').eq(i).text(data.results.items[i].introduce);
            $('#groupItemList div.shopItem_price').eq(i).text('$ ' + data.results.items[i].price);
            $('#groupItemList p.groupAmount_bottom').eq(i).text(data.results.items[i].groupAmount);
            if (data.results.items[i].img) {
                $('#groupItemList img.shopItem_img').eq(i).attr('src', data.results.items[i].img);
            }
            else {
                $('#groupItemList img.shopItem_img').eq(i).removeAttr('src').replaceWith($('#groupItemList img.shopItem_img').eq(i).clone());
            }
        }
    })
}

function zoomIn() {
    map.setZoom(map.getZoom() + 1)
}
function zoomOut() {
    map.setZoom(map.getZoom() - 1)
}
function changeSorter(orig, choose) {
    sorter_state = choose;
    getSearchResult($('#keywordBlank').val());
    $('.sorter img:nth-child(' + orig + ')').removeClass('disabled');
    $('.sorter img:nth-child(' + choose + ')').addClass('disabled');
    $('.sorter img:nth-child(' + orig + ')').attr('src', './public/images/a2改/enabled_' + orig + '.svg');
    $('.sorter img:nth-child(' + choose + ')').attr('src', './public/images/a2改/disabled_' + choose + '.svg');
    $('#sorter_left').attr('src', './public/images/a2改/enabled_' + choose + '.svg');
    $('#usedSorter').attr('src', './public/images/a2改/enabled_' + choose + '.svg');
    if (choose == 3) {
        $('#sorter_left').css('left', '4.1vmin');
        $('#usedSorter').css('left', '4.1vmin');
    }
    else {
        $('#sorter_left').css('left', '3vmin');
        $('#usedSorter').css('left', '3vmin');
    }

}
function clear_result_card() {
    $('#dropDown_btn').attr('src', './public/images/a1/a1-06.svg');
    $('#dropDown_btn').removeClass('backBtn');
    $('#dropDown_btn').addClass('dropIcon');
    if (card_state != 2) {
        $('#dropDown_btn').show();
        $('#dropDown_txt').show();
    }
    else {
        $('#dropDown_btn').hide();
        $('#dropDown_txt').hide();
    }
    $('.onMap_rise').animate({ top: '100%' }, 200);
    $('.onMap_rise').hide();
    $('.sorterBox_before').hide();
    // $('#search_btn').attr("src", "./public/images/a1/a1-02.svg");
    // $('#keywordBlank').css('border-color', '#2C50A1');
    $('#menu_btn').removeClass('logoIcon');
    $('#menu_btn').attr("src", "./public/images/a1/a1-04.svg");
    $('#menu_btn').addClass('menuIcon');
    $('#shop_card').hide();
    $('.onMap_shop').css('z-index', '-1');
    $('#keywordBlank').attr('size', "20");
    $('#keywordBlank').val('');
    $('#relatedTag').html('');
    // card_state = 1;
}
//user is "finished typing," do something
function doneTyping() {
    var str = $('#keywordBlank').val();
    if (str.length > 2) {
        // console.log('request')
        var request = str.split("# ").pop().trim();
        if (request.length > 0) {
            $.get('/getRelatedTag', {
                keyword: request,
            }, (data) => {
                var tmp = ""
                for (var i = 0; i < data.length; ++i) {
                    tmp = tmp + "&nbsp#&nbsp" + data[i];
                }
                $('#relatedTag').html(tmp)
            })
        }
    }
    else {
        $('#relatedTag').html('')
    }
}
function copyLink() {
    var dummy = document.createElement('input'),
        text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    alert("The link is copied");
    document.body.removeChild(dummy);
}
function timeChange() {
    $('#raise_btn').attr("src", "public/images/b2/團購-22.svg");
    $('#raise_btn').removeClass('disabled')
    $('#shareBox').show();
}
// $('#infoBox_close').click(function () {
//     $('#infoBox').hide();
// });
// $('#search_btn').click(function () {
//     console.log('card_state=' + card_state);
//     if ($('#keywordBlank').val().length < 3) {
//         event.preventDefault();
//         alert("Please enter what you want to search");
//         return;
//     }
//     if (card_state == 3) {
//         $('#shop_card').hide();
//         $('#result_card').show();
//         $('#dropDown_btn').hide();
//     }
//     else {
//         getSearchResult($('#keywordBlank').val());
//         $('#explore_card').collapse('hide');
//         $('#dropDown_btn').hide();
//         $('#dropDown_txt').hide();
//         $('#result_card').animate({ left: '0' }, 200);
//         setTimeout(function () {
//             $('#searchBox').css('visibility', 'visible')
//         }, 120);
//         $('.sorterBox_before').show();
//         // $('#search_btn').attr("src", "./public/images/a2/a2-05.svg");
//         $('#keywordBlank').css('border-color', '#ed9714');
//         if (isSelectLocker) {
//             $('#menu_btn').removeClass('menuIcon');
//             $('#menu_btn').attr("src", "./public/images/a2/a2-07.svg");
//             $('#menu_btn').addClass('logoIcon');
//         }
//         // $('#explore_card').css('top', '-100%');
//     }
//     card_state = 1;
// });
// document.getElementById('keywordBlank').addEventListener ("load", function () {
//                 var input = document.getElementsByTagName ("input");

//                 input[0].addEventListener ("keydown", function () {
//                     alert ("Caret position: " + this.selectionStart);

//                     // You can also set the caret: this.selectionStart = 2;
//                 });
//        h     });
$("#keywordBlank").focus(function () {
    console.log(input_state);
    if (input_state == 1) {
        removeAutocomplete();
        $('#photo_btn').hide();
        $('#clear_btn').show();
        if (!$(this).val()) {
            $(this).val('# ');
        }
    }
    else {
        addAutocomplete();
    }
});

$('#keywordBlank').keyup(function (e) {
    if (input_state == 1) {
        $(this).attr('size', $(this).val().length + 1);
        var start_x = $(this).position().left + $(this).width()
        if (start_x + $('#relatedTag').width() >= $('#clear_btn').position().left) {
            $('#relatedTag').css("top", "50%");
            $('#relatedTag').css("left", "15.2vmin");
        }
        else {
            $('#relatedTag').css("left", start_x);
            $('#relatedTag').css("top", "0.1rem");
        }
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
        if (e.keyCode == 13) { // user has pressed enter
            // console.log('card_state=' + card_state);
            if ($('#keywordBlank').val().length < 3) {
                event.preventDefault();
                alert("Please enter what you want to search");
                return;
            }
            if (card_state == 3) {
                $('#shop_card').hide();
                $('.onMap_shop').css('z-index', '-1');
                $('.onMap_rise').show();
                $('.sorterBox_before').show();
                $('#dropDown_btn').hide();
            }
            else {
                getSearchResult($('#keywordBlank').val());
                $('#result_list').hide();
                $('#explore_card').collapse('hide');
                $('#dropDown_btn').hide();
                $('#dropDown_txt').hide();
                $('.onMap_rise').show();
                $('.onMap_rise').animate({ top: '36.9vmin' }, 200);
                setTimeout(function () {
                    $('#searchBox').css('visibility', 'visible')
                }, 120);
                $('.sorterBox_before').show();
                if (isSelectLocker) {
                    $('#menu_btn').removeClass('menuIcon');
                    $('#menu_btn').attr("src", "./public/images/a2/a2-07.svg");
                    $('#menu_btn').addClass('logoIcon');
                }
            }
            card_state = 1;
        }

        if ($(this).val()) {
            $('#photo_btn').hide();
            $('#clear_btn').show();
            if ($(this).val().charAt(0) !== '#') {
                $(this).val('# ' + $(this).val());
            }
        }
        else {
            $('#clear_btn').hide();
            $('#photo_btn').show();
            clear_result_card();
        }
    }
    else if (input_state == 2 || input_state == 3) {
        if (e.keyCode == 13) { // user has pressed enter
            codeAddress($('#keywordBlank').val());
            $('#keywordBlank').attr('placeholder', '# 今天你想要來點什麼 :)');
            $('#keywordBlank').removeClass('grayHint');
            $('#menu_btn').attr('src', './public/images/a1/a1-04.svg');
            $('#menu_btn').addClass('menuIcon');
            $('#menu_btn').removeClass('locationIcon');
            // $('#search_btn').show();
            $('#photo_btn').hide();
            $('#clear_btn').show();
            $('#dropDown_btn').attr('src', './public/images/a1/a1-06.svg');
            $('#dropDown_btn').show();
            $('#dropDown_btn').addClass('dropIcon');
            $('#dropDown_btn').removeClass('homeIcon');
            $('#save_btn').hide();
            $('#cancel_btn').hide();
            if (input_state == 2) {
                $('#home').attr('src', './public/images/a3/a3-12.svg');
                $('#homeAddr').text($('#keywordBlank').val());
                $('#homeAddr').addClass('dark');
            }
            else if (input_state == 3) {
                $('#work').attr('src', './public/images/a3/a3-07.svg');
                $('#workAddr').text($('#keywordBlank').val());
                $('#workAddr').addClass('dark');
            }
            $('#keywordBlank').val('');
            input_state = 1;
        }
    }
});

$('#keywordBlank').on('keydown', function () {
    clearTimeout(typingTimer);
});

$('#more_btn').click(function () {
    $('.sorterBox_before').hide();
    $('.sorterBox_after').show();
});
$('.sorter').children().click(function () {
    changeSorter(sorter_state, $(this).index() + 1);
    $('.sorterBox_before').show();
    $('.sorterBox_after').hide();
});
$('.explore_btn').click(function () {
    // console.log(card_state)
    if (card_state != 3) {
        $('.recommend.init').show();
        $('#explore_card').collapse('show');
        card_state = 2;
        $('#dropDown_btn').attr('src', './public/images/b1/開始使用部分-03.svg');
        $('#dropDown_btn').addClass('historyIcon');
        $('#dropDown_txt').html('# 速食 # 可樂 # 炸雞');
    }
    else {
        $('#shop_card').hide();
        $('.onMap_shop').css('z-index', '-1');
        $('.onMap_rise').show();
        $('#dropDown_btn').hide();
        card_state = 1;
    }
    // console.log(card_state)
});
$('#explore_card').on('hidden.bs.collapse', function () {
    if (!otherExpand) {
        if (card_state != 1) {
            $('.explore_btn').show();
        }
    }
    otherExpand = false;
});
$('#foldCard_btn').click(function () {
    $('#explore_card').collapse('hide');
    $('#dropDown_btn').attr('src', './public/images/a1/a1-06.svg');
    $('#dropDown_btn').removeClass('backBtn');
    $('#dropDown_btn').removeClass('historyIcon');
    $('#dropDown_btn').addClass('dropIcon');
    $('#dropDown_btn').show();
    $('#dropDown_txt').html('# 探索你身邊的好物與本日推薦')
    $('#dropDown_txt').show();
    input_state = 1;
    $('#keywordBlank').attr('placeholder', '# 今天你想要來點什麼 :)');
    $('#keywordBlank').removeClass('grayHint');
    $('#menu_btn').attr('src', './public/images/a1/a1-04.svg');
    $('#menu_btn').addClass('menuIcon');
    $('#menu_btn').removeClass('locationIcon');
    // $('#search_btn').show();
    $('#photo_btn').show();
    // $('#clear_btn').show();
    $('#dropDown_btn').attr('src', './public/images/a1/a1-06.svg');
    // $('#dropDown_btn').hide();
    $('#dropDown_btn').addClass('dropIcon');
    $('#dropDown_btn').removeClass('homeIcon');
    $('#save_btn').hide();
    $('#cancel_btn').hide();
});
$('#slipResult_btn').click(function () {
    if (isOut_result) {
        $('.onMap_rise').animate({ top: '36.9vmin' }, 200);
    }
    else {
        var tmp = $('html').height() - $('#slipResult_btn').height();
        $('.onMap_rise').animate({ top: tmp }, 200);
    }
    isOut_result = !isOut_result;
});

$('#slipResult_btn').mousedown(function (e) {
    isPress_result = true
    press_y = e.pageY
});

$('#clear_btn').click(function () {
    // console.log(card_state);
    $('#keywordBlank').val('');
    $('#relatedTag').html('');
    $(this).hide();
    $('#photo_btn').show();
    clear_result_card();
});
$('#setHome_btn').click(function () {
    input_state = 2;
    $('#keywordBlank').val('');
    $('#keywordBlank').attr('placeholder', 'Enter your home address');
    $('#keywordBlank').focus();
    $('#keywordBlank').addClass('grayHint');
    $('#menu_btn').attr('src', './public/images/a3/a3-38.svg');
    $('#menu_btn').removeClass('menuIcon');
    $('#menu_btn').addClass('locationIcon');
    // $('#search_btn').hide();
    $('#clear_btn').hide();
    $('#dropDown_btn').attr('src', './public/images/a3/a3-35.svg');
    $('#dropDown_btn').show();
    $('#dropDown_btn').removeClass('dropIcon');
    $('#dropDown_btn').addClass('homeIcon');
    $('#save_btn').show();
    $('#cancel_btn').show();
    if ($('#homeAddr').text() !== '輸入地址') {
        codeAddress($('#homeAddr').text());
    }
});
$('#setWork_btn').click(function () {
    input_state = 3;
    $('#keywordBlank').val('');
    $('#keywordBlank').attr('placeholder', 'Enter your work address');
    $('#keywordBlank').focus();
    $('#keywordBlank').addClass('grayHint');
    $('#menu_btn').attr('src', './public/images/a3/a3-38.svg');
    $('#menu_btn').removeClass('menuIcon');
    $('#menu_btn').addClass('locationIcon');
    // $('#search_btn').hide();
    $('#clear_btn').hide();
    $('#dropDown_btn').attr('src', './public/images/a3/a3-71.svg');
    $('#dropDown_btn').show();
    $('#dropDown_btn').removeClass('dropIcon');
    $('#dropDown_btn').addClass('homeIcon');
    $('#save_btn').show();
    $('#cancel_btn').show();
    if ($('#workAddr').text() !== '輸入地址') {
        codeAddress($('#workAddr').text());
    }
});

$('#cancel_btn').click(function () {
    input_state = 1;
    $('#keywordBlank').attr('placeholder', '# 今天你想要來點什麼 :)');
    $('#keywordBlank').removeClass('grayHint');
    $('#menu_btn').attr('src', './public/images/a1/a1-04.svg');
    $('#menu_btn').addClass('menuIcon');
    $('#menu_btn').removeClass('locationIcon');
    // $('#search_btn').show();
    $('#photo_btn').show();
    // $('#clear_btn').show();
    $('#dropDown_btn').attr('src', './public/images/a1/a1-06.svg');
    $('#dropDown_btn').hide();
    $('#dropDown_btn').addClass('dropIcon');
    $('#dropDown_btn').removeClass('homeIcon');
    $('#save_btn').hide();
    $('#cancel_btn').hide();
});

$('#save_btn').click(function () {
    codeAddress($('#keywordBlank').val());
    $('#keywordBlank').attr('placeholder', '# 今天你想要來點什麼 :)');
    $('#keywordBlank').removeClass('grayHint');
    $('#menu_btn').attr('src', './public/images/a1/a1-04.svg');
    $('#menu_btn').addClass('menuIcon');
    $('#menu_btn').removeClass('locationIcon');
    // $('#search_btn').show();
    $('#photo_btn').hide();
    $('#clear_btn').show();
    $('#dropDown_btn').attr('src', './public/images/a1/a1-06.svg');
    $('#dropDown_btn').show();
    $('#dropDown_btn').addClass('dropIcon');
    $('#dropDown_btn').removeClass('homeIcon');
    $('#save_btn').hide();
    $('#cancel_btn').hide();
    if (input_state == 2) {
        $('#home').attr('src', './public/images/a3/a3-12.svg');
        $('#homeAddr').text($('#keywordBlank').val());
        $('#homeAddr').addClass('dark');
    }
    else if (input_state == 3) {
        $('#work').attr('src', './public/images/a3/a3-07.svg');
        $('#workAddr').text($('#keywordBlank').val());
        $('#workAddr').addClass('dark');
    }
    $('#keywordBlank').val('');
    input_state = 1;
});
$('#explore_content div:nth-child(n) img.closeBtn').click(function () {
    $(this).closest('.list-group-item').hide();
});
$('.foldRank_btn').click(function () {
    $('#type_result').hide();
    $('#nearby').show();
});
$('#food_btn').click(function () {
    otherExpand = true;
    $('#nearby').hide();
    $('#type_result').show();
    $('#type_title').text('找美食');
    $('#type_icon').attr('src', './public/images/a3/a3-44.svg');
});
$('#drinks_btn').click(function () {
    otherExpand = true;
    $('#nearby').hide();
    $('#type_result').show();
    $('#type_title').text('想解渴');
    $('#type_icon').attr('src', './public/images/a3++/a3++-03.svg');
});
$('#medical_btn').click(function () {
    otherExpand = true;
    $('#nearby').hide();
    $('#type_result').show();
    $('#type_title').text('顧民生');
    $('#type_icon').attr('src', './public/images/a3++/a3++-02.svg');
});
$('#other_btn').click(function () {
    otherExpand = true;
    $('#nearby').hide();
    $('#type_result').show();
    $('#type_title').text('其他');
    $('#type_icon').attr('src', './public/images/b1/開始使用部分-18.svg');
});
$('.likeBtn').click(function () {
    if ($(this).hasClass('liked')) {
        $(this).attr('src', './public/images/a2/a2-19.svg');
        $(this).removeClass('liked')
    }
    else {
        $(this).attr('src', './public/images/a2/a2-18.svg');
        $(this).addClass('liked');
    }
});
$('#result_list div:nth-child(n).result_content').click(function () {
    card_state = 3;
    getShopInfo($(this).children('.result_name').text());
    $('.onMap_rise').hide();
    $('#shop_card').hide();
    $('.onMap_shop').css('z-index', '2');
    $('#searchBox').hide();
    $('#nameBox').hide();

});
$('.switchTab_btn').click(function () {
    if (shopTab_state == 1) {
        $(this).attr('src', './public/images/b1/開始使用部分-24.svg');
        $('.single-item').hide();
        $('.group-case').show();
        if ($('#openGroup_btn').hasClass('select')) {
            $('#groupCaseTab').hide();
            $('#openCaseTab').show();
        }
        else {
            $('#openCaseTab').hide();
            $('#groupCaseTab').show();
        }
        $('.group-item').hide();
        $('#addItem_btn').hide();
        $('#chooseGroup_btn').show();
        // $('#shareBox').show();
        shopTab_state = 2;
    }
    else {
        $(this).attr('src', './public/images/b1/開始使用部分-23.svg');
        $('.single-item').show();
        $('.group-case').hide();
        $('.group-item').hide();
        $('#chooseGroup_btn').hide()
        $('#addItem_btn').show()
        // $('#shareBox').hide();
        shopTab_state = 1;
    }
});
$('#singleItemTab div:nth-child(n).shopItem img.shopItem_plus').click(function () {
    var tmp = $(this).closest('.shopItem').find('div.itemAmount_txt').first();
    tmp.text((+(tmp.text())) + 1);
});
$('#singleItemTab div:nth-child(n).shopItem img.shopItem_minus').click(function () {
    var tmp = $(this).closest('.shopItem').find('div.itemAmount_txt').first();
    var val = +(tmp.text());
    if (val > 0) {
        tmp.text(val - 1);
    }
});
$('#groupCaseList div:nth-child(n)').click(function () {
    peopleNum = $(this).find('img.peoplePhoto').length;
    targetNum = $(this).find('img.circle').length;
    $('#progressModal div.modal-content').empty();
    $(this).clone('withDataAndEvents').appendTo($('#progressModal div.modal-content'));
    $('#progressModal div.groupCase').css('border-top', 'none');
    $('#progressModal img.peoplePhoto[style="display: none;"]').eq(0).show();
    $(this).css("background-color", "#EACE7B");
    $(this).children('div .groupCase_bottom').hide();
    $('#chooseGroup_btn').attr("src", "public/images/b2/團購-12.svg")
    stationName = $(this).find('span.groupLocker').first().text().split('站')[0];
    storeAddr = $(this).find('span.groupAddr').first().text()
});
$('#openCaseList div:nth-child(n)').click(function () {
    peopleNum = 1;
    $(this).css("background-color", "#EACE7B");
    $('#chooseGroup_btn').attr("src", "public/images/b2/團購-12.svg")
});
$('#groupItemTab div:nth-child(n).shopItem img.shopItem_plus').click(function () {
    var tmp = $(this).closest('.shopItem').find('div.itemAmount_txt').first();
    tmp.text((+(tmp.text())) + 1);
});
$('#groupItemTab div:nth-child(n).shopItem img.shopItem_minus').click(function () {
    var tmp = $(this).closest('.shopItem').find('div.itemAmount_txt').first();
    var val = +(tmp.text());
    if (val > 0) {
        tmp.text(val - 1);
    }
});
$('#shopping-cart-content input.spc-qty-plus').click(function () {
    var tmp = $(this).closest('.spc-item').find('input.spc-qty-number').first();
    var total = +($(this).closest('.spc-item').find('p.spc-item-price').first().text().slice(2));
    var price = total / (+(tmp.val()));
    tmp.val((+(tmp.val())) + 1);
    total = price * (+(tmp.val()))
    $(this).closest('.spc-item').find('p.spc-item-price').first().text('$ ' + total)
});
$('#shopping-cart-content input.spc-qty-minus').click(function () {
    var tmp = $(this).closest('.spc-item').find('input.spc-qty-number').first();
    var val = +(tmp.val());
    if (val > 1) {
        var total = +($(this).closest('.spc-item').find('p.spc-item-price').first().text().slice(2));
        var price = total / val;
        total = price * val
        tmp.val(val - 1);
        total = price * (+(tmp.val()))
        $(this).closest('.spc-item').find('p.spc-item-price').first().text('$ ' + total)
    }
});
$('#shopping-cart-content button.spc-item-delete').click(function () {
    $(this).closest('.spc-item').remove();
});
// $('#group-spc-list div:nth-child(n) div.spc-edit').click(function () {
//      $(this).innerText = "完成";
//      $(this).setAttribute("onclick","SpcEditDone(this)");
//      $(this).closest('.personal-spc').find('.spc-qty').css("display","none");
//      $(this).closest('.personal-spc').find('.spc-item-delete').css("display","block");
// });
// $('#shareBox_close').click(function () {
//     $('#shareBox').hide();
// });
// $('#heart').click(function () {
//     if ($(this).hasClass('liked')) {
//         $(this).attr('src', './public/images/a1/a1-18前.svg');
//         $(this).removeClass('liked')
//     }
//     else {
//         $(this).attr('src', 'public/images/a1/a1-19後.svg');
//         $(this).addClass('liked')
//     }
// });
$('#goto').click(function () {
    isSelectLocker = true;
    $('#infoBox').show();
    if ($('#openGroup_btn').hasClass('select')) {
        console.log(stationName)
        console.log(stationAddr)
        $('#setCaseList span.groupLocker').text(stationName + '櫃 - ' + (Math.floor(Math.random() * 25) + 1));
        $('#setCaseList span.groupAddr').text(stationAddr);
        $('#addItem_btn').hide();
        $('#chooseGroup_btn').hide();
        $('#raise_btn').show();
        $('#tabContainer_group').show();
        $('#raise_btn').addClass('disabled')
        $('#shareBox').hide();
        $('#setCaseTab').show();
    }
    else {
        $('#personal-spc-list button.spc-station-name').eq(orderNum - 1).text(stationName + '站');
        $('#shopping-cart').css("display", "block");
    }
    $('#shop_card').animate({ position: "absolute", top: 0 }, 200);
    $('.onMap_shop').css("pointer-events", "all");
    // $(this).attr('src', 'public/images/a1/a1-17後.svg')
});

$('#addItem_btn').click(function () {
    ++orderNum;
    // $('.order-content-mid p.store-name').eq(orderNum - 1).text(storeName);
    // $('.order-content-mid p.store-tel-addr').eq(orderNum - 1).html(storeTel + '<br>' + storeAddr);
    // $('.order-content-mid p.station-name').eq(orderNum - 1).text(stationName + ' - 02');
    // $('.order-content-mid p.station-addr').eq(orderNum - 1).text(stationAddr);
    if (shopTab_state == 1) {
        $('#personal-spc-list button.spc-store-name').eq(orderNum - 1).text(storeName);
        var count = $('#singleItemList div.shopItem').length;
        // console.log('count' + count);
        for (var i = 0; i < count; i++) {
            var amount = +($('#singleItemList div.itemAmount_txt').eq(i).text());
            if (amount > 0) {
                itemName.push($('#singleItemList div.shopItem_name').eq(i).text())
                itemAmount.push(amount);
                // console.log('shopItmePrice=' + $('#singleItemList div.shopItem_price').eq(i).text())
                itemPrice.push(+($('#singleItemList div.shopItem_price').eq(i).text().substr(2)) * amount)
                itemImg.push($('#singleItemList img.shopItem_img').eq(i).attr('src'));
            }
        }
        for (var i = 0; i < itemName.length; i++) {
            if (i) {
                $('#personal-spc-list :nth-child(' + orderNum + ') div.spc-item').eq(i - 1).clone('withDataAndEvents').appendTo($('#personal-spc-list div.personal-spc').eq(orderNum - 1));
                // var tmp = $('.order-content-mid :nth-child(' + orderNum + ') .order-object-detail-content-item').eq(i - 1);
                // tmp.clone('withDataAndEvents').insertAfter(tmp);
                console.log('enter')
            }
            else {
                $('#personal-spc-list :nth-child(' + orderNum + ') div.spc-item').eq(0).show();
                // $('.order-content-mid :nth-child(' + orderNum + ') .order-object-detail-content-item').eq(0).css('display', 'block');
            }
            $('#personal-spc-list :nth-child(' + orderNum + ') img.spc-item-pic').eq(i).attr('src', itemImg[i]);
            $('#personal-spc-list :nth-child(' + orderNum + ') p.spc-item-name').eq(i).text(itemName[i]);
            $('#personal-spc-list :nth-child(' + orderNum + ') input.spc-qty-number').eq(i).val(itemAmount[i]);
            $('#personal-spc-list :nth-child(' + orderNum + ') p.spc-item-price').eq(i).text('$ ' + itemPrice[i]);
        }
    }
    else {
        $('#group-spc-list button.spc-store-name').eq(orderNum - 1).text(storeName);
        $('#group-spc-list button.spc-station-name').eq(orderNum - 1).text(stationName);
        var count = $('#groupItemList div.shopItem').length;
        // console.log('count' + count);
        for (var i = 0; i < count; i++) {
            var amount = +($('#groupItemList div.itemAmount_txt').eq(i).text());
            if (amount > 0) {
                itemName.push($('#groupItemList div.shopItem_name').eq(i).text())
                itemAmount.push(amount);
                // console.log('shopItmePrice=' + $('#singleItemList div.shopItem_price').eq(i).text())
                itemPrice.push(+($('#groupItemList div.shopItem_price').eq(i).text().substr(2)) * amount)
                itemImg.push($('#groupItemList img.shopItem_img').eq(i).attr('src'));
            }
        }
        for (var i = 0; i < itemName.length; i++) {
            if (i) {
                $('#group-spc-list :nth-child(' + orderNum + ') div.spc-item').eq(i - 1).clone('withDataAndEvents').insertBefore($('.group-spc-footer').eq(orderNum - 1));
                // var tmp = $('.order-content-mid :nth-child(' + orderNum + ') .order-object-detail-content-item').eq(i - 1);
                // tmp.clone('withDataAndEvents').insertAfter(tmp);
                console.log('enter')
            }
            else {
                $('#group-spc-list :nth-child(' + orderNum + ') div.spc-item').eq(0).show();
                // $('.order-content-mid :nth-child(' + orderNum + ') .order-object-detail-content-item').eq(0).css('display', 'block');
            }
            $('#group-spc-list :nth-child(' + orderNum + ') img.spc-item-pic').eq(i).attr('src', itemImg[i]);
            $('#group-spc-list :nth-child(' + orderNum + ') p.spc-item-name').eq(i).text(itemName[i]);
            $('#group-spc-list :nth-child(' + orderNum + ') input.spc-qty-number').eq(i).val(itemAmount[i]);
            $('#group-spc-list :nth-child(' + orderNum + ') p.spc-item-price').eq(i).text('$ ' +itemPrice[i]);
        }
    }
    // var htmlString = $.parseHTML('<img class="peoplePhoto small" src="public/images/b2/團購-06.svg" alt="b2-06">');
    // peopleNum += 1;
    // console.log(peopleNum);
    // for (var i = 1; i < targetNum; ++i) {
    //     if(i < targetNum)
    //     {
    //         $('#progressModal img.peoplePhoto').eq(i).show();
    //     }
    //     else
    //     {
    //         $('#progressModal img.peoplePhoto').eq(i).hide();
    //     }
    // }
    $('.onMap_shop').css('z-index', '-1');
    SwitchToShoppingcart();

});

$('#chooseGroup_btn').click(function () {
    $('.single-item').hide();
    $('.group-case').hide();
    if ($('#followGroup_btn').hasClass('select'))
    {
        $('.group-item').show();

    }
    else {
        console.log('enter')
        var tmp = $('#shop_card').height() - $('#slipShop_btn').height() - parseInt($('#slipShop_btn').css("margin-bottom"));
        $('#shop_card').animate({ position: "absolute", top: tmp }, 200);
        isOut_shop = !isOut_shop;
        $('.onMap_shop').css("pointer-events", "none");
    }
    $('#chooseGroup_btn').hide();
    $('#addItem_btn').show();
});

$('.moreBar').click(function () {
    $(this).hide();
    $('.moreInfo').show();
});

$('.moreInfo img.optionBtn_right').click(function () {
    $('.moreInfo').hide();
    $('.moreBar').show();
});

$('#hot_btn').click(function () {
    if (!$(this).hasClass('select')) {
        $(this).attr('src', './public/images/b1/開始使用部分-37.svg');
        $('#cheap_btn').attr('src', './public/images/b1/開始使用部分-39.svg');
        $('#guess_btn').attr('src', './public/images/b1/開始使用部分-40.svg');
        $('#class_btn').attr('src', './public/images/b1/開始使用部分-42.svg');
    }
});

$('#cheap_btn').click(function () {
    if (!$(this).hasClass('select')) {
        $(this).attr('src', './public/images/b1/開始使用部分-38.svg');
        $('#hot_btn').attr('src', './public/images/b1/開始使用部分-36.svg');
        $('#guess_btn').attr('src', './public/images/b1/開始使用部分-40.svg');
        $('#class_btn').attr('src', './public/images/b1/開始使用部分-42.svg');
    }
});

$('#guess_btn').click(function () {
    if (!$(this).hasClass('select')) {
        $(this).attr('src', './public/images/b1/開始使用部分-41.svg');
        $('#hot_btn').attr('src', './public/images/b1/開始使用部分-36.svg');
        $('#cheap_btn').attr('src', './public/images/b1/開始使用部分-39.svg');
        $('#class_btn').attr('src', './public/images/b1/開始使用部分-42.svg');
    }
});

$('#class_btn').click(function () {
    if (!$(this).hasClass('select')) {
        $(this).attr('src', './public/images/b1/開始使用部分-43.svg');
        $('#hot_btn').attr('src', './public/images/b1/開始使用部分-36.svg');
        $('#cheap_btn').attr('src', './public/images/b1/開始使用部分-39.svg');
        $('#guess_btn').attr('src', './public/images/b1/開始使用部分-40.svg');
    }
});
$('#followGroup_btn').click(function () {
    if (!$(this).hasClass('select')) {
        $('#openCaseTab').hide();
        $('#groupCaseTab').show();
    }
});
$('#openGroup_btn').click(function () {
    if (!$(this).hasClass('select')) {
        $('#groupCaseTab').hide();
        $('#openCaseTab').show();
    }
});
$('.tab_btn').click(function () {
    if (!$(this).hasClass('select')) {
        $(this).toggleClass('select');
        $(this).siblings('.tab_btn.select').toggleClass('select');
    }
});

$('#slipShop_btn').click(function () {
    if (isOut_shop) {
        $('#shop_card').animate({ position: "absolute", top: 0 }, 200);
    } else {
        var tmp = $('#shop_card').height() - $('#slipShop_btn').height() - parseInt($('#slipShop_btn').css("margin-bottom"));
        $('#shop_card').animate({ position: "absolute", top: tmp }, 200);
    }
    isOut_shop = !isOut_shop;
});

$('#back_btn').click(function () {
    $('#shop_card').hide();
    $('.onMap_shop').css('z-index', '-1');
    $('.onMap_rise').show();
    $('#nameBox').hide();
    $('#searchBox').show();
    card_state = 1;
});

$('.link_btn').click(function () {
    copyLink();
});

$('.line_btn').click(function () {
    var link = "http://line.naver.jp/R/msg/text/?";
    link += encodeURIComponent("來看看我發起的團購") + "%0D%0A" + encodeURIComponent(window.location.href);
    window.open(link);
});
$('.facebook_btn').click(function () {
    var link = "http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href);
    window.open(link);
});
$('.messenger_btn').click(function () {
    window.open('fb-messenger://share?link=' + encodeURIComponent(window.location.href));
});

$('#back_shop').click(function () {
    $('.onMap_shop').css('z-index', '2');
    $('#shopping-cart').css("display", "none");
});
$('#back_checkout').click(function () {
    $('#check-out').css("display", "block");
    $('#order-list').css("display", "none");
});
$('#cross_cart').click(function () {
    $('#shopping-cart').css("display", "none");
    $('#shop_card').hide();
    clear_result_card();
    $('#searchBox').show();
    $('#nameBox').hide();
    $('#infoBox').hide();
    card_state = 1;
});
$('#cross_order').click(function () {
    $('#order-list').css("display", "none");
    $('#shop_card').hide();
    clear_result_card();
    $('#searchBox').show();
    $('#nameBox').hide();
    $('#infoBox').hide();
    card_state = 1;
});

$('#personal-spc-list button.spc-station-name').click(function () {
    $('.onMap_shop').css('z-index', 2)
    var tmp = $('#shop_card').height() - $('#slipShop_btn').height() - parseInt($('#slipShop_btn').css("margin-bottom"));
    $('#shop_card').animate({ position: "absolute", top: tmp }, 200);
    isOut_shop = !isOut_shop;
    $('.onMap_shop').css("pointer-events", "none");
    $('#shopping-cart').css("display", "none");
});
$('#personal-spc-list input.spc-checkbox:nth-of-type(n)').click(function () {
    console.log($(this).index('#personal-spc-list input.spc-checkbox'));
    checkNum = $(this).index('#personal-spc-list input.spc-checkbox')
});
$('#group-spc-list input.spc-checkbox:nth-of-type(n)').click(function () {
    console.log($(this).index('#group-spc-list input.spc-checkbox'));
    checkNum = $(this).index('#group-spc-list input.spc-checkbox');
});
$('#spc-order').click(function () {
    var query;
    if (shopTab_state == 1) {
        $('#cko-store-name').text($('#personal-spc-list div.personal-spc:nth-of-type(' + (checkNum + 1) + ') button.spc-store-name').text());
        $('#personal-spc-list div.personal-spc:nth-of-type(' + (checkNum + 1) + ') div.spc-item').clone('withDataAndEvents').appendTo($('#check-out-content'));
        $('#cko-station-name-value').text($('#personal-spc-list div.personal-spc:nth-of-type(' + (checkNum + 1) + ') button.spc-station-name').text());
        query = $('#personal-spc-list div.personal-spc:nth-of-type(' + (checkNum + 1) + ') button.spc-station-name').text();
    }
    else {
        $('#cko-store-name').text($('#group-spc-list div.group-spc:nth-of-type(' + (checkNum + 1) + ') button.spc-store-name').text());
        $('#check-out-content').empty();
        $('#group-spc-list div.group-spc:nth-of-type(' + (checkNum + 1) + ') div.spc-item').clone('withDataAndEvents').appendTo($('#check-out-content'));
        $('#cko-station-name-value').text($('#group-spc-list div.group-spc:nth-of-type(' + (checkNum + 1) + ') button.spc-station-name').text());
        query = $('#group-spc-list div.group-spc:nth-of-type(' + (checkNum + 1) + ') button.spc-station-name').text();
    }
    $.get('/getLockerInfo', {
        name: query
    }, (data) => {
        $('#cko-station-address-value').text(data.addr);
    })
    $('#check-out-content .spc-qty-plus').remove();
    $('#check-out-content .spc-qty-minus').remove();
    $('#check-out-content .spc-qty-number').prop('disabled', true);
    var all = 0;
    $('#check-out-content .spc-item-price').each(function () {
        all += +($(this).text().slice(2));
    });
    $('#cko-total-item-value').text(all + '元');
    var total = all + (+($('#cko-total-fare-value').text().slice(0, -1)));
    $('#cko-total-value-red').text(total);
});

$('#raise_btn').click(function () {
    if (!$(this).hasClass('disabled')) {
        $('#setCaseTab').hide();
        $('#groupItemTab').show();
        $('#raise_btn').hide();
        $('#addItem_btn').show();
    }
});
$('.group-spc-share').click(function () {
    $('.shareBox-white').show();
});
$('#cko-station-position').click(function () {
    document.getElementById('map-position-map').style.opacity = '0';
    var query = $('#cko-station-name-value').text();
    $.get('/getLockerInfo', {
        name: query
    }, (data) => {
        $('#cko-station-address-value').text(data.addr);
        var smallMap = new google.maps.Map(document.getElementById('map-position-map'), {
            zoom: 16,
            center: { lat: data.lat, lng: data.lng },
            styles: styles['hide_more'],
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: false,
        });
        var marker;
        marker = new google.maps.Marker({
            map: smallMap,
            position: { lat: data.lat, lng: data.lng },
            icon: {
                url: locker_marker,
                scaledSize: new google.maps.Size(60, 60),
            },
        });
    })
    document.getElementById('map-position-map').style.opacity = '1';
});

$('#cko-order').click(function () {
    $('#ol-grouping .ol-store-name').text($('#cko-store-name').text());
    $('#ol-grouping .ol-station-name').text($('#cko-station-name-value').text());
    $('#ol-grouping .ol-store-img').attr('src',storeImg);
    $('#check-out .spc-item').appendTo('#ol-order1');
    console.log($('#ol-grouping .spc-item').length);
    $('#ol-grouping .ol-item-number').text($('#ol-grouping .spc-item').length);
    $('#ol-grouping .ol-total-price-value').text($('#cko-total-value-red').text());

    $('#ol-arrived .ol-store-name').text($('#cko-store-name').text());
    $('#ol-arrived .ol-station-name').text($('#cko-station-name-value').text());
    $('#ol-arrived .ol-store-img').attr('src',storeImg);
    $('#ol-order1 .spc-item').appendTo('#ol-order4');
    console.log($('#ol-arrived .spc-item').length);
    $('#ol-arrived .ol-item-number').text($('#ol-arrived .spc-item').length);
    $('#ol-arrived .ol-total-price-value').text($('#cko-total-value-red').text())
});

$('.ol-group-cancel').click(function() {
    $(this).parent().empty();
})
$(document).mouseup(function (e) {
    var share_1 = $("#shareBox");
    var share_2 = $(".shareBox-white");

    // if the target of the click isn't the container nor a descendant of the container
    if (!share_2.is(e.target) && share_2.has(e.target).length === 0) {
        share_2.hide();
    }
    if (!share_1.is(e.target) && share_1.has(e.target).length === 0) {
        share_1.hide();
    }
});
/************************ Handle finger swipe event **************************/
document.getElementById("slipResult_btn").addEventListener("touchstart", resultTouchStart, false);
document.getElementById("slipResult_btn").addEventListener("touchmove", handleTouchMove, false);
document.getElementById("slipResult_btn").addEventListener("touchcancel", handleTouchCancel, false);
document.getElementById("slipShop_btn").addEventListener("touchstart", shopTouchStart, false);
document.getElementById("slipShop_btn").addEventListener("touchmove", handleTouchMove, false);
document.getElementById("slipShop_btn").addEventListener("touchcancel", handleTouchCancel, false);
var xDown = null;
var yDown = null;

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery

}
function resultTouchStart(evt) {
    isDown_result = true;
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function shopTouchStart(evt) {
    isDown_shop = true;
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!yDown) {
        return;
    }
    var yUp = evt.touches[0].clientY;
    var yDiff = yUp - yDown;

    if (isDown_result) {
        if (yDiff > 0 && (!isOut_result)) {
            var tmp = $('html').height() - $('#slipResult_btn').height();
            $('.onMap_rise').animate({ top: tmp }, 200);
            isOut_result = !isOut_result;
        } else if (yDiff < 0 && isOut_result) {
            $('.onMap_rise').animate({ top: '36.9vmin' }, 200);
            isOut_result = !isOut_result;
        }
    }
    else if (isDown_shop) {
        if (yDiff > 0 && (!isOut_shop)) {
            var tmp = $('#shop_card').height() - $('#slipShop_btn').height() - parseInt($('#slipShop_btn').css("margin-bottom"));
            $('#shop_card').animate({ position: "absolute", top: tmp }, 200);
            isOut_shop = !isOut_shop;
        } else if (yDiff < 0 && isOut_shop) {
            $('#shop_card').animate({ position: "absolute", top: 0 }, 200);
            isOut_shop = !isOut_shop;
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
    isDown_result = false;
    isDown_shop = false;
};

function handleTouchCancel(evt) {
    isDown_result = false;
    isDown_shop = false;
    xDown = null;
    yDown = null;
};