(function () {
  if (Recorder.isRecordingSupported()) {
    $('.recorder').removeClass('hidden');
  } else {
    $('.support').removeClass('hidden');
    return;
  }

  var state = 'stopped';
  var audioData;
  var fileName;

  var timer;
  var startTime;
  const recorder = new Recorder({
    encoderPath: 'lib/recorder/waveWorker.min.js',
    encoderSampleRate: 44100
  });

  recorder.addEventListener('dataAvailable', onDataAvailable);

  $('.record-button').click(micClick);
  $('.btn.insert').click(insertClick);
  $('.btn.cancel').click(cancelClick);

  return;

  function onDataAvailable(event) {
    audioData = new Blob([event.detail], { type: 'audio/wav' });
    fileName = 'Recording - ' + new Date().toISOString() + '.wav';
    const url = URL.createObjectURL(audioData);

    $('.record-result').removeClass('hidden');
    $('.insert').removeClass('hidden');

    $('.record-playback').attr('src', url);
    $('.record-download').attr('href', url);
    $('.record-download').attr('download', fileName);
  }

  function insertClick() {
    if (state === 'uploading') return;
    state = 'uploading';

    const form = new FormData();
    form.append('file', audioData);

    NProgress.start();
    $.ajax({
      url: 'api/recordings',
      method: 'POST',
      data: form,
      processData: false,
      contentType: false
    }).done(function (data) {
      Mixmax.done({
        uploadId: data.uploadId
      });
    }).always(function () {
      NProgress.done();
    });
  }

  function cancelClick() {
    Mixmax.cancel();
  }

  function micClick() {
    switch (state) {
      case 'stopped': return record();
      case 'recording': return stop();
      default:
    }
  }

  function record() {
    state = 'recording';
    $('.record-button').addClass('recording');
    $('.record-result').addClass('hidden');

    startTime = Date.now();
    timer = setInterval(function () {
      const FIVE_MINUTES = 300000;
      const timeDiff = Date.now() - startTime;

      if (timeDiff > FIVE_MINUTES) {
        stop();
      }

      const timeString = new Date(timeDiff).toUTCString().slice(-8, -4)
      $('.record-timer').text(timeString + ' / 5:00');
    })

    recorder.initStream().then(function () {
      recorder.start();
    });
  }

  function stop() {
    state = 'stopped';
    $('.record-button').removeClass('recording');

    recorder.stop();
    clearInterval(timer);
  }
})();
