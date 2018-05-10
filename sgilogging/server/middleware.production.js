
var whitelist = ['https://servizi.gov.it',
    'https://beta.servizi.gov.it',
    'https://beta-servizi.gov.it',
    'https://beta-servizi-stage2.gov.it',
    'https://beta.servizi.xxxx',
    'https://beta-servizi.xxxx',
    'https://beta-servizi-stage2.xxxx',
    'https://sgiservice.xxxx'];
module.exports = {
    "initial": {
        "cors": {
            "params": {
                "origin": function (origin, callback) {
                    if (whitelist.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                }
            }
        }
    }
};