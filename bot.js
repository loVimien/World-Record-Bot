const tmi = require('tmi.js');
const wr = require('./wr.js')
const fs = require('fs')

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

  // Remove whitespace from chat message
  const splittedMsg = msg.trim().split("|");

  // If the command is known, let's execute it
  if (splittedMsg === '!wrAdd' && context.mod) {
    if(splittedMsg.length != 3) {
      client.say("Invalid arguments number");
    }
    else {
      fs.ReadFile('./WRs.json', 'utf8', function(data) {
        var wr_data = JSON.parse(data);
        wr_data.WRs.push({
          src_link: splittedMsg[1],
          display_in_title: splittedMsg[2]
        });
        fs.writeFile("./WRs.json", JSON.stringify(wr_data), function(err) {
          if(err) {
            console.log("* Error : " + err);
          }
          else {
            WRs.push({
              src_link: splittedMsg[1],
              display_in_title: splittedMsg[2]
            })
            client.say("Saved WR");
          }
        });
      });
    }
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
