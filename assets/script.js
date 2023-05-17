var todayDate = $('.todayDate')
var dayJsDate = dayjs().format('MM/DD/YYYY')
var cityNameInput = $('.cityNameInput')
var searchResultList = $('.searchResultList')
var searchItemDisplay = $('.searchItemDisplay')
var apiKey = '6684afbdcc563782b42479261d5a0380';
var forcastResult = $('.forcastResult')
var todayDiv = $('.todayDiv')
var previousSearchLocation = []
var previousSearchList = $('.previousSearchList')

$(todayDate).text("today's date:" + dayJsDate)

init()

//initialize the url and grab array from local storage
function init() {
    getLocalStorage()
    showPreviousResult()
}

// getitem local storage
function getLocalStorage() {
    var storedPreviousLocation = localStorage.getItem('previousSearchLocation')
    var parsedstoredPreviousLocation = JSON.parse(storedPreviousLocation)
    if (parsedstoredPreviousLocation === null) {
        return
    }
    previousSearchLocation.push(...parsedstoredPreviousLocation)
}
function removePreviousUl() {
    $('.previousBox').remove()

}
//show previous result function, and list them as a list
function showPreviousResult() {
    $('.previousBox').remove()
    for (let k = 0; k < previousSearchLocation.length; k++) {
        var ulEl = $('<ul class= "list-group previousBox">')
        var liEl = $('<li class= "list-group-item d-flex justify-content-between hello">')
        var buttonEl = $('<button type="submit" class="py-2 px-3 searchBtn ">✓</button>')
        $(liEl).text(previousSearchLocation[k])
        $(liEl).text(previousSearchLocation[k])
        $(liEl).append(buttonEl)
        $(ulEl).append(liEl)
        $(previousSearchList).append(ulEl)
    }
}

// function for clearing previus search result 
function clearPreviousResult() {
    $('.choiceCity').remove()
}
// function for clearing previous forecast info 
function clearPreviousForecast() {
    $(forcastResult).empty()
}
//function for clearing previous today weather info 
function clearPreviousTodayinfo() {
    $(todayDiv).empty()
}

//addd event listener for the search button
$(document).on('click', '.searchBtn', function (event) {
    event.preventDefault();
    clearPreviousResult();
    clearPreviousForecast();
    clearPreviousTodayinfo();
    var cityNameInputValue = ''
    console.log(event.target.parentElement.nodeName);
    if (event.target.parentElement.nodeName === 'FORM') {
        cityNameInputValue = cityNameInput.val();
    }
    if (event.target.parentElement.nodeName === 'LI') {
        cityNameInputValue = event.target.parentNode.textContent
    }

    if (cityNameInputValue) {
        var latlonUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityNameInputValue + '&limit=1&appid=' + apiKey;
        fetch(latlonUrl)
            .then(
                function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data);

                            var choiceCity = $('<h6 class="choiceCity">')
                            var choiceBtn = $('<button type="submit" class="py-2 px-3 selectBtn">✓</button>')
                            choiceCity.text(data[0].name + '/  ' + data[0].state + '/  ' + data[0].country)
                            var dataCity = data[0].name;
                            var dataLat = data[0].lat;
                            var dataLon = data[0].lon;
                            $(choiceCity).addClass('list-group-item d-flex justify-content-between')
                            $(choiceCity).data({
                                'citName': dataCity,
                                'lat': dataLat,
                                'lon': dataLon
                            });
                            $(choiceCity).append(choiceBtn)
                            $(searchResultList).append(choiceCity)

                            $(searchItemDisplay).text('Search Result: ' + cityNameInputValue)
                        })
                    }
                }
            )
    }
})

// set local storage 
function setLocalStorage(city) {
    console.log(city);
    if (previousSearchLocation.includes(city) || city === undefined) {
        return;
    }
    previousSearchLocation.push(city);
    localStorage.setItem('previousSearchLocation', JSON.stringify(previousSearchLocation))
}




$(document).on('click', '.selectBtn', function () {
    clearPreviousForecast();
    clearPreviousTodayinfo();
    var pickedCity = $(this).parent();
    var city = $(pickedCity).data('citName')
    var pickedLat = $(pickedCity).data('lat')
    var pickedLon = $(pickedCity).data('lon')
    var pickedCityText = pickedCity.text()
    console.log(pickedCityText);
    console.log(pickedLat);
    console.log(pickedLon);
    setLocalStorage(city)
    showPreviousResult()
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
                        var todayWeatherBox = $('<div class="mx-2 text-info">')

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
                        $(todayDiv).append(todayWeatherBox)
                    }
                )
            }
        }
    )
}


function prsent5DayForecast(lat, lon) {
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
    fetch(forecastUrl).then(
        function (response) {
            if (response.ok) {
                response.json().then(
                    function (data) {
                        console.log(data);
                        for (let i = 0; i < data.list.length; i++) {
                            var forecastTimeValue = data.list[i].dt_txt.slice(11)
                            var forcastDateValue = data.list[i].dt_txt.slice(0, 10)
                            var forecastIconUrl = 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png'
                            var forecastTempValue = data.list[i].main.temp
                            var forecastWindValue = data.list[i].wind.speed
                            var forecastHumidityValue = data.list[i].main.humidity

                            if (forecastTimeValue === '15:00:00') {
                                var forcastDivEl = $('<div class="forcastDiv container m-1">')
                                var forecastDate = $('<h5>')
                                var forecastIcon = $('<img>')
                                var forecastTemp = $('<p>')
                                var forcastWind = $('<p>')
                                var forcastHumidity = $('<p>')

                                $(forecastDate).text(forcastDateValue)
                                $(forecastIcon).attr('src', forecastIconUrl)
                                $(forecastTemp).text('Temp: ' + forecastTempValue + '°F')
                                $(forcastWind).text('Wind:' + forecastWindValue + 'MPH')
                                $(forcastHumidity).text('Humidity: ' + forecastHumidityValue + '%')

                                $(forcastDivEl).append(forecastDate)
                                $(forcastDivEl).append(forecastIcon)
                                $(forcastDivEl).append(forecastTemp)
                                $(forcastDivEl).append(forcastWind)
                                $(forcastDivEl).append(forcastHumidity)
                                $(forcastResult).append(forcastDivEl)
                                $(forcastDivEl).css('border', 'solid 3px #DBDFEA')
                            }
                        }
                    }
                )
            }
        }
    )
}
