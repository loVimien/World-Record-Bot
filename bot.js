const tmi = require('tmi.js');
const wr = require('./wr.js')
const fs = require('fs')
const https = require('https')

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

var WRs = JSON.parse(fs.readFileSync("./WRs.json"));

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  console.log("* Received message")
  // Remove whitespace from chat message
  const splittedMsg = msg.trim().split("|");

  // If the command is known, let's execute it
  if (splittedMsg[0] === '!wrAdd') {
    if(splittedMsg.length != 3) {
      client.say(target, "Invalid arguments number");
    }
    else {
      WRs.WRs.push({
        src_link: splittedMsg[1],
        display_in_title: splittedMsg[2]
      })
      fs.writeFileSync("./WRs.json", JSON.stringify(WRs));
      client.say(target, "Saved WR");
    }
  }
  else if (splittedMsg[0] === '!wr') {
    console.log(WRs);
    wr.getWR(WRs.WRs[0].src_link).then(function(result) {
      client.say(target, result);
    })
  }
  else if(splittedMsg[0] === '!debugInfo') {
    https.request({
      host: 'api.twitch.tv',
      port: 443,
      path: '/kraken/channel',
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': 'kvv1z3bd46uoyqkg64ccfg58p5u3bb'
      }
    },function(res) {
      var raw = ''
      res.on('data', function(d) {
        raw += d;
      })
      .on('end', function(){
        console.log(raw);
      })
    })
  }
  
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
