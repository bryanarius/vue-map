<script setup>
import leaflet from 'leaflet';
import { onMounted } from 'vue';

let map;
onMounted(() => {
    // init map
    map = leaflet.map('map').setView([51.505, -0.09], 13);
  })
</script>

<template>
  <div class="h-screen relative">
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>
