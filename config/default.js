const pkg = require('../package.json');

module.exports = {
    app: {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
    },
    server: {
        port: 9999,
    },
};