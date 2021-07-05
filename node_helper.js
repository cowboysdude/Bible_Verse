/* Magic Mirror
 * Module: Bible_Verse
 *
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');
const translate = require('@vitalets/google-translate-api');
const fetch = require('node-fetch');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },

    getVerse: function() {
        console.log("Getting a Verse.");
        var self = this;
        request({
            url: "https://beta.ourmanna.com/api/v1/get/?format=json",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var apiResponse = JSON.parse(body);
                translate(apiResponse.verse.details.text, {
                    from: apiResponse.language,
                    to: config.language,
                    client: 'gtx'
                }).then(function(result) {
                    var results = {
                        verse: result.text,
                        source: apiResponse.verse.details.reference
                    };

                    self.sendSocketNotification("VERSE_RESULT", results);
                }).catch(function(err) {
                    console.error("[Bible_Verse] Translation ERROR! Translation failed, will fall back to original language!");
                    console.error(JSON.stringify(err));
                    self.sendSocketNotification("VERSE_RESULT", apiResponse.text);
                });
            } else {
                console.error("API Error: Wrong response code: " + response.statusCode);
                console.error(JSON.stringify(response));
                console.error(JSON.stringify(error));
                self.sendSocketNotification("VERSE_RESULT", "API ERROR!");
            };
        });
    },

    getDaily: function(url) {
        fetch("https://source.unsplash.com/random/nature").then(data => {
            var image = {
                image: data.url
            };
            this.sendSocketNotification("IMAGE_RESULT", image);
        });
    },


    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
        } else if (notification === 'GET_VERSE') {
            this.getVerse();
            this.getDaily();
        }
    }
});
