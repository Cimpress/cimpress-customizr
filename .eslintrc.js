module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "mocha": true
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
        }
    },
    "plugins": [
    ],
    "extends": [
        "eslint:recommended",
        "google"
    ],
    "rules": {
        "indent": ["error", 4],
        "require-jsdoc": ["off"],
        "max-len": ["off", 160]
    }
};