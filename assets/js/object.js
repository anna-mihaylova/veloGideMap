const OBJECT = (function() {

    class Object {

        constructor(map, name, contact, latitude, longitude, type) {
            this.$map = map;
            this.name = name;
            this.contact = contact;
            this.latitude = latitude;
            this.longitude = longitude;
            this.type = type;
            this.icon;
        }

        pinImage() {
            if (this.type === 'parking') {
                return this.icon = './assets/images/parking.png'
            }
            if (this.type === 'service') {
                return this.icon = './assets/images/service.png'
            }
            if (this.type === 'rent') {
                return this.icon = './assets/images/rent.png'
            } if (this.type === 'user') {
                return this.icon = './assets/images/user.png'
            } else {
                 throw new Error("This is non-existing type.")
            }
        }

        createPin() {
            let self = this;
            let myLatlng = new google.maps.LatLng(this.latitude, this.longitude);
            let marker = new google.maps.Marker({
                position: myLatlng,
                map: this.$map,
                icon: this.icon,
                animation: google.maps.Animation.DROP,
                title: this.name
            });

            let contentString = '<div id="content">' +
                `<h1 class='name'>${this.name}</h1> ` +
                `<p class="type">${this.type}</p>` +
                `<a class='contact' target="_blank" href=${this.contact}>${this.contact}</a>` +
                '</div>';

            let infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

            return marker;
        }
    }

    let init = function(map, name, contact, latitude, longitude, type) {
        let object = new Object(map, name, contact, latitude, longitude, type);
        object.pinImage();
        return object.createPin();
    }

    return {
        init: init
    }

})();
