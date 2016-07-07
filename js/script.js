var map;
var markersArray = [];
var mapOptions;

//Function Initialize to start the map
function initialize() {

    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(53.475166,  -2.240975),
        mapTypeControl: false,
        disableDefaultUI: true
    };

    if($(window).width() <= 1080) {
        mapOptions.zoom = 13;
    }
    if ($(window).width() < 850 || $(window).height() < 595) {
        hideNav();
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    setMarkers(markers);

    setAllMap();

    viewModel.resetMap = function() {
    console.log("Reset Map");

    var windowWidth = $(window).width();
            if(windowWidth <= 1080) {
                map.setZoom(13);
                map.setCenter(mapOptions.center);
            } else if(windowWidth > 1080) {
                map.setZoom(14);
                map.setCenter(mapOptions.center);
            }
    };

    ko.applyBindings(viewModel);

    //Function to reset map on click
    //Also reset view when resizing window
    /*function resetMap() {
            var windowWidth = $(window).width();
            if(windowWidth <= 1080) {
                map.setZoom(13);
                map.setCenter(mapOptions.center);
            } else if(windowWidth > 1080) {
                map.setZoom(14);
                map.setCenter(mapOptions.center);
            }
        }*/
       /* $("#reset").click(function() {
            resetMap();
        });*/
        /*$(window).resize(function() {
            resetMap();
        });*/
    }

//Determines if markers should be visible
//This function is passed in the knockout viewModel function
function setAllMap() {
  for (var i = 0; i < markers.length; i++) {
    if(markers[i].boolTest === true) {
    markers[i].holdMarker.setMap(map);
    } else {
    markers[i].holdMarker.setMap(null);
    }
  }
}

//Information for the different locations
var markers = [
    {
    title: "The Cloud 23",
    lat: 53.4756149,
    lng: -2.2511478,
    streetAddress: "303 Deansgate",
    cityAddress: "M3 4LQ Manchester",
    url: "www.cloud23bar.com",
    id: "nav0",
    visible: ko.observable(true),
    boolTest: true
    },
    {
    title: "Elixir Tonics & Treats",
    lat: 53.4803814,
    lng: -2.2483029,
    streetAddress: "123 Deansgate",
    cityAddress: "M3 2BY Manchester",
    url: "www.elixir-manchester.co.uk",
    id: "nav1",
    visible: ko.observable(true),
    boolTest: true
    },
    {
    title: "The Blue Pig Manchester",
    lat: 53.4842182,
    lng: -2.237954,
    streetAddress: "69 High St",
    cityAddress: "M4 1FS Manchester",
    url: "www.thebluepigmcr.co.uk",
    id: "nav2",
    visible: ko.observable(true),
    boolTest: true
    },
    {
    title: "Dry Bar",
    lat: 53.48287,
    lng: -2.2352508,
    streetAddress: "28-30 Oldham St",
    cityAddress: "M1 1JN Manchester",
    url: "www.drybar.co.uk",
    id: "nav3",
    visible: ko.observable(true),
    boolTest: true
    },
    {
    title: "The Shamrock",
    lat: 53.4858981,
    lng: -2.2279476,
    streetAddress: "17 Bengal St",
    cityAddress: "M4 6AQ Manchester",
    url: "www.shamrock-irishbar.co.uk",
    id: "nav4",
    visible: ko.observable(true),
    boolTest: true
    }
];


//Get Google Street View Image for each inidividual marker
    //Passed lat and lng to get each image location
    //headingImageview to check if looking from east or west
    //and pitch to check the hieght of where to look
var headingImageView = [112, 110, 110, 120, 80];
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

function determineImage() {

        streetViewImage = streetViewUrl +
                        markers[i].lat + ',' + markers[i].lng +
                        '&fov=75&heading=' + headingImageView[i] + '&pitch=10';

}


//Sets the markers on the map within the initialize function
    //Sets the infoWindows to each individual marker
    //The markers are inidividually set using a for loop
function setMarkers(location) {

    for(i=0; i<location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
          position: new google.maps.LatLng(location[i].lat, location[i].lng),
          map: map,
          title: location[i].title,
          icon: {
            url: 'img/marker.png',
            size: new google.maps.Size(25, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 40)
            },
          shape: {
            coords: [1,25,-40,-25,1],
            type: 'poly'
          }
        });

        //get google street view images for info windows
        determineImage();

        //Binds infoWindow content to each marker
        location[i].contentString = '<img src="' + streetViewImage +
                                    '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' +
                                    location[i].title + '</strong><br><p>' +
                                    location[i].streetAddress + '<br>' +
                                    location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url +
                                    '" target="_blank">' + location[i].url + '</a>';

        var infowindow = new google.maps.InfoWindow({
            content: markers[i].contentString
        });

        //Click on marker to view infoWindow
            //zoom in and center location on click
        new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map,this);
            var windowWidth = $(window).width();
            if(windowWidth <= 1080) {
                map.setZoom(14);
            } else if(windowWidth > 1080) {
                map.setZoom(16);
            }
            map.setCenter(marker.getPosition());
            location[i].picBoolTest = true;
          };
        })(location[i].holdMarker, i));

        //Click nav element to view infoWindow
            //zoom in and center location on click
        var searchNav = $('#nav' + i);
        searchNav.click((function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map,marker);
            map.setZoom(16);
            map.setCenter(marker.getPosition());
            location[i].picBoolTest = true;
          };
        })(location[i].holdMarker, i));
    }
}

