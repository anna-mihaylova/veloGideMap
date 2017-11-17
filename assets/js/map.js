const MAP = (function() {

    class Map {

        constructor(canvas, $filter, latitude, longitude) {
            this.location = {
                latitude: latitude,
                longitude: longitude
            };

            this.latLng = new google.maps.LatLng(this.location['latitude'], this.location['longitude']);;
            this.canvas = canvas;
            this.filter = $filter.options[$filter.selectedIndex].value;
            this.options = {
                center: this.latLng,
                zoom: 12,
                mapTypeId: 'satellite'
            };
            this.requestURL = 'http://velo-guide-rest.azurewebsites.net/api/geopoints';
            this.objects;
            this.map;
            this.markers = [];
        }

        initMap() {
            this.map = new google.maps.Map(this.canvas, this.options);
        }

        changeHash() {
            $(function() {
                $('#options').change(function() {
                    let url = $(this).val();
                    window.location.hash = url;
                    console.log('select Changed');
                });
            });

            window.addEventListener('hashchange', fn, false);

            window.onload = fn;

            function fn() {
                $('#options').val(window.location.hash.replace('#', ''));
                console.log("hash = " + window.location.hash);
            }
        }

        sendAjax() {
            let self = this;

            $.ajax({
                type: 'GET',
                url: this.requestURL,
                cache: true
            }).done(function(data) {
                self.createObjects(data);
            }).fail(function() {
                self.sendAjax()
            });
        }

        createObjects(responses) {
            this.deleteAllMarkers();
            let contact;
            let self = this;

            if (responses) {
                this.objects = responses;
            }

            let filterObjects = this.objects.filter(function(object) {
                return object.type === self.filter;
            });

            if (filterObjects.length == 0) {
                filterObjects = this.objects;
            }

            for (let variable of filterObjects) {
                contact = variable['contact'] === null ? 'coming soon' : variable['contact'];
                this.markers.push(OBJECT.init(self.map, variable['name'], contact, variable['latitude'], variable['longitude'], variable['type']))
            }

            this.markers.push(OBJECT.init(self.map, 'you', 'coming soon', self.location['latitude'], self.location['longitude'], 'user'))
        }

        deleteAllMarkers() {
            for (let i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
            this.markers.length = 0;
        }

        bindEvents() {
            let self = this;

            window.addEventListener('hashchange', function() {
                let hash = location.hash.replace(/^#/, '');
                self.filter = hash;
                self.createObjects();
            }, false);
        }
    }


    let init = function(canvas, filter, latitude, longitude) {
        let map = new Map(canvas, filter, latitude, longitude);
        map.bindEvents();
        map.initMap();
        map.sendAjax();
        map.changeHash();
        return map;
    }

    return {
        init: init
    }

})();
