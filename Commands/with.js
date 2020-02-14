// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Event Module
module.exports = {
    // Command Script
    async execute(client, config, f, from, msg, args, raw) {
        // Check If Has Last
        if (!(userLast.has(from))) return client.say(from, 'No previous maps were found, try doing /np then run the command again');
        if (!(args[0])) return client.say(from, 'No mods were entered, you can use EZ, NF, HT, HR, DT, HD or FL. Eg: !with HDDT');

        // Get Map ID and Mod Codes
        let previous = userLast.get(from);
        let withMods = f.modCode(args[0]);

        // Temp Way
        axios.get('https://osu.ppy.sh/api/get_beatmaps', {
            params: { k: config.user.key, b: previous, m: 2, a: 1, type: 'string', limit: 1, mods: withMods }
        })
        .then(function (response) {
            let mapInfo = response.data[0];
        
            let stars = mapInfo.difficultyrating;
            let approachRate = mapInfo.diff_approach;
            let maxCombo = mapInfo.max_combo;
        
            let estPP = f.calculateEstPP(stars, approachRate, maxCombo, args[0]);
            client.say(from, '(CTB) ' + mapInfo.artist + ' - ' + mapInfo.title + ' [' + mapInfo.version + '] +' + args[0] + ' | 95%: ' + estPP[0] + 'pp | 98%: ' + estPP[1] + 'pp | 99%: ' + estPP[2] + 'pp | 100%: ' + estPP[3] + 'pp');
        })
        .catch(function (error) {
            console.log(error);
            client.say(from, 'Hmm, I am having trouble finding that map, try again later!');
        });

    }
};