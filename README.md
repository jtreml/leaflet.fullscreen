Leaflet fullscreen mode
=======================

An improved / cleaned up version of [brunob/leaflet.fullscreen](https://github.com/brunob/leaflet.fullscreen), adding a fullscreen button below the map's zoom controls.

- Uses browser's native fullscreen API whenever possible
- Gracefully falls back to pseudo-fullscreen if browser doesn't support fullscreen API (i.e. makes the map container cover the whole screen and be on top of everything)
- No need for you to define fullscreen style, just include the CSS file that comes with the plugin
- Uses same control definition as leaflet's internal zoom controls, allowing for direct initialization with the map:

  `var map = new L.Map('map', {
    fullscreenControl: true
  });`
- Can be forced NOT to use native fullscreen API:

  `var map = new L.Map('map', {
    fullscreenControl: true,
    fullscreenNative: false
  });`
- Adds a separate control below the zoom controls, doesn't use the same container
- Visually changes fullscreen button when fullscreen gets activated / deactivated

For a demo see [here](http://jtreml.github.com/leaflet.fullscreen/example.html).