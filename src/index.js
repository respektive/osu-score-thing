const { app, BrowserWindow, ipcRenderer, ipcMain} = require('electron');
const path = require('path');
const osu = require('node-osu');
const fs = require('fs-extra');
const firstRun = require('electron-first-run');
const isFirstRun = firstRun();
const { profile, error } = require('console');
const Store = require('electron-store');

const store = new Store();

	ipcMain.on('username', (event, arg) => {
		store.set('username', arg);
	});
	ipcMain.on('apikey', (event, arg) => {
		store.set('apikey', arg);
	});
	ipcMain.on('mode', (event, arg) => {
		store.set('mode', arg);
	});
	ipcMain.on('showLevel', (event, arg) => {
		store.set('showLevel', arg);
	});
	ipcMain.on('showRankedscore', (event, arg) => {
		store.set('showRankedscore', arg);
	});
	ipcMain.on('showTotalscore', (event, arg) => {
		store.set('showTotalscore', arg);
	});
	ipcMain.on('showPprank', (event, arg) => {
		store.set('showPprank', arg);
	});
	ipcMain.on('showCountryrank', (event, arg) => {
		store.set('showCountryrank', arg);
	});
	ipcMain.on('showPp', (event, arg) => {
		store.set('showPp', arg);
	});
	ipcMain.on('showAcc', (event, arg) => {
		store.set('showAcc', arg);
	});
	ipcMain.on('showPlaycount', (event, arg) => {
		store.set('showPlaycount', arg);
	});
	ipcMain.on('showPlaytime', (event, arg) => {
		store.set('showPlaytime', arg);
	});
	ipcMain.on('showTopplay', (event, arg) => {
		store.set('showTopplay', arg);
	});
	ipcMain.on('showArank', (event, arg) => {
		store.set('showArank', arg);
	});
	ipcMain.on('showSrank', (event, arg) => {
		store.set('showSrank', arg);
	});
	ipcMain.on('showShrank', (event, arg) => {
		store.set('showShrank', arg);
	});
	ipcMain.on('showSsrank', (event, arg) => {
		store.set('showSsrank', arg);
	});
	ipcMain.on('showSshrank', (event, arg) => {
		store.set('showSshrank', arg);
	});
	ipcMain.on('showTotals', (event, arg) => {
		store.set('showTotals', arg);
	});
	ipcMain.on('showTotalss', (event, arg) => {
		store.set('showTotalss', arg);
	});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow = '';

