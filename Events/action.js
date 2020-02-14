// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Event Module
module.exports = (client, config, f, channel, from, msg) => {
    // Check That Channel Is DM
    if (channel.startsWith('#')) return;

    // Check If Action Is Now Playing
    let actionType = msg.split(' ')[1];

    if (actionType == 'playing' || actionType == 'listening' || actionType == 'watching') {
        // Get osu! Beatmmap URL
        let mapURL;
        if (actionType == 'listening') mapURL = msg.split(' ')[3].substr(1);
        else mapURL = msg.split(' ')[2].substr(1);
        // Check If Map Has URL
        if (!(mapURL.startsWith('https://osu.ppy.sh/b/'))) return client.say(channel, 'Looks like this map hasn\'t been submmitted :/');

        // Get osu! Beatmmap ID
        let mapID = mapURL.substr(21);

        // Increase Calls & Last Map
        callAmount++;
        userLast.set(channel, mapID);
        
        // Get Map Details

        // Need to fix this smh
        //f.getMap(mapID, channel)
        //.then(map => {
        //    let stars = map.difficultyrating;
        //    let approachRate = map.diff_approach;
        //    let maxCombo = map.max_combo;
        //
        //    let estPP = f.calculateEstPP(stars, approachRate, maxCombo);
        //    client.say(channel, '(CTB) ' + map.artist + ' - ' + map.title + ' [' + map.version + '] | 95%: ' + estPP[0] + 'pp | 98%: ' + estPP[1] + 'pp | 99%: ' + estPP[2] + 'pp | 100%: ' + estPP[3] + 'pp');
        //});

        // Temp Way
        axios.get('https://osu.ppy.sh/api/get_beatmaps', {
            params: { k: config.user.key, b: mapID, m: 2, a: 1, type: 'string', limit: 1 }
        })
        .then(function (response) {
            let mapInfo = response.data[0];
        
            let stars = mapInfo.difficultyrating;
            let approachRate = mapInfo.diff_approach;
            let maxCombo = mapInfo.max_combo;
        
            let estPP = f.calculateEstPP(stars, approachRate, maxCombo);
            client.say(channel, '(CTB) ' + mapInfo.artist + ' - ' + mapInfo.title + ' [' + mapInfo.version + '] | 95%: ' + estPP[0] + 'pp | 98%: ' + estPP[1] + 'pp | 99%: ' + estPP[2] + 'pp | 100%: ' + estPP[3] + 'pp');
        })
        .catch(function (error) {
            console.log(error);
            client.say(channel, 'Hmm, I am having trouble finding that map, try again later!');
        });
    }
};