import stuffs from './config.js';

export const encodeCode = function(code) {
    let encoded = code.toString();
    for (let i = 0; i < stuffs.encode; i++) {
        encoded = btoa(encoded);
    }
    return encoded;
  };
  
  export const decodeCode = function(encoded) {
    let decoded = encoded;
    for (let i = 0; i < stuffs.encode; i++) {
        decoded = atob(decoded);
    }
    return parseInt(decoded);
  };
  
  export const getUrlParameter = function(name) {
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
  };