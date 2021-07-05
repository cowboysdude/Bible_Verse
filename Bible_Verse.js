/* Magic Mirror
 * Module: Bible_Verse
 *
 * By cowboysdude
 *
 */
Module.register("Bible_Verse", {

    defaults: {
        updateInterval: 120 * 60 * 1000,
		// updateInterval: 1000,
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
        // Set locale.
        this.today = "";
        this.scheduleUpdate();
    },


    getDom: function() { 
        var verse = this.verse.verse;
		var source = this.verse.source;

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
		
	
		
		/////////////////////////// RANDOM IMAGE ////////////////////////////////////////////////		
		
		var imagesURL = "https://source.unsplash.com/1600x900/?nature";
        
		function getImage() {
		  var imagesURL = "https://source.unsplash.com/1600x900/?nature";
		  return imagesURL;
		}

		setInterval(getImage, 1000);
	
		// I've tried setInterval etc to get a new image when the verse updates but all I'm getting is 404 errors when 
		// it updates.....
		
		
		
        var text = verse +"<br><font color=gray>"+source+"</font>";
		

        var des = document.createElement("div");
        des.classList.add("small", "bright", "description");
        des.innerHTML =    
		`<div class="containers">
		<img src="${imagesURL}" alt="" style="width:99%;">
		<div class="bottom-left">${text}</div> 
		</div>`; 
        top.appendChild(des);
		
		wrapper.appendChild(top);
		
        return wrapper;

    },

    processVerse: function(data) {
        this.verse = data[0];
        console.log(this.verse);
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
        this.updateDom(this.config.initialLoadDelay);
    },

});
