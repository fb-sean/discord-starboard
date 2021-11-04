/*################# [Famebit.ch Ltd.] #################
Copyright (C) 2021 Famebit.ch Betty Discord Bot
    GNU General Public License v3.0

- Version: 1.0
- Last Changes: 2021-09-18
- Author: Sean Sattler

################### [Famebit.ch Ltd.] ###############*/


const client = require('../index.js'),
starboardModel = require("../database/schemas/starboard"),
starboardmsgModel = require("../database/schemas/starboardmsg"),
Discord = require('discord.js')


client.on("messageReactionAdd", async (reaction) => {
    if(!reaction.message.guild) return;
    if(reaction.me) return;
    let data = await starboardModel.findOne({ Guild: reaction.message.guildId})

    let color = "#fcf9e3"
    let reactions_all = reaction && reaction.count ? reaction.count : 1

    if(reactions_all > 5 && !reactions_all < 5) {
         color = "#faf3c7"
    } else if(reactions_all > 10 && !reactions_all < 10) {
     color = "#f8edab"
    } else if(reactions_all > 15 && !reactions_all < 15) {
     color = "#F6E78F"
    } else if(reactions_all > 20 && !reactions_all < 20) {
     color = "#F4E274"
    } else if(reactions_all > 20 && !reactions_all < 20) {
     color = "#fcc444"
    }

    if(data){
        starboardClient(client, reaction, {
            event: 'messageReactionAdd',
            chid: data.starboardChannel,
            embedColor: color, 
            emoji: data.staremoji, 
            min: data.starCount,
          })
    }
});

client.on("messageReactionRemove", async (reaction) => {
    if(!reaction.message.guild) return;
    if(reaction.me) return;
    let data = await starboardModel.findOne({ Guild: reaction.message.guildId})


    let color = "#fcf9e3"
    let reactions_all = reaction && reaction.count ? reaction.count : 1

    if(reactions_all > 5 && !reactions_all < 5) {
         color = "#faf3c7"
    } else if(reactions_all > 10 && !reactions_all < 10) {
     color = "#f8edab"
    } else if(reactions_all > 15 && !reactions_all < 15) {
     color = "#F6E78F"
    } else if(reactions_all > 20 && !reactions_all < 20) {
     color = "#F4E274"
    } else if(reactions_all > 20 && !reactions_all < 20) {
     color = "#fcc444"
    }

    



    if(data){
        starboardClient(client, reaction, {
            event: 'messageReactionRemove',
            chid: data.starboardChannel,
            embedColor: color, 
            emoji: data.staremoji, 
            min: data.starCount,
          })
    }
});

client.on("messageDelete", async (message) => {

    if(!message.guildId) return;
    if(!message.author) return;
    if(message.author.id === client.user.id) return;

    const starmsg = await starboardmsgModel.findOne({ ReactionMSGId: message.id})

    if(starmsg) {
        starboardClient(client, message, {
          event: 'messageDelete',
        })
    }

});

