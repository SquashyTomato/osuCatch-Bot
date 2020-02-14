// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Event Module
module.exports = (client, config, f, msg) => {
    console.log(chalk.bgGreen('SUCCESS') + ' Logged in!');
    console.log(chalk.bgMagenta('SERVER') + ' ' +  msg.server + ': ' + msg.args[1]);
};