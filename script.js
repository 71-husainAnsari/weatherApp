const form = document.querySelector('form');
const input = document.querySelector('#cityInput');

// Default city name
let defaultCity = "Mumbai"; 

// Function to handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const newCity = input.value.trim(); // Get inputted city and trim whitespace
    if (newCity !== "") { // Make sure the input is not empty
        defaultCity = newCity; // Update default city
        input.value = ''; // Clear input field
        // Call function to update weather information for the new default city
		document.querySelector(".city").innerText = newCity;
        updateWeather(defaultCity);
        HourlyForecast(defaultCity).then((result)=>{
                  console.log(result);
        })
    }
});
const api_key = '885a25cce26a26430ffe491b35f64424';
function updateWeather(city) {
    // Display the weather information on the UI
    console.log(`Fetching weather for ${city}...`);
    // Example API call using fetch
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
        .then(response => response.json())
        .then(data => {
            // Process and display weather data on UI
            console.log(data);
            TodayForecast(data);
		 document.querySelector(".temp").innerText = parseInt(data.main.temp +0.5) + '\u00B0';
		 const max = parseInt(data.main.temp_max +0.5);
		 const min = parseInt(data.main.temp_min +0.5);
		 document.querySelector(".maxandmin").innerText = `${max} / ${min}`;
         document.querySelector(".description").innerText = data.weather[0].description;
		//  console.log(data.sys.sunrise);

         let date = setDate(data.sys.sunrise);
         date.then((res)=>{
             document.querySelector(".datatime").innerText=res;
         })
        //  console.log(date);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
			alert("invalid city name , please try again");
        });
}


// Initial call to update weather for the default city
updateWeather(defaultCity);
HourlyForecast(defaultCity);


async function setDate(time){
    let timestampInMilliseconds = time * 1000;
    let localDateTime = moment(timestampInMilliseconds).tz('Asia/Kolkata').format('DD-MM-YYYY');
    let localTime = moment(timestampInMilliseconds).tz('Asia/Kolkata').format('HH:mm:ss');
    // console.log(localTime);
    return localDateTime;

}

async function TodayForecast(value){
    let feelslike = value.main.feels_like;
    let minTemp = value.main.temp_min;
    let maxTemp = value.main.temp_max;
    // maxTemp = maxTemp +'\u00B0';
    let humidity = value.main.humidity;
    let pressure = value.main.pressure;
     pressure = parseInt(pressure/1013.25 +0.5)
     let deg = '\u00B0';
    let windSpeed = value.wind.speed;
    document.querySelector(".feels_like").innerText = `${feelslike + deg}`;
    document.querySelector(".humidity").innerText = `${humidity} %`;
    document.querySelector(".minTemp").innerText = `${minTemp + deg}`;
    document.querySelector(".maxTemp").innerText = `${maxTemp + deg}`;
    document.querySelector(".Pressure").innerText = `${pressure} atm`;
    document.querySelector(".windspeed").innerText = `${windSpeed} m/s`;

}


//getting hourly forecast update using api
async function HourlyForecast(city){
    try {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`)
       .then( response => response.json())
       .then(data=>{
        // console.log(data);
        // console.log(data.list[0].main);
        setHourlyforecast(data);
        setfivedaysforecast(data);
       })   
    } catch (error) {
        console.error("Error fetching weather information:", error);
    }
}
async function setHourlyforecast(value){
    console.log(value)
    let HourlyForecast = document.querySelector(".hourlyforecast table");
    let hourlydata = "";
    for(let i=0;i<5;i++){
        hourlydata += `<tr>
        <td>${formatTime(value.list[i].dt_txt)}</td>
        <td><img src = ${setIcon(value.list[i].weather[0].icon)} alt="" width=50px height=50px></td>
        <td>${formatTemperature(value.list[i].main.temp)}</td>
    </tr>`
    }
    HourlyForecast.innerHTML = hourlydata;
}
function formatTime(inputTime) {
    // Parse the input time string
    const parsedTime = new Date(inputTime);

    // Extract hour and minute components
    const hour = parsedTime.getHours();
    const minute = parsedTime.getMinutes();

    // Convert hour to AM/PM format
    let formattedHour = (hour % 12 === 0) ? 12 : hour % 12;
    const period = (hour < 12) ? 'AM' : 'PM';

    // Add leading zero for single digit minutes
    const formattedMinute = (minute < 10) ? '0' + minute : minute;

    // Construct the formatted time string
    const formattedTime = `${formattedHour}${period}`;
    return formattedTime;
}
async function setfivedaysforecast(value){
    const fivedaycontent = document.querySelector(".nextfivedays table");
    let fivedaydata = "";
    let i =0;
    while(i<40){
        fivedaydata += `<tr>
        <td>${formatDateToDay(value.list[i].dt_txt)}</td>
        <td><img src = ${setIcon(value.list[i].weather[0].icon)} alt="" width=50px height=50px></td>
        <td>${formatTemperature(value.list[i].main.temp)}</td>
    </tr>`
     i += 8;
    }
    fivedaycontent.innerHTML = fivedaydata;  
}
function formatTemperature(value) {
    return value + "&deg";
}
function setIcon(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`
}
function formatDateToDay(date) {
    const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let day =  new Date(date).getDay()

  // Use the day of the week to get the corresponding day name
  const dayName = d[day];
  console.log(dayName);
  return dayName
}

function isDaytime() {
    var now = new Date();
    var sunrise = new Date();
    sunrise.setHours(6, 0, 0); // Example: 6:00 AM
    var sunset = new Date();
    sunset.setHours(18, 0, 0); // Example: 6:00 PM
    var currentTime = now.getTime();
    return currentTime >= sunrise.getTime() && currentTime <= sunset.getTime();
}

function setBackground() {
    var body = document.body;
    if (isDaytime()) {
        // Set day background image
        // Example: body.style.backgroundImage = "url('day.jpg')";
        document.body.style.backgroundImage = "dayback.jpg";
    } else {
        // Set night background
        document.body.style.backgroundImage = "nightback.jfij";
    }
}
setBackground();