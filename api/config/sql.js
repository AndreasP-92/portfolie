const mysql = require('mysql2');

module.exports = {
    'connect': () => {
        return mysql.createConnection({
            'host': '207.154.211.14',
            'user': 'root',
            'password': '4321',
            'database': 'hifi'
        });
    }
};