async function starboardClient(client, reaction, options = []) {

    try {

         let minno = options.min || 2
         let min = Number(minno)
         if (!min || min === NaN) return;
         if (min === 0) return;

         let event = options.event

         if (event === 'messageReactionAdd') {
              await reaction.fetch()
              if (reaction.emoji.id === options.emoji || reaction.emoji.name === options.emoji) {

               let minmax = reaction && reaction.count
               if (minmax < min) return;

               const starboard = client.channels.cache.get(options.chid)
               if (!starboard) return;

                   const fetchMsg = await reaction.message.fetch();
 

                   const attachment = fetchMsg.attachments.first();
                   let url = attachment ? attachment.url : null;

                   let embed = new Discord.MessageEmbed()
                   .setAuthor(fetchMsg.author.tag, fetchMsg.author.displayAvatarURL())
                   .setColor(options.embedColor)
                   .setDescription(fetchMsg.content)
                   .setTimestamp()
                   .setImage(url)
                   .setFooter(`ID: ${fetchMsg.id}`);



                   if (fetchMsg.embeds.length !== 0) {
                         try{
                              let fetchEmbed = await reaction.message.channel.messages.fetch(fetchMsg.id)


                              url = attachment ? attachment.url : fetchEmbed.embeds[0].image.url;

                              if(url === null) {
                                   url = fetchEmbed.embeds[0].thumbnail.url;
                              }

           
                              embed = new Discord.MessageEmbed()
                              .setAuthor(fetchMsg.author.tag, fetchMsg.author.displayAvatarURL())
                              .setColor(options.embedColor)
                              .setDescription(`${fetchEmbed.embeds[0].title ? `**${fetchEmbed.embeds[0].title}**` : " "}` + `${fetchEmbed.embeds[0].title ? "\n\n" : " "}` + `${fetchEmbed.embeds[0].description ? fetchEmbed.embeds[0].description : " "}`)
                              .setTimestamp()
                              .setImage(url)
                              .setFooter(`ID: ${fetchMsg.id}`);
                              if(fetchEmbed.embeds[0].thumbnail && fetchEmbed.embeds[0].image) embed.setThumbnail(fetchEmbed.embeds[0].thumbnail.url)
                         }catch(err){
                    
                              embed = new Discord.MessageEmbed()
                              .setAuthor(fetchMsg.author.tag, fetchMsg.author.displayAvatarURL())
                              .setColor(options.embedColor)
                              .setDescription(fetchMsg.content)
                              .setTimestamp()
                              .setImage(fetchMsg.content)
                              .setFooter(`ID: ${fetchMsg.id}`);
                            
                         }
                       };


                   let eemoji = client.emojis.cache.get(options.emoji) || '⭐'


                   const jumpbutton = new Discord.MessageButton() 
                   .setEmoji('🔍')
                   .setLabel('Jump!')
                   .setStyle('LINK')
                   .setURL(`${fetchMsg.url}`)
           
                   const row = new Discord.MessageActionRow()
                   .addComponents(jumpbutton);


                   const starmsg = await starboardmsgModel.findOne({ ReactionMSGId: reaction.message.id})
                   if(starmsg) {
                   const m_second = await starboard.messages.fetch(starmsg.EmbedMSGId).catch(() => {});   
                   if(m_second) {
                              let reacts = reaction && reaction.count ? reaction.count : 1

                              if (reacts < min) return m_second.delete().catch(() => {});

                              m_second.edit({ content: `**${eemoji} ${reacts}** in ${reaction.message.channel} by ${reaction.message.author}`}).catch(() => {});                         
                     } else {
                         let reacts = reaction && reaction.count ? reaction.count : 1
                         const embedId = await starboard.send({ content: `**${eemoji} ${reacts}** in ${reaction.message.channel} by ${reaction.message.author} ${reaction.message.author.bot ? "<:Bot:890996539412082718>" : " "}`, embeds: [embed], components: [row] }).catch(() => {});
                         if(embedId) {
                              new starboardmsgModel({
                                   Guild: reaction.message.guildId,
                                   Channel: options.chid,
                                   ReactionMSGId: reaction.message.id,
                                   EmbedMSGId: embedId.id,
                                   starCount: reacts,
                               }).save();
                         }
                     }
                   } else if(!starmsg) {

                    let reacts = reaction && reaction.count ? reaction.count : 1
                    const embedId = await starboard.send({ content: `**${eemoji} ${reacts}** in ${reaction.message.channel} by ${reaction.message.author} ${reaction.message.author.bot ? "<:Bot:890996539412082718>" : " "}`, embeds: [embed], components: [row] }).catch(() => {});
                    if(embedId) {
                         new starboardmsgModel({
                              Guild: reaction.message.guildId,
                              Channel: options.chid,
                              ReactionMSGId: reaction.message.id,
                              EmbedMSGId: embedId.id,
                              starCount: reacts,
                          }).save();
                    }
               }
          }

         } else if (event === 'messageReactionRemove') {
              await reaction.fetch()
              if (reaction.emoji.id === options.emoji || reaction.emoji.name === options.emoji) {
               const starboard = client.channels.cache.get(options.chid)

               const fetchMsg = await reaction.message.fetch();
               if (!starboard) return;

               const attachment = fetchMsg.attachments.first();
               const url = attachment ? attachment.url : null;

               const embed = new Discord.MessageEmbed()
               .setAuthor(fetchMsg.author.tag, fetchMsg.author.displayAvatarURL())
               .setColor(options.embedColor)
               .setDescription(fetchMsg.content)
               .setTimestamp()
               .setImage(url)
               .addField(`Source`, `[Jump!](${fetchMsg.url})`)
               .setFooter(`ID: ${fetchMsg.id}`);

               let eemoji = client.emojis.cache.get(options.emoji) || '⭐'

               const starmsg = await starboardmsgModel.findOne({ ReactionMSGId: reaction.message.id})
               if(starmsg) {
               const m_second = await starboard.messages.fetch(starmsg.EmbedMSGId).catch(() => {});   
               if(m_second) {
                    if (m_second.embeds.length === 1) {

                         if (m_second.embeds[0] && m_second.embeds[0].footer && m_second.embeds[0].footer.text === `ID: ${fetchMsg.id}`) {
     
                              let reacts = reaction && reaction.count
     
                              if (reacts < min) return m_second.delete().catch(() => {});
     
                              if (reacts === 0) { 
                                   m_second.delete().catch(() => {})
                                   starmsg.delete();

                               } else {
                                   m_second.edit({ content: `**${eemoji} ${reacts}** in ${reaction.message.channel} by ${reaction.message.author} ${reaction.message.author.bot ? "<:Bot:890996539412082718>" : " "}` }).catch(() => {});
                              }
                         }
                    }
                 }
               }
              }

         } else if (event === 'messageDelete') {
               const starmsg = await starboardmsgModel.findOne({ ReactionMSGId: reaction.id})
               if(!starmsg) return;

               if(starmsg) {
                    const my_channel = client.channels.cache.get(starmsg.Channel)
                    if(my_channel) {
                         const m_second = await my_channel.messages.fetch(starmsg.EmbedMSGId).catch(() => {});   
                         if(m_second){
                              m_second.delete().catch(() => {});
                              starmsg.delete();
                         }
                    }
               }
         } else return;

    } catch (err) {
         console.log(`Error Occured. | starboard | Error: ${err}`)
         console.log(err)
    }

}
