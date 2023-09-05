import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic

function getWeather(input) {
  let request = new XMLHttpRequest();
  let url;
  if (isNaN(input)) {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${process.env.API_KEY}&units=imperial`;
  } else {
    url = `http://api.openweathermap.org/data/2.5/weather?zip=${input}&appid=${process.env.API_KEY}&units=imperial`;
  }

  request.addEventListener("loadend", function () {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, input);
    } else {
      printError(this, response, input);
    }
  });

  //Function "try...catch" code for the business logic

  // request.addEventListener("loadend", function () {
  //   const response = JSON.parse(this.responseText);
  //   try {
  //     if (this.status === 200) {
  //       printElements(response, input);
  //     } else {
  //       throw Error("Red Alert!");
  //     }
  //   } catch (error) {
  //     printError(error.message);
  //   }
  // });

  request.open("GET", url, true);
  request.send();
}

// UI Logic

function printElements(apiResponse) {
  // Optional variables to replace template literal is the #showResponse code block
  // let responseTimeStamp = new Date(apiResponse.sys.sunrise);
  // let sunriseTime = responseTimeStamp.toLocaleTimeString();

  let temp = apiResponse.main.temp;
  let textTemp = "Fahrenheit";
  if (apiResponse.sys.country !== 'US') {
    temp = ((apiResponse.main.temp - 32) * (5 / 9)).toFixed(2);
    textTemp = "Celsius";
  }

  document.querySelector('#showResponse').innerText = `The humidity in ${apiResponse.name} is ${apiResponse.main.humidity}%. 
  The temperature in ${textTemp} is ${temp} degrees. Local sunrise will begin at ${new Date(apiResponse.sys.sunrise).toLocaleTimeString()}.`;
}

function printError(request, apiResponse, input) {
  document.querySelector('#showResponse').innerText = `There was an error accessing the weather data for ${input}: ${request.status} ${request.statusText}: ${apiResponse.message}`;
}

//Functioning "try...catch" code for UI logic

// function printError(error) {
//   document.querySelector('#showResponse').innerText = `There was an error: ${error}`;
// }

function handleFormSubmission(event) {
  event.preventDefault();
  const city = document.querySelector('#location').value;
  document.querySelector('#location').value = null;
  getWeather(city);
}

window.addEventListener("load", function () {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
});