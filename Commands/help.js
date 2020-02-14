// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Event Module
module.exports = {
    // Command Script
    async execute(client, config, f, from, msg, args, raw) {
        client.say(from, 'I am the bot that has stolen Tomato\'s account! I dont do much but I can help calculate estimated pp for catch maps, just /np me something!');
    }
};