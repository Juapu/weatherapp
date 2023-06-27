window.addEventListener('load', () => {
  let long;
  let lat;
  let locTimezone = document.querySelector('.location-timezone');
  let degree = document.querySelector('.degree');
  let tempDesc = document.querySelector('.temperature-description');
  const degreeSection = document.querySelector('.degree-section');
  const degreeSpan = document.querySelector('.scale');
  //Map of all the Weather Interpretation Codes
  const codes = new Map();
  codes.set(0, "Clear Sky");
  codes.set(1, "Mainly Clear");
  codes.set(2, "Partly Cloudy");
  codes.set(3, "Overcast");
  codes.set(45, "Foggy");
  codes.set(48, "Depositing Rime Fog");
  codes.set(51, "Light Drizzle");
  codes.set(53, "Moderate Drizzle");
  codes.set(55, "Dense Drizzle");
  codes.set(56, "Light Freezing Drizzle");
  codes.set(57, "Dense Freezing Drizzle");
  codes.set(61, "Slight Rain");
  codes.set(63, "Moderate Rain");
  codes.set(65, "Heavy Rain");
  codes.set(66, "Light Freezing Rain");
  codes.set(67, "Heavy Freezing Rain");
  codes.set(71, "Slight Snow Fall");
  codes.set(73, "Moderate Snow Fall");
  codes.set(75, "Heavy Snow Fall");
  codes.set(77, "Snow Grains");
  codes.set(80, "Slight Rain Showers");
  codes.set(81, "Moderate Rain Showers");
  codes.set(82, "Violent Rain Showers");
  codes.set(85, "Slight Snow Showers");
  codes.set(86, "Heavy Snow Showers");
  codes.set(95, "Thunderstorm");
  codes.set(96, "Thunderstorm With Slight Hail");
  codes.set(99, "Thunderstorm With Heavy Hail");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {

      long = position.coords.longitude;
      lat = position.coords.latitude;
      let api = "";
      if (degreeSpan.textContent === "F") {
        api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&temperature_unit=fahrenheit&timezone=auto`;
      } else {
        api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&timezone=auto`;
      }
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const {temperature, weathercode, is_day} = data.current_weather;
          locTimezone.textContent = data.timezone;
          degree.textContent = temperature;
          tempDesc.textContent = codes.get(weathercode);
          setIcons(weathercode, is_day, document.querySelector('.icon'));
        });

    });

  } else {
    h1.textContent = "please allow geolocation to locate you";
  }

  function setIcons(weathercode, day, iconID) {
    var skycons = new Skycons({color: "white"});
    let currIcon = "";
    skycons.play();
    if (weathercode >= 0 && weathercode <= 1) {
      if (day === 1) {
        currIcon = "CLEAR_DAY";
      } else {
        currIcon = "CLEAR_NIGHT";
      }
    }else if (weathercode === 2) {
      if (day === 1) {
        currIcon = "PARTLY_CLOUDY_DAY";
      } else {
        currIcon = "PARTLY_CLOUDY_NIGHT";
      }
    }else if (weathercode === 3 || weathercode === 45 || weathercode === 48) {
      currIcon = "FOG";
    }else if (weathercode >= 51 && weathercode <=67 || weathercode >= 81 && weathercode <= 85) {
      currIcon = "RAIN";
    }else {
      currIcon = "SNOW";
    }
    return skycons.set(iconID, Skycons[currIcon]);
  }

  degreeSection.addEventListener("click", () => {
    if (degreeSpan.textContent === 'F') {
      degreeSpan.textContent = "C";
      degree.textContent = (degree.textContent-32)*5/9;
    } else {
      degreeSpan.textContent = "F";
      degree.textContent = degree.textContent*9/5+32;
    };
  });

});
