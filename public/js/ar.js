(function () {
  // Most modern browsers, except Safari, support audio recording
  if (Recorder.isRecordingSupported()) {
    $('.recorder').removeClass('hidden');
  } else {
    $('.support').removeClass('hidden');
    return;
  }

  // Stores the current state of the recorder
  // Valid states include: 'stopped', 'recording', 'uploading'
  var state = 'stopped';

  // Store the audio data in WAV format
  var audioData;
  var fileName;
  var uploadId;

  // Timer for displaying the current duration
  var timer;
  var startTime;

  // Recorder object for recording the media
  // Uses the WAV encoding and CD 44.1kHZ sampling rate
  const recorder = new Recorder({
    encoderPath: 'lib/recorder/waveWorker.min.js',
    encoderSampleRate: 44100
  });

  recorder.addEventListener('dataAvailable', onDataAvailable);

  $('.record-button').click(micClick);
  $('.btn.insert').click(insertClick);
  $('.btn.cancel').click(cancelClick);

  return;
  // When the recording is done, this function will be called
  function onDataAvailable(event) {
    // Creates local object URL for downloading the WAV fileName
    // These files are not stored on the server
    audioData = new Blob([event.detail], { type: 'audio/wav' });
    fileName = 'Recording - ' + new Date().toISOString() + '.wav';
    const url = URL.createObjectURL(audioData);

    $('.record-result').removeClass('hidden');
    $('.insert').removeClass('hidden');

    $('.record-playback').attr('src', url);
    $('.record-download').attr('href', url);
    $('.record-download').attr('download', fileName);
  }

  // Uploads the recorded audio file to the server
  function insertClick() {
    // Ignore if we're already uploading
    if (state === 'uploading') {
      return;
    } else if (state === 'success') {
      return Mixmax.done({
        uploadId: uploadId
      });
    }
    state = 'uploading';

    // Create the upload form data
    const form = new FormData();
    form.append('file', audioData);

    // Start the progress bar for uploading
    NProgress.start();
    $.ajax({
      url: 'api/recordings',
      method: 'POST',
      data: form,
      processData: false,
      contentType: false
    }).done(function (data) {
      state = 'success';
      uploadId = data.uploadId
      Mixmax.done({
        uploadId: uploadId
      });
    }).fail(function (xhr, status, err) {
      state = 'stopped';
      alert('Unable to upload recording to the server. Check your internet connectivity.')
    }).always(function () {
      NProgress.done();
    });
  }

  // Cancel button handler
  function cancelClick() {
    Mixmax.cancel();
  }

  // Microphone click handler
  function micClick() {
    switch (state) {
      case 'stopped': return record();
      case 'recording': return stop();
      default:
    }

    return;

    // Starts the recording
    function record() {
      state = 'recording';
      $('.record-button').addClass('recording');
      $('.record-result').addClass('hidden');

      startTime = Date.now();
      timer = setInterval(function () {
        const FIVE_MINUTES = 300000;
        const timeDiff = Date.now() - startTime;

        // WAV recordings get really large, so we limit it to 5 minutes
        // Ideal solution would be to use a more compact encoding
        if (timeDiff > FIVE_MINUTES) {
          stop();
        }

        // Remove the hour and GMT from the UTC time string to get only minutes and seconds
        const timeString = new Date(timeDiff).toUTCString().slice(-8, -4)
        $('.record-timer').text(timeString + ' / 5:00');
      }, 250);

      recorder.initStream().then(function () {
        recorder.start();
      });
    }

    // Stops the recording
    function stop() {
      state = 'stopped';
      $('.record-button').removeClass('recording');

      recorder.stop();
      clearInterval(timer);
    }
  }
})();
