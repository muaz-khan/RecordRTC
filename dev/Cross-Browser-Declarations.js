// _____________________________
// Cross-Browser-Declarations.js

// animation-frame used in WebM recording
if (typeof requestAnimationFrame === 'undefined') {
    if (typeof webkitRequestAnimationFrame !== 'undefined') {
        /*global requestAnimationFrame:true */
        var requestAnimationFrame = webkitRequestAnimationFrame;
    }

    if (typeof mozRequestAnimationFrame !== 'undefined') {
        /*global requestAnimationFrame:true */
        var requestAnimationFrame = mozRequestAnimationFrame;
    }
}

if (typeof cancelAnimationFrame === 'undefined') {
    if (typeof webkitCancelAnimationFrame !== 'undefined') {
        /*global cancelAnimationFrame:true */
        var cancelAnimationFrame = webkitCancelAnimationFrame;
    }

    if (typeof mozCancelAnimationFrame !== 'undefined') {
        /*global cancelAnimationFrame:true */
        var cancelAnimationFrame = mozCancelAnimationFrame;
    }
}

// WebAudio API representer
if (typeof AudioContext === 'undefined') {
    if (typeof webkitAudioContext !== 'undefined') {
        /*global AudioContext:true */
        var AudioContext = webkitAudioContext;
    }

    if (typeof mozAudioContext !== 'undefined') {
        /*global AudioContext:true */
        var AudioContext = mozAudioContext;
    }
}

if (typeof URL === 'undefined' && typeof webkitURL !== 'undefined') {
    /*global URL:true */
    var URL = webkitURL;
}

var isChrome = true;

if (typeof navigator !== 'undefined') {
    if (typeof navigator.webkitGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.webkitGetUserMedia;
    }

    if (typeof navigator.mozGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.mozGetUserMedia;
    }

    isChrome = typeof navigator.webkitGetUserMedia !== 'undefined';
} else {
    /*global navigator:true */
    var navigator = {
        getUserMedia: {}
    };
}

if (typeof webkitMediaStream !== 'undefined') {
    var MediaStream = webkitMediaStream;
}

// Merge all other data-types except "function"

/**
 * @param {object} mergein - Merge another object in this object.
 * @param {object} mergeto - Merge this object in another object.
 * @returns {object} - merged object
 * @example
 * var mergedObject = mergeProps({}, {
 *     x: 10, // this will be merged
 *     y: 10, // this will be merged
 *     add: function() {} // this will be skipped
 * });
 */
function mergeProps(mergein, mergeto) {
    mergeto = reformatProps(mergeto);
    for (var t in mergeto) {
        if (typeof mergeto[t] !== 'function') {
            mergein[t] = mergeto[t];
        }
    }
    return mergein;
}

/**
 * @param {object} obj - If a property name is "sample-rate"; it will be converted into "sampleRate".
 * @returns {object} - formatted object.
 * @example
 * var mergedObject = reformatProps({
 *     'sample-rate': 44100,
 *     'buffer-size': 4096
 * });
 *
 * mergedObject.sampleRate === 44100
 * mergedObject.bufferSize === 4096
 */
function reformatProps(obj) {
    var output = {};
    for (var o in obj) {
        if (o.indexOf('-') !== -1) {
            var splitted = o.split('-');
            var name = splitted[0] + splitted[1].split('')[0].toUpperCase() + splitted[1].substr(1);
            output[name] = obj[o];
        } else {
            output[o] = obj[o];
        }
    }
    return output;
}

if (typeof location !== 'undefined') {
    if (location.href.indexOf('file:') === 0) {
        console.error('Please load this HTML file on HTTP or HTTPS.');
    }
}

// below function via: http://goo.gl/B3ae8c
/**
 * @param {number} bytes - Pass bytes and get formafted string.
 * @returns {string} - formafted string
 * @example
 * bytesToSize(1024*1024*5) === '5 GB'
 */
function bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
        return '0 Bytes';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
