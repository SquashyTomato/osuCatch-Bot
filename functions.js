// Node Modules
const irc = require('irc-upd');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

// Utilities
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const packageFile = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

module.exports = {
    printHeader(packageFile) {
        console.log(chalk.magenta('.  o ..'));
        console.log(chalk.magenta('o . o o.o'));
        console.log(chalk.magenta('     ...oo'));
        console.log(chalk.magenta('       __[]__'));
        console.log(chalk.magenta('    __|_o_o_o\__'));
        console.log(chalk.magenta('    \\""""""""""/'));
        console.log(chalk.magenta('     \\. ..  . /'));
        console.log(chalk.magenta('^^^^^^^^^^^^^^^^^^^^'));
        console.log(chalk.red('Tomato Bot v' + packageFile.version));
        console.log(chalk.gray('--------------------'));
    },
    connect(client, count) {
        console.log(chalk.bgYellow('NOTICE') + ' Connecting to Chat...');
        try {
            client.connect(count);
        } catch (err) {
            console.log(chalk.bgRed('ERROR') + ' Unable to connect!\n' + err);
        }
    },
    disconnect(client) {
        try {
            client.disconnect();
        } catch (err) {
            console.log(chalk.bgRed('ERROR') + ' Unable to disconnect!\n' + err);
        }
        console.log(chalk.bgYellow('NOTICE') + ' Disconnected From Chat...');
    },
    reconnect(client, count) {
        this.disconnect(client);
        callAmount = 0;
        setTimeout(() => {
            this.connect(client, count);
        }, 30000);
    },
    getMap(mapID, channel) {
        // Console Log
        console.log(chalk.bgCyan('LOG') + ' Getting Map Details For ' + channel + ': ' + mapID);

        // osu! API Call
        let result;
        axios.get('https://osu.ppy.sh/api/get_beatmaps', {
            params: { k: config.user.key, b: mapID, m: 2, a: 1, type: 'string', limit: 1 }
        })
        .then(function (response) {
            result = response.data;
        })
        .catch(function (error) {
            result = 'ERROR';
        });
        return result;
    },
    calculateEstPP(stars, approachRate, combo, mods) {
        var final = [];

        final[0] = this.calculatePP(stars, approachRate, combo, combo, 95, 0, mods);
        final[1] = this.calculatePP(stars, approachRate, combo, combo, 98, 0, mods);
        final[2] = this.calculatePP(stars, approachRate, combo, combo, 99, 0, mods);
        final[3] = this.calculatePP(stars, approachRate, combo, combo, 100, 0, mods);

        return final;
    },
    calculatePP(stars, approachRate, maxCombo, playerCombo, accuracy, missCount, mods) {
        if (mods) {
            if (mods.includes('DT')) {
                let ms;
                if (approachRate > 5) ms = 200 + (11 - approachRate) * 100;
	            else ms = 800 + (5 - approachRate) * 80;
                
	            if (ms < 300) approachRate = 11;
	            else if (ms < 1200) approachRate = Math.round((11 - (ms - 300) / 150) * 100) / 100;
	            else approachRate = Math.round((5 - (ms - 1200) / 120) * 100) / 100;
            } else if (mods.includes('HT')) {
                if (approachRate > 5) ms = 400 + (11 - approachRate) * 200;
	            else ms = 1600 + (5 - approachRate) * 160;
                
	            if (ms < 600) approachRate = 10;
	            else if (ms < 1200) approachRate = Math.round((11 - (ms - 300) / 150) * 100) / 100;
	            else approachRate = Math.round((5 - (ms - 1200) / 120) * 100) / 100;
            }
        }

        let final;
        final = Math.pow(((5*(stars)/ 0.0049)-4),2)/100000;
        var lengthbonus = (0.95 + 0.4 * Math.min(1.0, maxCombo / 3000.0) + (maxCombo > 3000 ? Math.log10(maxCombo / 3000.0) * 0.5 : 0.0));
        final *= lengthbonus;
	    final *= Math.pow(0.97, missCount);
	    final *= Math.pow(playerCombo / maxCombo, 0.8);
	    if (approachRate > 9) final *= 1 + 0.1 * (approachRate - 9.0);
	    if (approachRate < 8) final *= 1 + 0.025 * (8.0 - approachRate);
	    final *=  Math.pow(accuracy / 100, 5.5);
        final = Math.round(100 * final) / 100;

        if (mods) {
            if (mods.includes('HD') && mods.includes('FL')) {
                final = Math.round(100 * final * 1.35 * lengthbonus * (1.05 + 0.075 * (10.0 - Math.min(10, approachRate)))) / 100;
            } else if (mods.includes('HD')) {
                final = Math.round(100 * final * (1.05 + 0.075 * (10.0 - Math.min(10, approachRate)))) / 100;
            } else if (mods.includes('FL')) {
                final = Math.round(100 * final * 1.35 * lengthbonus) / 100;
            }
        }

        return final;
    },
    modCode(mods) {
        let modNo = 0;

        if (mods.includes('EZ')) modNo = modNo + 2;
        if (mods.includes('NF')) modNo = modNo + 1;
        if (mods.includes('HT')) modNo = modNo + 256;
        if (mods.includes('HR')) modNo = modNo + 16;
        if (mods.includes('DT')) modNo = modNo + 64;
        if (mods.includes('HD')) modNo = modNo + 8;
        if (mods.includes('FL')) modNo = modNo + 1024;

        return modNo;
    }
}