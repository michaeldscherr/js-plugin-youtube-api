if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
        var arguments$1 = arguments;

        if (target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments$1[index];
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

    /*
        * since `onYouTubeIframeAPIReady` is only called once
        * keep track of the elements before the script is loaded
    */
    var initialElemsBeforeInit = [];

    // defaults for plugin
    var defaults = {
        onAPIReady: function () {},
        onStateChange: function () {},
        playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            modestbranding: 1,
            showinfo: 0,
            wmode: 'opaque'
        }
    };

    /**
        * youtube api that gets injected
        * into the youtube client instance
    */
    var youtubeAPI = function(reference, options) {

        var elem = reference.elem;
        var videoid = reference.videoid;
        var player = null;

        // return the player
        var getPlayer = function () { return player; };

        /**
            * build the youtube player
            * set variables
            * bind the events
        */
        var build = function () {
            player = new window.YT.Player(elem, {
                videoId: videoid,
                playerVars: options.playerVars,
                events: {
                    onReady: options.onAPIReady,
                    onStateChange: function (state) { return options.onStateChange(state); }
                }
            });
        };

        return {
            build: build,
            getPlayer: getPlayer
        };
    };

    // set to false initially
    var scriptLoaded = false;

    /**
        this function loads the YouTube API script
        the script generated will trigger the
        `window.onYouTubeIframeAPIReady` function
    */
    function loadAPIScript() {
        if (scriptLoaded === true) {
            return;
        }
        var firstScriptTag = document.getElementsByTagName('script')[0];
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    var YoutubeClient = function(elem, options) {
        this.options = Object.assign({}, defaults, options);
        this.elem = elem;
        this.videoid = this.elem.getAttribute('data-yt-videoid');
        this.api = new youtubeAPI(this, this.options);
    };

    /**
        destroy the current
        player instance
    */
    YoutubeClient.prototype.destroy = function() {
        var player = this.api.getPlayer();
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
    var factory = function(elems, options) {
        if ( options === void 0 ) options = {};

        if (!elems.length) {
            elems = [].concat( elems );
        }
        var cb = function (targets) {
            targets.forEach(function (target) {
                if (typeof options === 'string') {
                    if (target.YouTubeClient && typeof target.YouTubeClient[options] !== 'function') {
                        throw new Error(("\"" + options + "\" method is not defined on " + target));
                    }
                    return target.YouTubeClient[options]();
                }
                if (target.youtubeClientInitialized === true) {
                    return true;
                }
                var youtubeClient = new YoutubeClient(target, options);
                youtubeClient.init();
                target.youtubeClientInitialized = true;
                target.YouTubeClient = youtubeClient;
                return target.YouTubeClient;
            });
        };
        if (scriptLoaded) {
            cb(elems);
            return;
        }
        /*
            * push initial elements, since youtube script
            * has not loaded yet
        */
        initialElemsBeforeInit.push.apply(initialElemsBeforeInit, elems);
        window.onYouTubeIframeAPIReady = function () {
            scriptLoaded = true;
            cb(initialElemsBeforeInit);
        };
        loadAPIScript();
    };

    // return just the factory, everything else is private
    return factory;

})(window, document);

(function(window, document) {

    // check for document ready state
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {

            // select elements, initialize plugin
            var elems = document.querySelectorAll('[data-yt-client="true"]');
            window.youtubeClient(elems);

        }
    };

})(window, document);
//# sourceMappingURL=youtube-api.js.map
