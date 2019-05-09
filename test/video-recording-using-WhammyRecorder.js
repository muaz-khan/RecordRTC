describe('RecordRTC', function() {
    it('video-recording-using-WhammyRecorder', function() {
        function addLine() {
            console.log('\x1b[31m%s\x1b[0m ', (new Date).toUTCString() + ':');
        }

        console.log('------------------------------');
        console.log('\x1b[31m%s\x1b[0m ', 'video-recording-using-WhammyRecorder');

        browser.driver.get('https://www.webrtc-experiment.com/RecordRTC/tests/video-recording-using-WhammyRecorder.html').then(function() {
            // wait until RecordRTC ends the recording
            (function looper() {
                var isRecordingStopped = false;
                var onStateChanged = '';

                browser.driver.findElement(by.id('isRecordingStopped')).getText().then(function(value) {
                    if (!value || !value.toString().length) {
                        return;
                    }

                    isRecordingStopped = value.toString() === 'true';
                });

                browser.driver.findElement(by.id('onStateChanged')).getText().then(function(value) {
                    if (!value || !value.toString().length) {
                        return;
                    }

                    onStateChanged = value;
                });

                browser.wait(function() {
                    return true;
                }, 1000).then(function() {
                    addLine();
                    console.log('onStateChanged: ' + onStateChanged);

                    if (isRecordingStopped === false) {
                        looper();
                        return;
                    }

                    onRecordingStopped();
                });
            })();

            function onRecordingStopped() {
                addLine();
                console.log('onRecordingStopped');

                var blobSize = 0;
                var logs = '';

                browser.driver.findElement(by.id('blobSize')).getText().then(function(value) {
                    if (!value || !value.toString().length) {
                        return;
                    }

                    blobSize = value.toString();
                });

                browser.driver.findElement(by.id('logs')).getText().then(function(value) {
                    if (!value || !value.toString().length) {
                        return;
                    }

                    logs = value.toString();
                });

                browser.wait(function() {
                    addLine();
                    console.log('blobSize: ' + blobSize);

                    addLine();
                    console.log(logs);

                    if (blobSize === 0 || blobSize === '0 Bytes' || blobSize === '0' || !blobSize || blobSize === NaN || blobSize === 'NaN' || !blobSize.toString().length) {
                        addLine();
                        console.log('\x1b[31m%s\x1b[0m ', 'video-recording-using-WhammyRecorder failed: ' + blobSize);

                        throw new Error('video-recording-using-WhammyRecorder failed: ' + blobSize);
                    }

                    return true;
                }, 1000, 'video-recording-using-WhammyRecorder failed.');
            }
        });
    });
});
