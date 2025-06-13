const express = require('express');
const geocoder = require('geocoder');
const axios = require('axios');
const app = express();
const port = 3000;



app.get('/weather/:city', (req, res) => {
  const city = req.params.city;


  // Convert city to latitude and longitude using Nominatim API
  const nominatimApi = 'https://nominatim.openstreetmap.org/search';
  const params = {
    q: city,
    format: 'json',
    limit: 1
  };

  
  axios.get(nominatimApi, { params, headers: { 'User-Agent': 'WeatherWatch/1.0.0', 'Referrer': req.headers.host  } })
    .then(response => {
      const lat = response.data[0].lat;
      const lon = response.data[0].lon;

      // Call the NWS API to get the current weather conditions
      const apiEndpoint = `https://api.weather.gov/points/${lat},${lon}`;
      axios.get(apiEndpoint)
        .then(response => {
          const weatherData = response.data;
          res.json(weatherData);
          
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('Error fetching weather data');
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ code: 500, message: 'Error fetching location data', errorMessege: error.message });
    });
});

// Define the API endpoint for getting the forecast
app.get('/alerts/:city', (req, res) => {
  const city = req.params.city;

  // Convert city to latitude and longitude using Nominatim API
  const nominatimApi = 'https://nominatim.openstreetmap.org/search';
  const params = {
    q: city,
    format: 'json',
    limit: 1
  };

  axios.get(nominatimApi, { params, headers: { 'User-Agent': 'WeatherWatch/1.0.0', 'Referrer': req.headers.host } })
    .then(response => {
      const lat = response.data[0].lat;
      const lon = response.data[0].lon;

      // Call the NWS API to get the current weather conditions
      const apiEndpoint = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
      axios.get(apiEndpoint)
        .then(response => {
          const weatherData = response.data;
          res.json(weatherData);
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('Error fetching weather data');
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching location data');
    });
});

app.get('/forecast/grid/:city', (req, res) => {
  const city = req.params.city;


  // Convert city to latitude and longitude using Nominatim API
  const nominatimApi = 'https://nominatim.openstreetmap.org/search';
  const params = {
    q: city,
    format: 'json',
    limit: 1
  };

  axios.get(nominatimApi, { params, headers: { 'User-Agent': 'WeatherWatch/1.0.0', 'Referrer': req.headers.host } })
    .then(response => {
      const lat = response.data[0].lat;
      const lon = response.data[0].lon;

      // Call the NWS API to get the current weather conditions
      const apiEndpoint = `https://api.weather.gov/points/${lat},${lon}`;
      axios.get(apiEndpoint)
        .then(response => {
          const weatherData = response.data;
          // find forcast grid point
          const forecastData = weatherData.properties.forecast
          axios.get(forecastData)
          .then(response => {
              const forecastData = response.data;
              res.json(forecastData);
          })       
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('Error fetching weather data');
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching location data');
    });
  
});

app.get('/forecast/grid/:city/hourly', (req, res) => {
  const city = req.params.city;


  // Convert city to latitude and longitude using Nominatim API
  const nominatimApi = 'https://nominatim.openstreetmap.org/search';
  const params = {
    q: city,
    format: 'json',
    limit: 1
  };

  axios.get(nominatimApi, { params, headers: { 'User-Agent': 'WeatherWatch/1.0.0', 'Referrer': req.headers.host } })
    .then(response => {
      const lat = response.data[0].lat;
      const lon = response.data[0].lon;

      // Call the NWS API to get the current weather conditions
      const apiEndpoint = `https://api.weather.gov/points/${lat},${lon}`;
      axios.get(apiEndpoint)
        .then(response => {
          const weatherData = response.data;
          // find forcast grid point
          const forecastData = weatherData.properties.forecastHourly
          axios.get(forecastData)
          .then(response => {
              const forecastData = response.data;
              res.json(forecastData);
          })       
        })
        .catch(error => {
          console.error(error);
          res.status(500).send({error: 'Error fetching weather data'});
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({error: 'Error fetching location data'});
    });
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});