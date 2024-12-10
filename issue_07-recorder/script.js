'use strict';

{
  // https://codepen.io/naotokui/pen/abBvBmW

  const startBtn = document.getElementById('start');
  const stopBtn = document.getElementById('stop');

  const recorder = new Tone.Recorder({
    // mimeType: 'audio/webm; codecs=opus',
    // mimeType: 'mp3',
  });

  // const meter = new Tone.Meter();
  const mic = new Tone.UserMedia().connect(recorder);

  mic
    .open()
    .then(() => {
      // promise resolves when input is available
      console.log('mic open');
      // print the incoming mic levels in decibels
      // setInterval(() => console.log(meter.getValue()), 100);
    })
    .catch((e) => {
      // promise is rejected when the user doesn't have or allow mic access
      console.log('mic not open');
    });

  const soundContainer = document.getElementById('sound-container');

  // これはただ、音を録音すうだけで、音声じゃない！

  startBtn.addEventListener('click', () => {
    recorder.start();
    console.log('start');
  });

  stopBtn.addEventListener('click', async () => {
    console.log('end');

    // const test = async () => {
    const recording = await recorder.stop();

    console.log(recording);

    const audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    const url = window.URL.createObjectURL(recording);
    audio.src = url;

    soundContainer.appendChild(audio);

    // const anchor = document.createElement('a');
    // anchor.download = 'recording.mp3';
    // anchor.href = url;
    // anchor.click();
    // };

    // test();
  });
}
