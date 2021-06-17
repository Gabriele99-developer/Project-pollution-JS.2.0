//constants and variables
const API_KEY =  process.env.API_KEY
const cityName = document.querySelector('.input-text');
const searchForm = document.querySelector('.search-form');

const aqiIndex = document.getElementById('aqi-index');
const aqiLevelMessage = document.getElementById('aqi-level');
const heathImplications = document.getElementById('health-implications');
const cautionaryStatement = document.getElementById('cautionary-statement');

let currentCity ='';

const map = L.map('mapid', { zoomControl: false });
new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
let marker ='';

// Render results and layout for user position
const startingPoint = async function(){
  try{
   const res = await fetch(`https://api.waqi.info/feed/here/?token=${API_KEY}`)
   const resJson = await res.json();
   const city = resJson.data.city.name;
   const aqi = resJson.data.aqi;
   renderResJson(aqi, city);
   renderMap(city);
  } catch (err){
    console.error(err.message); 
  }
}

// Get coordinates from city
const getCoords = async function (city){
  const coordinates = fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=33391df72f7d48e39576fde1f6b56d60`);
  return coordinates;
}

// Get city from coordinates
const getCity = async function (coords){
  const city = fetch(`https://api.opencagedata.com/geocode/v1/json?q=${coords[0]}+${coords[1]}&key=33391df72f7d48e39576fde1f6b56d60`);
  return city;
}

