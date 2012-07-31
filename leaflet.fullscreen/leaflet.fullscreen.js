L.Control.Fullscreen = L.Control.extend({
	options: {
		position: 'topleft'
	},

	onAdd: function (map) {
		var className = 'leaflet-control-zoom',
		    container = L.DomUtil.create('div', className);

		this._createButton('Toggle fullscreen', 'leaflet-control-fullscreen', container, this._toogleFullScreen, map);

		return container;
	},

	_createButton: function (title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container),
			fullScreenApi = L.Control.Fullscreen.api;

		link.href = '#';
		link.title = title;

		L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', fn, context)
			.on(link, 'dblclick', L.DomEvent.stopPropagation);

		L.DomEvent
			.addListener(container, fullScreenApi.fullScreenEventName, L.DomEvent.stopPropagation)
			.addListener(container, fullScreenApi.fullScreenEventName, L.DomEvent.preventDefault)
			.addListener(container, fullScreenApi.fullScreenEventName, this._handleEscKey, context);

		L.DomEvent
			.addListener(document, fullScreenApi.fullScreenEventName, L.DomEvent.stopPropagation)
			.addListener(document, fullScreenApi.fullScreenEventName, L.DomEvent.preventDefault)
			.addListener(document, fullScreenApi.fullScreenEventName, this._handleEscKey, context);

		if(!fullScreenApi.supportsFullScreen) {
			L.DomEvent.addListener(document, 'keydown', this._onKeyDown, context);
		}

		return link;
	},

	_toogleFullScreen: function () {
		var container = this._container,
			fullScreenApi = L.Control.Fullscreen.api;

		if (fullScreenApi.supportsFullScreen) {
			if(fullScreenApi.isFullScreen(container)) {
				fullScreenApi.cancelFullScreen(container);
				this.fire('exitFullscreen');
			} else {
				fullScreenApi.requestFullScreen(container);
				this.fire('enterFullscreen');
			}
		} else {
			if(L.DomUtil.hasClass(container, 'leaflet-fullscreen')) {
				L.DomUtil.removeClass(container, 'leaflet-fullscreen');
				this.fire('exitFullscreen');
				
			} else {
				L.DomUtil.addClass(container, 'leaflet-fullscreen');
				this.fire('enterFullscreen');
			}
			this.invalidateSize();
		}
	},

	_handleEscKey: function () {
		var fullScreenApi = L.Control.Fullscreen.api;
		
		if(!fullScreenApi.isFullScreen(this)){
			this.fire('exitFullscreen');
		}
	},

	_onKeyDown: function (e) {
		if(e.keyCode != 27) {
			return;
		}

		var container = this._container;

		if(!L.DomUtil.hasClass(container, 'leaflet-fullscreen')) {
			return;
		}

		L.DomUtil.removeClass(container, 'leaflet-fullscreen');
		this.fire('exitFullscreen');
		L.DomEvent.stop(e);
	}
});

L.Map.mergeOptions({
	fullscreenControl: false
});

L.Map.addInitHook(function () {
	if (this.options.fullscreenControl) {
		this.fullscreenControl = new L.Control.Fullscreen();
		this.addControl(this.fullscreenControl);
	}
});

L.control.fullscreen = function (options) {
	return new L.Control.Fullscreen(options);
};

// Wrapper for browser-dependent native fullscreen API
//
// Source
//   http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/ via
//   https://github.com/brunob/leaflet.fullscreen
L.Control.Fullscreen.api = (function() {
	var fullScreenApi = { 
			supportsFullScreen: false,
			isFullScreen: function() { return false; }, 
			requestFullScreen: function() {}, 
			cancelFullScreen: function() {},
			fullScreenEventName: '',
			prefix: ''
		}, browserPrefixes = 'webkit moz o ms khtml'.split(' ');

	// Check for native support
	if(typeof document.cancelFullScreen != 'undefined') {
		fullScreenApi.supportsFullScreen = true;
	} else {	 
		// Check for fullscreen support by vendor prefix
		for(var i = 0; i < browserPrefixes.length; i++) {
			fullScreenApi.prefix = browserPrefixes[i];
			if(typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined') {
				fullScreenApi.supportsFullScreen = true;
				break;
			}
		}
	}

	// Update methods to do something useful
	if (fullScreenApi.supportsFullScreen) {
		fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

		fullScreenApi.isFullScreen = function() {
			switch(this.prefix) {	
				case '':
					return document.fullScreen;
				case 'webkit':
					return document.webkitIsFullScreen;
				default:
					return document[this.prefix + 'FullScreen'];
			}
		};

		fullScreenApi.requestFullScreen = function(el) {
			return this.prefix === '' ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
		};

		fullScreenApi.cancelFullScreen = function(el) {
			return this.prefix === '' ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
		};
	}

	return fullScreenApi;	
}());
