// Common utilities

// Capitalize: capitalizes the first letter of a single word
var Utils = {
  Capitalize: function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

module.exports = Utils;