if (isFirstRun !== true) {



app.on('ready', function () {


  // Create the browser window.
	mainWindow = new BrowserWindow({
    width: store.get('width'),
    height: store.get('height'),
	minWidth: 420,
	frame: false,
	icon: __dirname + '/icon.ico',
	webPreferences: {
		nodeIntegration: true,
		contextIsolation: false,
		enableRemoteModule: true
	}
  });


 

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
/*   mainWindow.webContents.openDevTools(); */


  const osuApi = new osu.Api( store.get('apikey') , {
	// baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
	notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
	completeScores: false, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
	parseNumeric: false // Parse numeric values into numbers/floats, excluding ids
});

function seconds2time (seconds) {
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);
    var time = "";

    if (hours != 0) {
      time = hours+"h ";
    }
    if (minutes != 0 || time !== "") {
      minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
      time += minutes+"m ";
    }
    if (time === "") {
      time = seconds+"s";
    }
    else {
      seconds = (seconds < 10) ? "0"+seconds : String(seconds);
	  time += seconds+"s";
    }
    return time;
}

const documentsPath = app.getPath('documents') + '/osu!scorething/'

var formatter = new Intl.NumberFormat('en-US');

let playcount_old = '';
let playcount = '';
let rankedscore_old = '';
let rankedscore = '';
let level = '';
let level_old = '';
let totalscore = '';
let totalscore_old = '';
let acc = '';
let acc_old = '';
let rank_a = '';
let rank_a_old = '';
let rank_s = '';
let rank_s_old = '';
let rank_sh = '';
let rank_sh_old = '';
let rank_ss = '';
let rank_ss_old = '';
let rank_ssh = '';
let rank_ssh_old = '';
let total_ss = '';
let total_ss_old = '';
let total_s = '';
let total_s_old = '';
let playtime = '';
let playtime_old = '';
let pp_rank = '';
let pp_rank_old = '';
let country_rank = '';
let country_rank_old = '';
let pp = '';
let pp_old = '';
let top_play = '';
let top_play_old = '';

let profile = '';


async function getUser() {
	try {
		let user = await osuApi.getUser({ m: store.get('mode'), u: store.get('username') });
		return user;
	} catch (error) {
		console.error(error);
	}
};


async function getUserBest() {
	try {
		let userBest = await osuApi.getUserBest({ m: store.get('mode'), u: store.get('username') })
		return userBest;
	} catch (error) {
		console.error(error);
	}
}

function updateUser() {
	getUser().then(user => {
		profile = user
		playcount = user.counts.plays
		playtime = user.secondsPlayed
		rankedscore = user.scores.ranked
		level = user.level
		totalscore = user.scores.total
		acc = user.accuracy
		rank_a = user.counts.A
		rank_s = user.counts.S
		rank_sh = user.counts.SH
		rank_ss = user.counts.SS
		rank_ssh = user.counts.SSH
		total_ss = parseInt(user.counts.SS) + parseInt(user.counts.SSH)
		total_s = parseInt(user.counts.S) + parseInt(user.counts.SH)
		pp_rank = user.pp.rank
		country_rank = user.pp.countryRank
		pp = user.pp.raw
	})
	getUserBest().then(userBest => {
		top_play = userBest[0].pp
	})
};

getUser().then(user => {
	playcount_old = user.counts.plays
	playtime_old = user.secondsPlayed
	rankedscore_old = user.scores.ranked
	level_old = user.level
	totalscore_old = user.scores.total
	acc_old = user.accuracy
	rank_a_old = user.counts.A
	rank_s_old = user.counts.S
	rank_sh_old = user.counts.SH
	rank_ss_old = user.counts.SS
	rank_ssh_old = user.counts.SSH
	total_ss_old = parseInt(user.counts.SS) + parseInt(user.counts.SSH)
	total_s_old = parseInt(user.counts.S) + parseInt(user.counts.SH)
	pp_rank_old = user.pp.rank
	country_rank_old = user.pp.countryRank
	pp_old = user.pp.raw
})

getUserBest().then(userBest => {
	top_play_old = userBest[0].pp
})



	mainWindow.webContents.on('did-finish-load', ()=>{
		setInterval(() => {

			updateUser();

			if (profile == undefined) {
				return;
			} else {

			mainWindow.webContents.send('username', profile.name)

			mainWindow.webContents.send('level', formatter.format(level));
			mainWindow.webContents.send('rankedscore', formatter.format(rankedscore));
			mainWindow.webContents.send('totalscore', formatter.format(totalscore));
			mainWindow.webContents.send('pp_rank', formatter.format(pp_rank));
			mainWindow.webContents.send('country_rank', formatter.format(country_rank));
			mainWindow.webContents.send('pp', formatter.format(pp));
			mainWindow.webContents.send('acc', formatter.format(acc));
			mainWindow.webContents.send('playcount', formatter.format(playcount));
			mainWindow.webContents.send('playtime', seconds2time(playtime));
			mainWindow.webContents.send('top_play', formatter.format(top_play));
			mainWindow.webContents.send('rank_a', formatter.format(rank_a));
			mainWindow.webContents.send('rank_s', formatter.format(rank_s));
			mainWindow.webContents.send('rank_sh', formatter.format(rank_sh));
			mainWindow.webContents.send('rank_ss', formatter.format(rank_ss));
			mainWindow.webContents.send('rank_ssh', formatter.format(rank_ssh));		
			mainWindow.webContents.send('total_s', formatter.format(total_s));
			mainWindow.webContents.send('total_ss', formatter.format(total_ss));

			mainWindow.webContents.send('levelchange', formatter.format(level - level_old));
			mainWindow.webContents.send('rankedscorechange', formatter.format(rankedscore - rankedscore_old));
			mainWindow.webContents.send('totalscorechange', formatter.format(totalscore - totalscore_old));
			mainWindow.webContents.send('pp_rank_change', formatter.format(pp_rank - pp_rank_old));
			mainWindow.webContents.send('country_rank_change', formatter.format(country_rank - country_rank_old));
			mainWindow.webContents.send('ppchange', formatter.format(pp - pp_old));
			mainWindow.webContents.send('accchange', formatter.format(acc - acc_old));
			mainWindow.webContents.send('playcountchange', formatter.format(playcount - playcount_old));
			mainWindow.webContents.send('playtimechange', seconds2time(playtime - playtime_old));
			mainWindow.webContents.send('top_play_change', formatter.format(top_play - top_play_old));
			mainWindow.webContents.send('rank_a_change', formatter.format(rank_a - rank_a_old));
			mainWindow.webContents.send('rank_s_change', formatter.format(rank_s - rank_s_old));
			mainWindow.webContents.send('rank_sh_change', formatter.format(rank_sh - rank_sh_old));
			mainWindow.webContents.send('rank_ss_change', formatter.format(rank_ss - rank_ss_old));
			mainWindow.webContents.send('rank_ssh_change', formatter.format(rank_ssh - rank_ssh_old));
			mainWindow.webContents.send('total_s_change', formatter.format(total_s - total_s_old));
			mainWindow.webContents.send('total_ss_change', formatter.format(total_ss - total_ss_old));
		
			fs.outputFile(documentsPath + 'level.txt', formatter.format(level), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rankedscore.txt', formatter.format(rankedscore), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'totalscore.txt', formatter.format(totalscore), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'acc.txt', formatter.format(acc), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'playcount.txt', formatter.format(playcount), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'playtime.txt', seconds2time(playtime), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_a.txt', formatter.format(rank_a), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_s.txt', formatter.format(rank_s), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_sh.txt', formatter.format(rank_sh), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_ss.txt', formatter.format(rank_ss), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_ssh.txt', formatter.format(rank_ssh), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'total_ss.txt', formatter.format(total_ss), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'total_s.txt', formatter.format(total_s), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'pprank.txt', formatter.format(pp_rank), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'countryrank.txt', formatter.format(country_rank), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'pp.txt', formatter.format(pp), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'topplay.txt', formatter.format(top_play), err => {if (err) {console.error(err); return}});

			fs.outputFile(documentsPath + 'levelchange.txt', formatter.format(level - level_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rankedscorechange.txt', formatter.format(rankedscore - rankedscore_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'totalscorechange.txt', formatter.format(totalscore - totalscore_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'accchange.txt', formatter.format(acc - acc_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'playcountchange.txt', formatter.format(playcount - playcount_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'playtimechange.txt', seconds2time(playtime - playtime_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_a_change.txt', formatter.format(rank_a - rank_a_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_s_change.txt', formatter.format(rank_s - rank_s_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_sh_change.txt', formatter.format(rank_sh - rank_sh_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_ss_change.txt', formatter.format(rank_ss - rank_ss_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'rank_ssh_change.txt', formatter.format(rank_ssh - rank_ssh_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'total_ss_change.txt', formatter.format(total_ss -total_ss_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'total_s_change.txt', formatter.format(total_s - total_s_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'pprankchange.txt', formatter.format(pp_rank - pp_rank_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'countryrankchange.txt', formatter.format(country_rank - country_rank_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'ppchange.txt', formatter.format(pp - pp_old), err => {if (err) {console.error(err); return}});
			fs.outputFile(documentsPath + 'topplaychange.txt', formatter.format(top_play - top_play_old), err => {if (err) {console.error(err); return}});
			var size   = mainWindow.getSize();
			var width  = size[0];
			var height = size[1];
			store.set('width', width);
			store.set('height', height);
			}
		}, 5000);
		
		mainWindow.webContents.send('levelState', store.get('showLevel'));
		mainWindow.webContents.send('rankedscoreState', store.get('showRankedscore'));
		mainWindow.webContents.send('totalscoreState', store.get('showTotalscore'));
		mainWindow.webContents.send('pprankState', store.get('showPprank'));
		mainWindow.webContents.send('countryrankState', store.get('showCountryrank'));
		mainWindow.webContents.send('ppState', store.get('showPp'));
		mainWindow.webContents.send('accState', store.get('showAcc'));
		mainWindow.webContents.send('playcountState', store.get('showPlaycount'));
		mainWindow.webContents.send('playtimeState', store.get('showPlaytime'));
		mainWindow.webContents.send('topplayState', store.get('showTopplay'));
		mainWindow.webContents.send('rankaState', store.get('showArank'));
		mainWindow.webContents.send('ranksState', store.get('showSrank'));
		mainWindow.webContents.send('rankshState', store.get('showShrank'));
		mainWindow.webContents.send('rankssState', store.get('showSsrank'));
		mainWindow.webContents.send('ranksshState', store.get('showSshrank'));
		mainWindow.webContents.send('totalsState', store.get('showTotals'));
		mainWindow.webContents.send('totalssState', store.get('showTotalss'));


		mainWindow.webContents.send('apikey', store.get('apikey'));
		mainWindow.webContents.send('usernameinput', store.get('username'));
		mainWindow.webContents.send('mode', store.get('mode'));

	});

});

} else {
	app.on('ready', function () {

		  mainWindow = new BrowserWindow({
		  width: 400,
		  height: 300,
		  icon: __dirname + '/icon.ico',
		  webPreferences: {
			  nodeIntegration: true,
			  contextIsolation: false,
			  enableRemoteModule: true
		  }
		});

		mainWindow.loadFile(path.join(__dirname, 'firstrun.html'));

		store.set('width', 420);
		store.set('height', 640);

	});
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


