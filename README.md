# Project-pollution-JS
This is a project for Start2Impact, JavaScript Advanced class

# About The Project
This is a a simple web app that fetches Air Quality Index data from AQICN via their free API and displays it.
The user can use the current geolocalized position, get a random one or manually insert coordinates.
The API fetches data from the station that is nearest to the selected coordinates and shows a local map (screenshot above) and a forecast chart.

# Built With
* jQuery
* Bootstrap
* Popper
* Lodash
* Chart JS
* Leaflet
* Tippy.js
* Axios
* Dotenv

# Go started
To get a local copy up and running follow these simple steps.

Prerequisites
npm

npm install npm@latest -g
Installation
Clone the repository

git clone https://github.com/Gabriele99-developer/Project-pollution-JS
Install NPM packages

npm install
Build from source

npm run build
Get a free API key at Air Quality Open Data Platform

Create a .env file in the root folder with just one line:

API_KEY = 'ENTER YOUR API'
Open dist/index.html

# Usage
The API finds the station that is closest to the chosen coordinates and returns some data.
The search button shows where the station is located on a map, an air quality forecast graph, and a quick commentary on the current air quality level.

# License
Distributed under the MIT License. See LICENSE for more information.

# Contact 
Gabriele Alunni Gradini - gabro180@gmail.com 

