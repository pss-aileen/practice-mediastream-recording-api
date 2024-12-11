'use strict';

{
  // https://codepen.io/naotokui/pen/abBvBmW
  // https://stackoverflow.com/questions/77914539/tonejs-pitchshift-with-mediastream

  const startBtn = document.getElementById('start');
  const stopBtn = document.getElementById('stop');

  const recorder = new Tone.Recorder({
    // mimeType: 'audio/webm; codecs=opus',
    // mimeType: 'mp3',
  });

  const userMedia = new Tone.UserMedia().connect(recorder);

  const soundContainer = document.getElementById('sound-container');

  userMedia
    .open()
    .then(() => {
      console.log('userMedia open');

      startBtn.addEventListener('click', () => {
        recorder.start();
        console.log('start');
      });

      stopBtn.addEventListener('click', async () => {
        console.log('end');

        const recording = await recorder.stop();

        console.log(recording);

        const audio = document.createElement('audio');
        audio.setAttribute('controls', '');
        const url = window.URL.createObjectURL(recording);
        audio.src = url;

        soundContainer.appendChild(audio);
      });
    })
    .catch((e) => {
      console.log('userMedia not open');
    });
}
