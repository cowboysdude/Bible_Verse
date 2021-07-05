/* Magic Mirror
 * Module: Bible_Verse
 *
 * By cowboysdude
 *
 */
Module.register("Bible_Verse", {

    defaults: {
        updateInterval: 120 * 60 * 1000,
        //updateInterval: 5000,
        animationSpeed: 2000,
        initialLoadDelay: 875
    },

    getStyles: function() {
        return ["Bible_Verse.css"];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.config.lang = this.config.lang || config.language;
        this.sendSocketNotification("CONFIG", this.config);
        this.verse = {};
		this.image = {};
        // Set locale.
        this.today = "";
        this.scheduleUpdate();
    },


    getDom: function() {
        var verse = this.verse.verse;
        var source = this.verse.source;
        var image = this.image.image;

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.classList.add("wrapper");
            wrapper.innerHTML = this.translate("Getting a Verse ...");
            wrapper.className = "bright light small";
            return wrapper;
        }

        var top = document.createElement("div");

        var text = verse + "<br><font color=white>" + source + "</font>";

        var des = document.createElement("div");
        des.classList.add("small", "bright", "description");
        des.innerHTML =
            `<div class="containers">
		<img class = "image" src="${image}" alt="" style="width:99%;">
		<div class="bottom-left">${text}</div> 
		</div>`;
        top.appendChild(des);

        wrapper.appendChild(top);

        return wrapper;
    },

    processVerse: function(data) {
        this.verse = data;
        console.log(this.verse);
    },

    processImage: function(data) {
        this.image = data;
        console.log(this.image);
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getVerse();
        }, this.config.updateInterval);
        this.getVerse(this.config.initialLoadDelay);
    },

    getVerse: function() {
        this.sendSocketNotification('GET_VERSE');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "VERSE_RESULT") {
            this.processVerse(payload);
        }
        if (notification === "IMAGE_RESULT") {
            this.processImage(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
