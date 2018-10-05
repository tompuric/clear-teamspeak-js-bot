var Discord = require('discord.js');
var Stream = require('stream');
var logger = require('winston');
var fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
var auth = require('./auth.json');

console.log("Starting");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();


bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
  // const progressionChannel = '494804745555410944';
  const progressionChannel = '494804745555410944';
  // 494816030032396288
  const voiceChannel = bot.channels.find(channel => channel.id === progressionChannel);
  voiceChannel.join().then(connection => {
    const receiver = connection.createReceiver();

    // voiceChannel.members.array().forEach(member => {
    // console.log(member.user);
    console.log(voiceChannel.members.array()[0].user);

    // });

    connection.on('speaking', (user, speaking) => {
      if (speaking) {
        console.log('recording');
        const voiceStream = receiver.createOpusStream(user);

        voiceStream.on('data', chunk => {
          console.log(`Received ${chunk.length} bytes of data.`);
        });

        voiceStream.on('opus', chunk => {
          console.log(`Received ${chunk.length} bytes of data.`);
        });

        voiceStream.on('pcm', chunk => {
          console.log(`Received ${chunk.length} bytes of data.`);
        });

        voiceStream.on('pcm', chunk => {
          console.log(`Received ${chunk.length} bytes of data.`);
        });
        // try {
        //   const out = fs.createWriteStream('./audio.wav');
        //   ffmpeg(voiceStream)
        //     .inputFormat('s32le')
        //     .audioFrequency(16000)
        //     .audioChannels(1)
        //     .audioCodec('pcm_s16le')
        //     .format('s16le')
        //     .on('error', console.error.bind(console))
        //     .pipe(out);
        // } catch (error) {
        //   console.log(error);
        // }
      }
      // console.log(user);


      // var dest = new Stream();
      // dest.writable = true;
      // dest.write = function (data) {
      //   console.log(data);
      // };
      // receiver.createOpusStream(user).pipe(dest);
      // if (speaking && voiceChannel.members.has(user.id)) {

      //   let speaker = voiceChannel.members.find(val => val.id === user.id).displayName;

      // }
    });
  })
});
// console.log(bot);

/*
bot.joinVoiceChannel(progressionChannel, function (error, events) {
  //Check to see if any errors happen while joining.
  if (error) {
    return console.error(error);
  }

  events.on('speaking', function (userID, SSRC, speakingBool) {
    //This will log either "[userID] is speaking" or "[userID] is done speaking"
    console.log("%s (%s): %s is %s", SSRC, userID, bot.users[userID].username, (speakingBool ? "speaking" : "done speaking"));
  });

  // //Then get the audio context
  bot.getAudioContext({
    channelID: progressionChannel,
    maxStreamSize: 50 * 1024
  }, function (error, stream) {
    //Once again, check to see if any errors exist
    if (error) return console.error(error);

    console.log(stream);

    //You can access a Member's stream
    //Members are Readable Streams
    if (stream.members['239307034305101824']) {
      //Will give you all of the PCM data saved for this user.
      stream.members['239307034305101824'].read();
    }

    // stream.pipe(fs.createWriteStream('./everyone.wav'));


    stream.on('done', function () {
      console.log('done');
    });

    stream.on('incoming', function (SSRC, data) {
      console.log("Incoming stream data");
    });

    //The stream fires `done` when it's got nothing else to send to Discord.
  })
});
*/

// bot.on('message', function (user, userID, channelID, message, evt) {
//   // Our bot needs to know if it will execute a command
//   // It will listen for messages that will start with `!`
//   console.log(user, userID, channelID, message, evt)
// });

bot.on("guildMemberSpeaking", function (guildMember, isSpeaking) {
  console.log("(%s): %s %s speaking", guildMember.voiceSessionID, guildMember.user.username, isSpeaking ? "started" : "stopped") //Logs every event

  // console.log(guildMember.voiceChannel.connection.on('speaking', ((data) => console.log(data.))));
  // guildMember.sendMessage("I heard you, stfu");
});

bot.on("voiceStateUpdate", function (event) {
  console.log('voiceStateUpdate') //Logs every event
  // console.log(event) //Logs every event
});


bot.on("disconnect", function (data) {
  console.log("Bot disconnected: ", data);
  /*bot.connect()*/ //Auto reconnect
});


bot.login(auth.token);