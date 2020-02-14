// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Event Module
module.exports = (client, config, f, err) => {
    // Get rid of error that hasn't been fixed by irc-upd devs yet
    if (err.message == 'Cannot read property \'trim\' of undefined') return;

    console.log(chalk.bgRed('ERROR') + ' ' + err);
};