// Recieve city name, get coordinates and render the first map
const renderMap = async function(city){
  let coords =  (await getCoords(city)).json();
  coordsRes = (await coords).results[0].geometry;
  coordsArr = Object.values(coordsRes);

  map.setView(coordsArr, 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.tileLayer(`https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${API_KEY}`).addTo(map);
  marker = L.marker(coordsArr);
  marker.addTo(map);
 }

// Render map and layout for city wrote by user
const renderCity = async function (city){
  try {
    const res = await fetch(`https://api.waqi.info/feed/${city}/?token=${API_KEY}`);
    const resJson = await res.json();
    if(resJson.status == 'error'){
      divmap.innerHTML = `Can't find the place, sorry!`;
      throw new Error (`"${resJson.data}."Maybe look for closest station from you!`)
    }
    renderResJson(resJson.data.aqi, city);
    addMarker(city);
  } catch (err) {
    console.error(err.message);
    errorLayout();
  }
}

 // Add new marker on city searched by user
 const addMarker = async function(city){
  let coords =  (await getCoords(city)).json();
  coordsRes = (await coords).results[0].geometry;
  coordsArr = Object.values(coordsRes);
  marker.removeFrom(map);
  marker = L.marker(coordsArr);
  marker.addTo(map);
  map.setView(coordsArr);
 }

// Render layout
renderResJson = function(aqi, city){
  if(aqi > 300){
    aqiIndex.innerText = `${city}: ⚫ ${aqi} ⚫`;
    aqiLevelMessage.innerText = '☣️ Pericoloso! ☣️';
    heathImplications.innerText = 'Allerta sanitaria: tutti possono avere effetti sulla salute più gravi';
    cautionaryStatement.innerText = "Tutti dovrebbero evitare tutti gli sforzi all'aperto";
  } else if (aqi > 200){
    aqiIndex.innerText = `${city}: 🟤 ${aqi} 🟤`;
    aqiLevelMessage.innerText = '⚠️ Molto malsano ⚠️';
    heathImplications.innerText = "Avvertenze sanitarie di condizioni di emergenza. L'intera popolazione ha maggiori probabilità di essere colpita.";
    cautionaryStatement.innerText = "I bambini e gli adulti attivi e le persone con malattie respiratorie, come l'asma, dovrebbero evitare tutti gli sforzi all'aperto; tutti gli altri, specialmente i bambini, dovrebbero limitare lo sforzo all'aperto.";
  } else if (aqi > 150){
    aqiIndex.innerText = `${city}: 🔴 ${aqi} 🔴`;
    aqiLevelMessage.innerText = '🏭 Malsano 🏭';
    heathImplications.innerText = 'Tutti possono iniziare a sperimentare effetti sulla salute; i membri di gruppi sensibili possono avere effetti sulla salute più gravi';
    cautionaryStatement.innerText = "I bambini e gli adulti attivi e le persone con malattie respiratorie, come l'asma, dovrebbero evitare lo sforzo prolungato all'aperto; tutti gli altri, specialmente i bambini, dovrebbero limitare lo sforzo prolungato all'aperto";
  } else if (aqi > 100){
    aqiIndex.innerText = `${city}: 🟠 ${aqi} 🟠`;
    aqiLevelMessage.innerText = '🌆 Malsano per gruppi sensibili 🌆';
    heathImplications.innerText = 'I membri di gruppi sensibili possono avere effetti sulla salute. È improbabile che il pubblico in generale ne risenta'
    cautionaryStatement.innerText = "I bambini e gli adulti attivi e le persone con malattie respiratorie, come l'asma, dovrebbero limitare lo sforzo prolungato all'aperto.";
  }else if (aqi > 50){
    aqiIndex.innerText = `${city}: 🟡 ${aqi} 🟡`;
    aqiLevelMessage.innerText = '🍃 Moderato 🍃';
    heathImplications.innerText = "La qualità dell'aria è accettabile; tuttavia, per alcuni inquinanti può esserci un moderato problema di salute per un numero molto limitato di persone che sono insolitamente sensibili all'inquinamento atmosferico.";
    cautionaryStatement.innerText = "I bambini e gli adulti attivi e le persone con malattie respiratorie, come l'asma, dovrebbero limitare lo sforzo prolungato all'aperto.";
  } else if (aqi > 0){
    aqiIndex.innerText = `${city}: 🟢 ${aqi} 🟢`;
    aqiLevelMessage.innerText = '🍀 Buono 🍀';
    heathImplications.innerText = "La qualità dell'aria è considerata soddisfacente e l'inquinamento atmosferico presenta un rischio minimo o nullo";
    cautionaryStatement.innerText = 'Nessuna';
  } else {
    errorLayout();
  }
}


// 
resetLayout = function(){
  aqiIndex.innerText = `⌛`;
  aqiLevelMessage.innerText = '⌛';
  heathImplications.innerText = '⌛';
  cautionaryStatement.innerText = '⌛';
}

//
errorLayout = function(){
  aqiIndex.innerText = `⚠️`;
  aqiLevelMessage.innerText = "Error: It seems there isn't an AQI Station in here. Check map to discover near Stations";
  heathImplications.innerText = '💤';
  cautionaryStatement.innerText = '💤';
}

//submit city name
searchForm.addEventListener('submit', function(e){
  e.preventDefault();
  currentCity = cityName.value;
  resetLayout();
  renderCity(currentCity);
});

//select all text when focus input text
cityName.addEventListener('focus', function(){
  cityName.select();
})

// Check AQI on clicked spot
//    marker on clicked spot
map.on('click', async function(e){

  let coords =  [e.latlng.lat, e.latlng.lng];
  marker.removeFrom(map);
  marker = L.marker(coords);
  marker.addTo(map);
  map.setView(coords);

//    get city name from coordinates of the clicked spot
  const res = (await getCity(coords)).json();
  const city = ((await res).results[0].components.county || (await res).results[0].components.state|| (await res).results[0].components.municipality );
  const flag = ((await res).results[0].annotations.flag);
  const formatted = ((await res).results[0].formatted);

//    add popup with info
  marker.bindPopup(`<b>${flag} - ${city}</b><br><b>${formatted}</b>`).openPopup();
})

// // Close popup when click outside the map
// window.addEventListener('click', function(){
//   marker.closePopup();
// })

startingPoint();