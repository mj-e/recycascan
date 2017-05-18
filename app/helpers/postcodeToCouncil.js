const axios = require('axios');

function postcodeToCouncil(str) {

    if (str.length > 7 || str.length < 5) return 'Invalid postcode';
    let code;
    if (str.match(/\s/)) {
        code = str.match(/^\S*/)[0].toUpperCase();
    } else {
        code = str.length > 5 ? str.slice(0, 3).toUpperCase() : str.slice(0, 2).toUpperCase();
    }

    return axios
        .get('https://vast-eyrie-43528.herokuapp.com/api/postcodes')
        .then(function (res) {
            return res.data.postcode.find(key => key.postcode === code).council;
        })
        .catch(function (err) {
            console.log(err);
        });
}

module.exports = postcodeToCouncil;