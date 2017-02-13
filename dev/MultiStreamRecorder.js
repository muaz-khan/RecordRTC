// ______________________
// MultiStreamRecorder.js

/*
 * Video conference recording, using captureStream API along with WebAudio and Canvas2D API.
 */

/**
 * MultiStreamRecorder can record multiple videos in single container.
 * @summary Multi-videos recorder.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef MultiStreamRecorder
 * @class
 * @example
 * var options = {
 *     mimeType: 'video/webm'
 * }
 * var recorder = new MultiStreamRecorder(ArrayOfMediaStreams, options);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 *
 *     // or
 *     var blob = recorder.blob;
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStreams} mediaStreams - Array of MediaStreams.
 * @param {object} config - {disableLogs:true, frameInterval: 10, mimeType: "video/webm"}
 */

function MultiStreamRecorder(arrayOfMediaStreams, options) {
    var self = this;

    options = options || {
        mimeType: 'video/webm',
        video: {
            width: 320,
            height: 240
        }
    };

    if (!options.frameInterval) {
        options.frameInterval = 10;
    }

    if (!options.video) {
        options.video = {};
    }

    if (!options.video.width) {
        options.video.width = 320;
    }

    if (!options.video.height) {
        options.video.height = 240;
    }

    /**
     * This method records all MediaStreams.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        isStoppedRecording = false;
        var mixedVideoStream = getMixedVideoStream();

        var mixedAudioStream = getMixedAudioStream();
        if (mixedAudioStream) {
            mixedAudioStream.getAudioTracks().forEach(function(track) {
                mixedVideoStream.addTrack(track);
            });
        }

        if (options.previewStream && typeof options.previewStream === 'function') {
            options.previewStream(mixedVideoStream);
        }

        mediaRecorder = new MediaStreamRecorder(mixedVideoStream, {
            mimeType: 'video/webm'
        });

        canvas.width = videos.length > 1 ? videos[0].width * 2 : videos[0].width;
        canvas.height = videos.length > 2 ? videos[0].height * 2 : videos[0].height;

        drawVideosToCanvas();

        mediaRecorder.record();
    };

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        isStoppedRecording = true;

        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.stop(function(blob) {
            callback(blob);
        });
    };

    function getMixedAudioStream() {
        // via: @pehrsons
        var audioContext = new AudioContext();
        var audioSources = [];

        var audioTracksLength = 0;
        arrayOfMediaStreams.forEach(function(stream) {
            if (!stream.getAudioTracks().length) {
                return;
            }

            audioTracksLength++;

            audioSources.push(audioContext.createMediaStreamSource(stream));
        });

        if (!audioTracksLength) {
            return;
        }

        var audioiDestination = audioContext.createMediaStreamDestination();
        audioSources.forEach(function(audioSource) {
            audioSource.connect(audioiDestination);
        });
        return audioiDestination.stream;
    }

    var videos = [];
    var mediaRecorder;

    function getMixedVideoStream() {
        // via: @adrian-ber
        arrayOfMediaStreams.forEach(function(stream) {
            if (!stream.getVideoTracks().length) {
                return;
            }

            var video = getVideo(stream);
            video.width = options.video.width;
            video.height = options.video.height;
            videos.push(video);
        });

        var capturedStream;

        if ('captureStream' in canvas) {
            capturedStream = canvas.captureStream();
        } else if ('mozCaptureStream' in canvas) {
            capturedStream = canvas.mozCaptureStream();
        } else if (!options.disableLogs) {
            console.error('captureStream API requires this flag: chrome://flags/#enable-experimental-web-platform-features');
        }

        return capturedStream;
    }

    function getVideo(stream) {
        var video = document.createElement('video');
        video.src = URL.createObjectURL(stream);
        video.play();
        return video;
    }

    var isStoppedRecording = false;

    function drawVideosToCanvas() {
        if (isStoppedRecording) {
            return;
        }

        var videosLength = videos.length;
        videos.forEach(function(video, idx) {
            if (videosLength === 1) {
                context.drawImage(video, 0, 0, video.width, video.height);
                return;
            }

            if (videosLength === 2) {
                var x = 0;
                var y = 0;

                if (idx === 1) {
                    x = video.width;
                }

                context.drawImage(video, x, y, video.width, video.height);
                return;
            }

            if (videosLength === 3) {
                var x = 0;
                var y = 0;

                if (idx === 1) {
                    x = video.width;
                }

                if (idx === 2) {
                    y = video.height;
                }

                context.drawImage(video, x, y, video.width, video.height);
                return;
            }

            if (videosLength === 4) {
                var x = 0;
                var y = 0;

                if (idx === 1) {
                    x = video.width;
                }

                if (idx === 2) {
                    y = video.height;
                }

                if (idx === 3) {
                    x = video.width;
                    y = video.height;
                }

                context.drawImage(video, x, y, video.width, video.height);
                return;
            }
        });

        setTimeout(drawVideosToCanvas, options.frameInterval);
    }

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    canvas.style = 'opacity:0;position:absolute;z-index:-1;top: -100000000;left:-1000000000;';

    document.body.appendChild(canvas);

    /**
     * This method pauses the recording process.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        if (mediaRecorder) {
            mediaRecorder.pause();
        }
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        if (mediaRecorder) {
            mediaRecorder.resume();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        videos = [];
        context.clearRect(0, 0, canvas.width, canvas.height);
        isStoppedRecording = false;
        mediaRecorder = null;

        if (mediaRecorder) {
            mediaRecorder.clearRecordedData();
        }
    };
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.MultiStreamRecorder = MultiStreamRecorder;
}
