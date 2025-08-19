const cityinput = document.querySelector(".cityinput")
const searchicon = document.getElementById("searchicon")
const weatherForm = document.querySelector(".wheather-form")
const apikey = '7a050f4c47ac1a0e92ed9335e47764cd'

if(cityinput && searchicon){
    searchicon.addEventListener('click', function(){
        cityinput.classList.toggle('open')
    })
}

function getCurrentDate(timeZoneOffSet){
    const now = new Date()
    const localTime = now.getTime() + now.getTimezoneOffset() * 60000 + timeZoneOffSet * 1000
    const localDate = new Date(localTime)
    const options = {weekday: 'long', year: 'numeric', 
                     month: 'long', day: 'numeric'}
    return localDate.toLocaleDateString(undefined, options)
}

weatherForm.addEventListener("keypress", async event => {
    if(event.key == "Enter"){
        event.preventDefault()
        const city = cityinput.value

        if(city){
            try{    
                const weatherData = await getWeatherData(city)
                displayWeatherInfo(weatherData)
            }
            catch(error){
                console.error(error)
                alertError()
            }
        }
        else{
            displayError("Please enter a city")
        }
    }
})

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`
    const response = await fetch(apiUrl)
    console.log(response)
    if(!response.ok){
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
}

function displayWeatherInfo(data){

    console.log(data)
    const {name:city, 
           main:{temp, humidity},
           weather:[{description, id}], timezone} = data
    
    const cityDisplay = document.getElementById("cityName")
    const dateDisplay = document.getElementById("date")
    const tempDisplay = document.getElementById("temp")
    const emojiDisplay = document.getElementById("emoji")
    const descDisplay = document.getElementById("description")

    cityDisplay.textContent = city
    dateDisplay.textContent = getCurrentDate(timezone)
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°`
    emojiDisplay.textContent = getWeatherEmoji(id)
    descDisplay.textContent = description
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return '⛈️' 

        case (weatherId >= 300 && weatherId < 400):
            return '🌧️' 

        case (weatherId >= 500 && weatherId < 600):
            return '🌧️'

        case (weatherId >= 600 && weatherId < 700):
            return '❄️'

        case (weatherId >= 700 && weatherId < 800):
            return '🌫️' 
            
        case (weatherId == 800):
            return '☀️' 
                
        case (weatherId >= 801 && weatherId < 810):
            return '⛅' 

        default:
            return '❓'
    }
}

function displayError(message){
    cityinput.placeholder = message
}

function alertError(){
    alert("Please enter a valid city name")
}