const tmi = require('tmi.js');
const wr = require('./wr.js')
const fs = require('fs')
const request = require('request')

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

var chan_id;

request({
  headers: {
    'Accept': 'application/vnd.twitchtv.v5+json',
    'Client-ID': 'kvv1z3bd46uoyqkg64ccfg58p5u3bb'
  },
  uri: 'https://api.twitch.tv/kraken/users?login=' + process.env.CHANNEL_NAME,
  method: 'GET'
  },function(err, res, body) {
    chan_id = JSON.parse(body).users[0]._id;
  }
);

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
    if(splittedMsg.length < 3) {
      client.say(target, "Invalid arguments number");
    }
    else {
      WRs.WRs.push({
        src_link: splittedMsg[1],
        display_in_title: splittedMsg[2],
        subcategory: splittedMsg[3]
      })
      fs.writeFileSync("./WRs.json", JSON.stringify(WRs));
      client.say(target, "Saved WR");
    }
  }
  else if (splittedMsg[0] === '!wr') {
    console.log(WRs);
    request({
      headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': 'kvv1z3bd46uoyqkg64ccfg58p5u3bb'
      },
      uri: 'https://api.twitch.tv/kraken/channels/' + chan_id,
      method: 'GET'
    },function(err, res, body) {
      var title = JSON.parse(body).status;
      var WR_to_display;
      WRs.WRs.some(function(value) {
        if(title.includes(value.display_in_title)) {
          WR_to_display = value;
          return true;
        }
      })
      if(typeof(WR_to_display) === "undefined") {
        client.say(target, "No WR found for this stream title");
      }
      else {
        wr.getWR(WR_to_display.src_link, WR_to_display.subcategory).then(function(result) {
          client.say(target, result);
        })
      }
    });
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
