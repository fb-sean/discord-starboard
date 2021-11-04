 
/*################# [Famebit.ch Ltd.] #################
Copyright (C) 2021 Famebit.ch Betty Discord Bot
    GNU General Public License v3.0

- Version: 1.0
- Last Changes: 2021-09-18
- Author: Sean Sattler

INFO: You need to change this for ur own Handler!!

################### [Famebit.ch Ltd.] ###############*/


const { Client, CommandInteraction, MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const starboardModel = require("../../database/schemas/starboard")


module.exports = {
    name: "starboard",
    description: "⭐ | Setup the starboard",
    type: 'CHAT_INPUT',
    cooldown: 5,
    userPermission: [`MANAGE_GUILD`],
    options: [
        {
            "name": "edit",
            "description": "⭐ | Setup the starboard",
            "type": 1,
            "require": true,
            "options": [
                {
                    "name": "starcount",
                    "description": "⭐ | amount of stars befor being sent to the channel",
                    "type": 4,
                    "required": true,
                },
                {
                    "name": "emoji",
                    "description": "⭐ | the eomji to use as star",
                    "type": 3,
                    "required": true,
                },
                {
                    "name": "channel",
                    "description": "⭐ | channel to send starboard messages to",
                    "type": 7,
                    "required": true
                },
            ]
        },
        {
            "name": "delete",
            "description": "⭐ | delete the starboard",
            "type": 1,
            "require": true,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args, guildDB, globalcolor) => {
        let embed = new MessageEmbed()
        .setColor(globalcolor)

        if(args[0] === "edit"){
            const starCount = interaction.options.getInteger("starcount")
            const starChannelraw = interaction.options.getChannel("channel")
            const staremoji = interaction.options.getString("emoji")
            const starChannel = await interaction.guild.channels.cache.get(starChannelraw);
    
            if(starChannel.type !== 'GUILD_TEXT') return client.sendT(interaction, {
                allowedMentions: {repliedUser: false}, 
                content: "Please choose a vaild text channel"
            })
            const data = await starboardModel.findOne({ Guild: interaction.guildId})
            if(data) data.delete();
    
            if(isNaN(starCount)) return client.sendT(interaction, {
                allowedMentions: {repliedUser: false}, 
                content: "Please choose a vaild count"
            })
    
    
    
            let msgcheck = await client.sendT(interaction, {
                allowedMentions: {repliedUser: false}, 
                content: `Thinking about cats....`
            })
    
    
            let check = await msgcheck.react(staremoji).catch(() => {});
    
            if(!check) return  msgcheck.edit({
                content: "Please choose a vaild emoji"
            })
    
            new starboardModel({
                Guild: interaction.guildId,
                starCount: starCount,
                staremoji: staremoji,
                starboardChannel: starChannel.id
            }).save();
    
            msgcheck.edit({
                content: `⭐ | Starboard \n\nChannel: ${starChannel}\nEmoji: ${staremoji}\nCount: ${starCount}`
            })        
        } else if(args[0] === "delete"){
            const data = await starboardModel.findOne({ Guild: interaction.guildId})
            if(data) {
                client.sendT(interaction, {
                    allowedMentions: {repliedUser: false}, 
                    content: `⭐ | Starboard got deletet.`
                })
                data.delete();
            }
            if(!data) {
                client.sendT(interaction, {
                    allowedMentions: {repliedUser: false}, 
                    content: `❌ | you didnt created a starboard.`
                })
            }
        }
         
    },
};
