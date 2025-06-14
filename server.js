const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const expressSession = require('express-session');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
  secret: '7cddcea3-6cd7-4cb8-98cd-b08bd4e8bc7b',
  resave: false,
  saveUninitialized: true
}));




app.get('/', (req, res) => {
  res.send([{ message: 'Welcome to WeatherWatch API!', details: { version: '1.0.0', description: 'WeatherWatch API is for the Desktop Applications of WeatherWatch' },  paths: [{ path: '/forecast/:city' }, { path: '/forecast/grid/:city' }, { path: '/forecast/grid/:city/hourly' }, { path: '/alerts/:city' },]}]);
});




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
          res.status(500).send({ code: 500, message: 'Error fetching weather data', errorMessege: error.message });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ code: 500, message: 'Error fetching location data', errorMessege: error.message });
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
          res.status(500).send({ code: 500, message: 'Error fetching weather data', errorMessege: error.message });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ code: 500, message: 'Error fetching location data', errorMessege: error.message });
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
          res.status(500).send({error: 'Error fetching weather data', errorMessege: error.message });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({error: 'Error fetching location data', errorMessege: error.message });
    });
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});


app.use((req, res, next) => {
  res.status(404).send({ status: 404, message: 'Not Found', details: { path: req.path } });
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ status: 500, message: 'Internal Server Error', details: { error: err.message } });
});

app.use((req, res, next) => {
  res.status(401).send({ status: 401, message: 'Unauthorized', details: { message: 'You are not authorized to access this resource' } });
});

