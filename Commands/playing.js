// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Event Module
module.exports = {
    // Command Script
    async execute(client, config, f, from, msg, args, raw) {
        client.say(from, 'The human tomato must be online! :O - I do use this account so feel free to say hi or expect random responses ;)');
    }
};