const APP = (function() {

    let instance = null;

    class App {
        constructor() {
            if (!instance) {
                instance = this;
            }
            this.$map = document.getElementById('map');
            this.options = document.getElementById('options');
            this.user = USER.init(this.$map, this.options);
            return instance;
        }
    }

    let init = function() {
        let app = new App();
    }

    return {
        init: init
    }

})();
