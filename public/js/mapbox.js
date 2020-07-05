/* eslint-disable */

// Get locations
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGV2d2ViaW8iLCJhIjoiY2tjNHZ0YW1tMGJyMTJ4bnY1eGF4cmIzMiJ9.knlFzNdVcGUTLrl5t0tw4w';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/devwebio/ckc6k0bk61cuu1jmgw4uup89h',
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create new element and add a class marker to it
  const el = document.createElement('div');

  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