//Query through the different locations from nav bar with knockout.js
    //only display markers and nav elements that match query result
var viewModel = {
    query: ko.observable(''),
    temperature : ko.observable(''),
    iconStyle : ko.observable('')
};


viewModel.markers = ko.dependentObservable(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(markers, function(marker) {
    if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            return marker.visible(true);
        } else {
            marker.boolTest = false;
            setAllMap();
            return marker.visible(false);
        }
    });
}, viewModel);



//show $ hide markers in sync with nav
$("#input").keyup(function() {
setAllMap();
});

//Hide and Show entire Nav/Search Bar on click
    // Hide/Show Bound to the arrow button
    //Nav is repsonsive to smaller screen sizes
var isNavVisible = true;
function noNav() {
    $("#search-nav").animate({
                height: 0,
            }, 500);
            setTimeout(function() {
                $("#search-nav").hide();
            }, 500);
            $("#arrow").attr("src", "img/down-arrow.gif");
            isNavVisible = false;
}
function yesNav() {
    $("#search-nav").show();
            var scrollerHeight = $("#scroller").height() + 55;
            if($(window).height() < 600) {
                $("#search-nav").animate({
                    height: scrollerHeight - 100,
                }, 500, function() {
                    $(this).css('height','auto').css("max-height", 439);
                });
            } else {
            $("#search-nav").animate({
                height: scrollerHeight,
            }, 500, function() {
                $(this).css('height','auto').css("max-height", 549);
            });
            }
            $("#arrow").attr("src", "img/up-arrow.gif");
            isNavVisible = true;
}

function hideNav() {
    if(isNavVisible === true) {
            noNav();

    } else {
            yesNav();
    }
}
$("#arrow").click(hideNav);

//Hide Nav if screen width is resized to < 850 or height < 595
//Show Nav if screen is resized to >= 850 or height is >= 595
    //Function is run when window is resized
$(window).resize(function() {
    var windowWidth = $(window).width();
    if ($(window).width() < 850 && isNavVisible === true) {
            noNav();
        } else if($(window).height() < 595 && isNavVisible === true) {
            noNav();
        }
    if ($(window).width() >= 850 && isNavVisible === false) {
            if($(window).height() > 595) {
                yesNav();
            }
        } else if($(window).height() >= 595 && isNavVisible === false) {
            if($(window).width() > 850) {
                yesNav();
            }
        }
});

//Expand .forecast div on click to see Weather Underground forecast
//and shrink back when additionally clicked
    //repsonsive size
var weatherContainer = $("#weather-image-container");
var isWeatherVisible = false;
weatherContainer.click(function() {
    if(isWeatherVisible === false) {
        if($(window).width() < 670) {
            $(".forecast li").css("display", "block");
            weatherContainer.animate({
                width: "245"
            }, 500);
        } else {
            $(".forecast li").css("display", "inline-block");
            weatherContainer.animate({
                width: "380"
            }, 500);
        }
        isWeatherVisible = true;
    } else {
        weatherContainer.animate({
        width: "80"
    }, 500);
        isWeatherVisible = false;
    }
});

//GET Weather Underground JSON
    //Append Weather forecast for Manchester
    //If error on GET JSON, display message
var weatherUgUrl = "http://api.wunderground.com/api/48ee1e1ee2889d26/conditions/q/UK/Manchester.json";

$.getJSON(weatherUgUrl, function(data) {
    var list = $(".forecast ul");
    detail = data.current_observation;
    viewModel.temperature('Temp: ' + detail.temp_c + '°c');
    list.append('<li><img style="width: 25px" src="' + detail.icon_url + '">  ' + detail.icon + '</li>');
}).error(function(e){
        $(".forecast").append('<p style="text-align: center;">Sorry! Weather Underground</p><p style="text-align: center;">Could Not Be Loaded</p>');
    });

//Hide and show Weather forecast div from screen on click
var isWeatherImageVisible = true;
var hideWeatherArrow = $("#hide-weather").find("img");
function hideWeather() {
    if(isWeatherImageVisible === true) {
            $("#weather-image-container").animate({
                height: 0,
                paddingTop: 0
            }, 300);
        isWeatherImageVisible = false;
        hideWeatherArrow.attr("src", "img/small-down-arrow.png");
    } else {
            $("#weather-image-container").animate({
                height: 60,
                paddingTop: 5
            }, 300);
        isWeatherImageVisible = true;
        hideWeatherArrow.attr("src", "img/small-up-arrow.png");
    }
}

$("#hide-weather").click(hideWeather);