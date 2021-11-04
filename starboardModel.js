/*################# [Famebit.ch Ltd.] #################
Copyright (C) 2021 Famebit.ch Betty Discord Bot
    GNU General Public License v3.0

- Version: 1.0
- Last Changes: 2021-09-18
- Author: Sean Sattler

################### [Famebit.ch Ltd.] ###############*/

const mongoose = require('mongoose');

const starboardModel = mongoose.model(
    `starboards`,
    new mongoose.Schema({
        Guild: String,
        starCount: Number,
        starboardChannel: String,
        staremoji: String,
    })

);

module.exports = starboardModel;
