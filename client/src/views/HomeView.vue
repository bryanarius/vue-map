<script setup>
import leaflet from 'leaflet';
import { onMounted, ref } from 'vue';
import GeoErrorModal from '@/components/GeoErrorModal.vue'
import MapFeatures from '@/components/MapFeatures.vue'

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

  map.on('moveend', () => {
    closeSearchResults()
  })

  getGeolocation()
});

  const coords = ref(null);
  const fetchCoords = ref(null);
  const geoMarker = ref(null);
  const geoError = ref(null)
  const geoErrorMsg = ref('Testing Vbind on Modal')

  const getGeolocation = () => {
    if (coords.value) {
      coords.value = null;
      sessionStorage.removeItem('coords');
      map.removeLayer(geoMaker.value);
      return;
    }

    // check session storage for coords
    if (sessionStorage.getItem("coords")) {
      coords.value = JSON.parse(sessionStorage.getItem("coords"));
      plotGeolocation(coords.value);
      return;
    }

    fetchCoords.value = true
    navigator.geolocation.getCurrentPosition(setCoords, getLocError);
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
    fetchCoords.value = null;
    geoError.value = true;
    geoErrorMsg.value = err.message;
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
    map.setView([coords.lat, coords.lng], 10)

    return { coords, geoMarker };
  };

  const closeGeoError = () => {
    geoError.value = null;
    geoErrorMsg.value = null;
    console.log('clicked')
    console.log(geoError.value)
    console.log( geoErrorMsg.value)
  };

  const resultMarker = ref(null);

  const plotResult = (coords) => {
    //Check to see if resultMarker has value 
    if (resultMarker.value) {
      map.removeLayer(resultMarker.value);
    }

      // create custom marker
      const customMarker = leaflet.icon({
      iconUrl:('../assets/map-marker-red.png'),
      iconSize: [35,35]
    });

    // create new marker with coords and custom icon 

    resultMarker.value = leaflet.marker([coords.coordinates[1], coords.coordinates[0]]).addTo(map);

    // set map view to current location
    map.setView(coords.coordinates[1], coords.coordinates[0], 14)

    closeSearchResults();
  }

  const searchResults = ref(null)

  const toggleSearchResults = () => {
    searchResults.value = !searchResults.value;
  };

  const closeSearchResults = () => {
    searchResults.value = null;
  };

  const removeResult = () => {
    map.removeLayer(resultMarker.value)
  };
</script>

<template>
  <div class="h-screen relative">
    <GeoErrorModal 
    @closeGeoError="closeGeoError" 
    v-if="geoError" 
    :geoErrorMsg="geoErrorMsg"
    />
    <MapFeatures  
    @getGeolocation="getGeolocation"
    @plotResult="plotResult"
    @toggleSearchResults="toggleSearchResults"
    @removeResult="removeResult"
    :coords="coords" 
    :fetchCoords="fetchCoords" 
    :searchResults="searchResults"
    />
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>


