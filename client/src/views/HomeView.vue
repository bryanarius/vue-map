<script setup>
import leaflet from 'leaflet';
import { onMounted, ref } from 'vue';

let map;
onMounted(() => {
    // init map
    map = leaflet.map('map').setView([30.332, -81.655], 11);

     // add tile layer 
  leaflet
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

getGeolocation()
  })

  const coords = ref(null);
  const fetchCoords = ref(null);
  const geoMarker = ref(null)

  const getGeolocation = () => {
    // check session storage for coords
    if (sessionStorage.getItem("coords")) {
      coords.value = JSON.parse(sessionStorage.getItem("coords"));
      plotGeolocation(coords.value);
      return;
    }

    fetchCoords.value = true
    navigator.geolocation.getCurrentPosition(setCoords, getLocError)
  };

  const setCoords = (pos) => {
    // stop fetching coords
    fetchCoords.value = null;

    // set coords in session storage
    const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

    // set ref coords value
    coords.value = setSessionCoords;

    plotGeolocation(coords.value);
  };

  const getLocError = (err) => {
    console.log(err)

  };

  const plotGeolocation = (coords) => {
    // create custom marker
    const customMarker = leaflet.icon({
      iconUrl:('../assets/map-marker-red.png'),
      iconSize: [35,35]
    });

    // create new marker with coords and custom icon 

    geoMarker.value = leaflet.marker([coords.lat, coords.lng]).addTo(map);

    // set map view to current location
    map.setView(coords.lat, coords.lng)

    return { coords, geoMarker };
  };

  
   
</script>

<template>
  <div class="h-screen relative">
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>
