module.exports = {
    "extends": ["airbnb-base"],
    "rules": {
      "no-console": ["error", { "allow": ["warn", "error", "log", "time", "timeEnd"]}],
      "no-nested-ternary" : "off"
    },
    "env": {
      "jest": true
    }
};
