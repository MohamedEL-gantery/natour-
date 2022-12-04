/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZWxnYW50ZXJ5MzIiLCJhIjoiY2w5bHlpZnZlMW40NjN2cDJpcHFmeWVndSJ9.ahUEBoql8ncm0XVgHla9lA';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/elgantery32/cl9m1qwrt000414physgdxat4', // style URL
    scrollZoom: false,
    //center: [-74.5, 40], // starting position [lng, lat]
    //zoom: 9, // starting zoom
    //projection: 'globe', // display the map as a 3D globe
  });
  map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
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
      .setHTML(`<p>Day ${loc.day}:${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
