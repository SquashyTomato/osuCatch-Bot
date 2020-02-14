/* * * * * * * * * * * * * * * * * * * * *
 *          Tomato osu! IRC Bot          *
 * * * * * * * * * * * * * * * * * * * * *
 *    Copyright(c) 2019 SquashyTomato    *
 *   Unauthorized copying of this file   */

// Strict Mode
'use strict';

// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Utilities
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const packageFile = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const f = require('./functions.js');
const e = (event) => require('./Events/' + event);
const client = new irc.Client('irc.ppy.sh', config.user.username,  { password: config.user.password, autoConnect: false,  autoRejoin: false, debug: false, showErrors: false });

// Data Keeping
global.callAmount = 0;
global.userLast = new Map();

// Print Header
f.printHeader(packageFile);

// Load Events
try {
    // Registered Event
    client.addListener('registered', async (msg) => e('registered')(client, config, f, msg));
    // Error Event
    client.addListener('error', async (err) => e('error')(client, config, f, err));
    // PM Event
    client.addListener('pm', async (from, msg) => e('pm')(client, config, f, from, msg));
    // Action Event
    client.addListener('action', async (channel, from, msg) => e('action')(client, config, f, channel, from, msg));
} catch (err) {
    // If Cant Load Event
    console.log(chalk.bgRed('ERROR') + ' Unable To Load Event!\n' + err);
}

// Check Call Amount
setInterval(() => {
    if (callAmount > 5) {
        console.log(chalk.bgYellow('NOTICE') + ' Limit Reached, reconnecting...');
        f.reconnect(client, 0);
    }
}, 5000);

// Reset Call Amount Every 15 Seconds
setInterval(() => {
    callAmount = 0;
}, 15000);

// Connect IRC
f.connect(client, 0);