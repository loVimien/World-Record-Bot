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
  console.log("* Received message")
  // Remove whitespace from chat message
  const splittedMsg = msg.trim().split("|");

  // If the command is known, let's execute it
  if (splittedMsg[0] === '!wrAdd') {
    if(splittedMsg.length != 3) {
      client.say(target, "Invalid arguments number");
    }
    else {
      fs.readFile('home/WRs.json', function(data) {
        console.log("* Reading JSON");
        var wr_data = JSON.parse(data);
        console.log("* JSON content : " + data)
        wr_data.WRs.push({
          src_link: splittedMsg[1],
          display_in_title: splittedMsg[2]
        });
        fs.writeFile("./WRs.json", JSON.stringify(wr_data), function(err) {
          console.log("* Writing file")
          if(err) {
            console.log("* Error : " + err);
          }
          else {
            WRs.push({
              src_link: splittedMsg[1],
              display_in_title: splittedMsg[2]
            })
            client.say(target, "Saved WR");
          }
        });
      });
    }
  }
  else if (splittedMsg[0] === '!wr') {
    console.log(WRs);
    wr.getWR(WRs[0].src_link).then(function(result) {
      client.say(target, result);
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
