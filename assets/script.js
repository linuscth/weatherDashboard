var cityNameInput = $('.cityNameInput')
var searchBtn = $('.searchBtn')
var searchResultList = $('.searchResultList')
var searchItemDisplay = $('.searchItemDisplay')
var apiKey = '6684afbdcc563782b42479261d5a0380';
var day1 = $('.day1')
var day2 = $('.day2')
var day3 = $('.day3')
var day4 = $('.day4')
var day5 = $('.day5')
var todayWeatherBox = $('.todayWeatherBox')
var previousSearchLocation = {}

//init
// get previous search history 


$(searchBtn).on('click', function (event) {
    event.preventDefault();
    clearPreviousResult();
    var cityNameInputValue = cityNameInput.val();
    if (cityNameInputValue) {
        var latlonUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityNameInputValue + '&limit=5&appid=' + apiKey;
        fetch(latlonUrl)
            .then(
                function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data);
                            for (let i = 0; i < data.length; i++) {
                                var choiceCity = $('<li>')
                                var choiceBtn = $('<button type="submit" class="px-3 selectBtn">✓</button>')
                                choiceCity.text(data[i].name + '/  ' + data[i].state + '/  ' + data[i].country)
                                var dataLat = data[i].lat;
                                var dataLon = data[i].lon;
                                $(choiceCity).addClass('list-group-item d-flex justify-content-between')
                                $(choiceCity).data({
                                    'lat': dataLat,
                                    'lon': dataLon
                                });
                                $(choiceCity).append(choiceBtn)
                                $(searchResultList).append(choiceCity)
                            }
                            $(searchItemDisplay).text('Search Result: ' + cityNameInputValue)
                        })
                    }
                }
            )
    }
})
function clearPreviousResult() {
    $('li').remove()
}


$(document).on('click', '.selectBtn', function () {
    // clearPreviousForecast()
    clearPreviousTodayinfo()
    var pickedCity = $(this).parent();
    var pickedLat = $(pickedCity).data('lat')
    var pickedLon = $(pickedCity).data('lon')
    var pickedCityText = pickedCity.text()
    //i want to add more the lat and lon to my object previousSearchLocation
    console.log(previousSearchLocation);
    console.log(pickedCityText);
    console.log(pickedLat);
    console.log(pickedLon);
    presentTodayWeather(pickedLat, pickedLon)
    prsent5DayForecast(pickedLat, pickedLon)

})
function presentTodayWeather(lat, lon) {
    var todayWeatheUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
    fetch(todayWeatheUrl).then(
        function (response) {
            if (response.ok) {
                response.json().then(
                    function (data) {
                        console.log(data);
                        var todayCityName = data.name;
                        var todayTemp = data.main.temp;
                        var todayWind = data.wind.speed;
                        var todayHumidity = data.main.humidity;
                        var todayIconUrl = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
                        var todayDate = dayjs.unix(data.dt).format('MM/DD/YYYY')


                        var todayTitlediv = $('<div class="todayTitlediv">')
                        var h5El = $('<h5>')
                        var tempP = $('<p>')
                        var windP = $('<p>')
                        var humidityP = $('<p>')
                        var todayIconEl = $('<img>')


                        $(h5El).text(todayCityName + ' (' + todayDate + ') ')
                        $(todayIconEl).attr('src', todayIconUrl)
                        $(tempP).text('Temp: ' + todayTemp + '°F')
                        $(windP).text('Wind: ' + todayWind + 'MPH')
                        $(humidityP).text('Humidity: ' + todayHumidity + '%')

                        $(todayTitlediv).append(h5El)
                        $(todayTitlediv).append(todayIconEl)
                        $(todayWeatherBox).append(todayTitlediv)
                        $(todayWeatherBox).append(tempP)
                        $(todayWeatherBox).append(windP)
                        $(todayWeatherBox).append(humidityP)
                        $(todayWeatherBox).css('border', 'solid 5px #DBDFEA')
                        $(todayWeatherBox).addClass('mx-2')

                    }

                )
            }

        }
    )


}


// function clearPreviousForecast() {}






function prsent5DayForecast(lat, lon) {
    // api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
    fetch(forecastUrl).then(
        function (response) {
            if (response.ok) {
                response.json().then(
                    function (data) {
                        console.log(data);
                        //get data 
                        //need extra instructions



                    }
                )
            }
        }
    )
}

function clearPreviousTodayinfo() {
    $('.todayWeatherBox').empty()
}




//setitem local storage 


//setitem local storage

//getitem local storage