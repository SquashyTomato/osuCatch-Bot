// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Event Module
module.exports = (client, config, f, from, msg) => {
    // Command Variables
    let command = msg.split(' ')[0];
    command = command.slice(config.general.prefix.length);
    let args = msg.split(' ').slice(1);
    let raw = msg.split(' ').slice(1).join(' ');

    // Check If Message Has prefix
    if (!msg.startsWith(config.general.prefix)) return;

    // Execute Command
    try {
        require('../Commands/' + command).execute(client, config, f, from, msg, args, raw);
        console.log(chalk.bgCyan('LOG') + ' ' + from + ': ' + msg);
    } catch (err) {
        // Catch Errors
        if (err.message.startsWith('Cannot find module')) return;
        console.log(chalk.bgRed('ERROR') + ' ' + err);
    }
};