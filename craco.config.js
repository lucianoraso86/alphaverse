const path = require('path');

module.exports = function({ env, paths }) {
  return {
    babel: {
      plugins: [
        ["babel-plugin-jsx-display-if"]
      ]
    },
    webpack: {
    },
  }
}