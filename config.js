const global = {
    encode: 6,
    encodeCode: function(code) {
        let encoded = code.toString();
        for (let i = 0; i < this.encode; i++) {
            encoded = btoa(encoded);
        }
        return encoded;
    },
    decodeCode: function(encoded) {
        let decoded = encoded;
        for (let i = 0; i < this.encode; i++) {
            decoded = atob(decoded);
        }
        return parseInt(decoded);
    },
    getUrlParameter: function(name) {
        if (typeof window !== 'undefined') {
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
            var results = regex.exec(window.location.href);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        } else {
            throw new Error('getUrlParameter is only supported in a browser environment');
        }
    }
};

export default global;