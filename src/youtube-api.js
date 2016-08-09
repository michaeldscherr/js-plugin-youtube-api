if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
        if (target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

window.youtubeClient = (function(window, document) {

    // defaults for plugin
    const defaults = {
        callbacks: {
            onAPIReady: () => {},
            onStateChange: () => {}
        },
        api: {
            playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                modestbranding: 1,
                showinfo: 0,
                wmode: 'opaque'
            }
        }
    };

    /**
        * youtube api that gets injected
        * into the youtube client instance
    */
    const youtubeAPI = function(reference, options) {

        const elem = reference.elem;
        const videoid = reference.videoid;
        let player = null;

        // return the player
        let getPlayer = () => player;

        /**
            * build the youtube player
            * set variables
            * bind the events
        */
        let build = function () {
            player = new window.YT.Player(elem, {
                videoId: videoid,
                playerVars: options.api.playerVars,
                events: {
                    onReady: options.callbacks.onAPIReady,
                    onStateChange: (state) => options.callbacks.onStateChange(state)
                }
            });
        };

        return {
            build,
            getPlayer
        };
    };

    // set to false initially
    let scriptLoaded = false;

    /**
        this function loads the YouTube API script
        the script generated will trigger the
        `window.onYouTubeIframeAPIReady` function
    */
    function loadAPIScript() {
        if (scriptLoaded === true) {
            return;
        }
        const firstScriptTag = document.getElementsByTagName('script')[0];
        let tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        scriptLoaded = true;
    }

    const YoutubeClient = function(elem, options) {
        this.options = Object.assign({}, defaults, options);
        this.elem = elem;
        this.videoid = elem.getAttribute('data-yt-videoid');
        this.api = new youtubeAPI(this, this.options);
    };

    /**
        destroy the current
        player instance
    */
    YoutubeClient.prototype.destroy = function() {
        const player = this.api.getPlayer();
        player.destroy();
    };

    /**
        * on init, build the player
        * from the api
    */
    YoutubeClient.prototype.init = function() {
        this.api.build();
    };

    /**
        * simple factory function to return
        * a new `YoutubeClient` instance to
        * each element passed in
    */
    const factory = function(elems, options = {}) {
        const cb = () => {
            if (!elems.length) {
                elems = [...elems];
            }
            elems.forEach((elem) => {
                if (typeof options === 'string') {
                    if (elem.YouTubeClient && typeof elem.YouTubeClient[options] !== 'function') {
                        throw new Error(`"${options}" method is not defined on ${elem}`);
                    }
                    return elem.YouTubeClient[options]();
                }
                if (elem.youtubeClientInitialized === true) {
                    return true;
                }
                const youtubeClient = new YoutubeClient(elem, options);
                youtubeClient.init();
                elem.youtubeClientInitialized = true;
                elem.YouTubeClient = youtubeClient;
                return elem.YouTubeClient;
            });
        };
        if (scriptLoaded) {
            cb();
            return;
        }
        window.onYouTubeIframeAPIReady = () => {
            cb();
        };
        loadAPIScript();
    };

    // return just the factory, everything else is private
    return factory;

})(window, document);

(function(window, document) {

    // check for document ready state
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {

            // select elements, initialize plugin
            const elems = document.querySelectorAll('[data-yt-cli="true"]');
            window.youtubeClient(elems);

        }
    };

})(window, document);
