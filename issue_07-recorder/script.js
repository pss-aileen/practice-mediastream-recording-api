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

  // const meter = new Tone.Meter();
  const mic = new Tone.UserMedia().connect(recorder);

  // ピッチの設定はこれがベスト
  const pitch = new Tone.PitchShift({ pitch: 10, delayTime: 0, feedback: 0, wet: 1, windowSize: 0.06 });
  const soundContainer = document.getElementById('sound-container');
  // pitch.start();

  // player.connect(pitch);

  mic
    .open()
    .then(() => {
      // promise resolves when input is available

      // とにかく以下が問題
      // mic.chain(pitch, Tone.Destination);
      console.log('mic open');

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
      });
    })
    .catch((e) => {
      // promise is rejected when the user doesn't have or allow mic access
      console.log('mic not open');
    });
}
