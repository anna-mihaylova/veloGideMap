const USER = (function() {

    class User {
        constructor($map, $options) {
            this.location = {
                latitude: 0,
                longitude: 0
            };

            this.$map = $map;
            this.$options = $options;
        }

        createMap(latitude, longitude) {
            this.map = MAP.init(this.$map, this.$options, latitude, longitude);
        }

        geolocFail() {
            this.map = MAP.init(this.$map, this.$options, 42.680198, 23.301581);
        }

        getLocation() {
            let self = this;
            if (navigator.geolocation) {
                let location_timeout = setTimeout("geolocFail()", 10000);

                navigator.geolocation.getCurrentPosition(function(position) {
                    clearTimeout(location_timeout);

                    self.location['latitude'] = position.coords.latitude;
                    self.location['longitude'] = position.coords.longitude;

                    return self.createMap(self.location['latitude'], self.location['longitude']);
                }, function(error) {
                    clearTimeout(location_timeout);
                    alert('It is not allowed to identify your location, then it shows the Indigo Verge location.')
                    self.geolocFail();
                });
            } else {
                alert('Geolocation is not supported by this browser, then it shows the Indigo Verge location.')
                self.geolocFail();
            }
        }
    }

    let init = function($map, $options) {
        let user = new User($map, $options);
        user.getLocation();
    }

    return {
        init: init
    }

})();
