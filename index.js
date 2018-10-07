var Discord = require('discord.js');
var Stream = require('stream');
var logger = require('winston');
var fs = require('fs');
const ffmpeg = require('ffmpeg-binaries');
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
        const voiceStream1 = receiver.createOpusStream(user);
        // voiceStream1.pipe((data) => console.log(data));
        // const voiceStream2 = receiver.createPCMStream(user);
        // voiceStream1.
        let fileStream = fs.createWriteStream('./audiotest.pcm');
        voiceStream1.pipe(fileStream);

        voiceStream1.on('data', chunk => {
          console.log(`Received DATA ${chunk.length} bytes of data.`);
        });

        voiceStream1.on('opus', chunk => {
          console.log(`Received OPUS ${chunk.length} bytes of data.`);
        });

        voiceStream1.on('pcm', chunk => {
          console.log(`Received PCM ${chunk.length} bytes of data.`);
        });

        voiceStream1.on('end', () => {
          console.log(`Received END bytes of data.`);
          fileStream.end();
          // voiceStream1.destroy();
        });

        voiceStream1.on('error', chunk => {
          console.log(`Received ERROR ${chunk} bytes of data.`);
        });

        voiceStream1.on('start', chunk => {
          console.log(`Received CLOSE ${chunk} bytes of data.`);
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
    });
  })
});

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