Leaflet fullscreen mode
=======================

An improved / cleaned up version of [brunob/leaflet.fullscreen](https://github.com/brunob/leaflet.fullscreen), adding a fullscreen button below the map's zomm controls.

- Uses fullscreen icon from http://glyphicons.com/
- Uses same control definition as leaflet's internal zoom controls, allowing for direct initialization with the map:

  `var map = new L.Map('map', {
    fullscreenControl: true
  });`
- Adds a separate control below the zoom controls, not using the same container

For a demo see [here]().