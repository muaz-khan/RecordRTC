// RecordRTC.promises.js

// adding promises support in RecordRTC.js

function RecordRTCPromisesHandler(mediaStream, options) {
    var self = this;

    this.recordRTC = RecordRTC(mediaStream, options);

    this.startRecording = function() {
        return new Promise(function(resolve, reject) {
            try {
                self.recordRTC.startRecording();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    };

    this.stopRecording = function() {
        return new Promise(function(resolve, reject) {
            try {
                self.recordRTC.stopRecording(function(url) {
                    self.blob = self.recordRTC.getBlob();
                    resolve(url);
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    this.getDataURL = function(callback) {
        return new Promise(function(resolve, reject) {
            try {
                self.recordRTC.getDataURL(function(dataURL) {
                    resolve(dataURL);
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    this.getBlob = function() {
        return this.recordRTC.getBlob();
    };

    this.blob = null;
}

if (typeof module !== 'undefined') {
    module.exports = RecordRTCPromisesHandler;
}
