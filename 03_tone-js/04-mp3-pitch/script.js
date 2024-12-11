'use strict';
{
  /* 
    📍 Autoplay Policy対策
    - のつもり。
    - できてるか微妙
  */

  const tonePermission = () => {
    const tonePermissionBtn = document.getElementById('tone-permission');

    tonePermissionBtn.addEventListener('click', async () => {
      // オーディオコンテクストを開始するための機能、autoplay policy対策
      // URL: https://tonejs.github.io/docs/15.0.4/functions/start.html
      // では、音声を流してもいいですか？的な案内で使うのがいいのかな？
      await Tone.start();
      console.log('audio ready.');
    });
  };

  tonePermission();

  /*
    📍 Tone.js の動作確認
    - ただ音を流すだけ
  */

  const toneTest = () => {
    const toneTestBtn = document.getElementById('tone-test');

    toneTestBtn.addEventListener('click', () => {
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease('C4', '8n');
    });
  };

  toneTest();

  /* 
    📍 Class Player
  */

  const player = () => {
    const classPlayerBtn = document.getElementById('class-player');
    const player = new Tone.Player('./audio.mp3').toDestination();

    classPlayerBtn.addEventListener('click', () => {
      // player.autostart = true;
      player.start();
    });
  };

  player();

  /* 
    📍 Class Player + Reverb
    - https://tonejs.github.io/examples/reverb
  */

  const playerWithReverb = () => {
    const reverb = new Tone.Reverb().toDestination();
    const player = new Tone.Player('./audio.mp3').connect(reverb);
    const btn = document.getElementById('player-reverb');

    btn.addEventListener('click', () => {
      player.start();
    });
  };
  playerWithReverb();

  /* 
    📍 Class Player + PitchShift
    - https://tonejs.github.io/docs/15.0.4/classes/PitchShift.html
    - https://tonejs.github.io/examples/pitchShift
  */

  const playerWithPitchShift = () => {
    const pitchShift = new Tone.PitchShift({ pitch: 2 }).toDestination();

    const player = new Tone.Player('./audio.mp3').connect(pitchShift);
    const btn = document.getElementById('player-pitchShift');

    btn.addEventListener('click', () => {
      player.start();
    });
  };

  playerWithPitchShift();

  /* 
    📍 User Media
    - ボタンによって、録音体制がととのうようになった
  */

  const userMedia = () => {
    const btn = document.getElementById('user-media');

    btn.addEventListener('click', () => {
      const mic = new Tone.UserMedia().toDestination();

      mic
        .open()
        .then(() => {
          console.log('mic.open');
        })
        .catch((e) => console.log('mic not open'));
    });
  };

  userMedia();

  /* 
    📍 User Media + Recorder
    💡 録音できた！！
  */

  const userMediaWithRecorder = () => {
    const startBtn = document.getElementById('user-media-recorder-start');
    const stopBtn = document.getElementById('user-media-recorder-stop');

    const recorder = new Tone.Recorder();
    const mic = new Tone.UserMedia().connect(recorder);

    mic
      .open()
      .then(() => {
        console.log('mic.open');
        startBtn.addEventListener('click', () => {
          console.log('recorder start');
          recorder.start();
        });
      })
      .catch((e) => console.log('mic not open'));

    stopBtn.addEventListener('click', async () => {
      console.log('recorder stop');
      const recording = await recorder.stop();
      const url = window.URL.createObjectURL(recording);
      const anchor = document.createElement('a');
      anchor.download = 'recording.webm';
      anchor.href = url;
      anchor.click();
    });
  };

  userMediaWithRecorder();

  /* 
    📍 User Media + Recorder + PitchShift
    💡 できた〜〜〜〜〜〜〜〜〜〜〜〜！！！！でもconnnectとchainの違いがわからない
  */

  const userMediaWithRecorderPitchShift = () => {
    const startBtn = document.getElementById('user-media-recorder-pitchShift-start');
    const stopBtn = document.getElementById('user-media-recorder-pitchShift-stop');

    const recorder = new Tone.Recorder();
    // const reverb = new Tone.Reverb();
    const pitchShift = new Tone.PitchShift({ pitch: 5 });
    const mic = new Tone.UserMedia();

    // マイクをpitchShiftに渡す
    // mic.chain(pitchShift);
    mic.connect(pitchShift);

    // マイクの音がはいったpitchShiftをオーディオとレコーダーに渡す
    pitchShift.toDestination();
    pitchShift.connect(recorder);

    mic
      .open()
      .then(() => {
        console.log('mic.open');
        startBtn.addEventListener('click', () => {
          console.log('recorder start');
          recorder.start();
        });
      })
      .catch((e) => console.log('mic not open'));

    stopBtn.addEventListener('click', async () => {
      console.log('recorder stop');
      const recording = await recorder.stop();
      const url = window.URL.createObjectURL(recording);
      const anchor = document.createElement('a');
      anchor.download = 'recording.webm';
      anchor.href = url;
      anchor.click();
    });
  };

  userMediaWithRecorderPitchShift();

  /* 
    📍 AudioElement + PitchShift
    [RESULT] わからなかった。不要なのかな。Tone.js的に。意味ない。AudioContextはたぶんすでに宣言されてるから。
  */

  const audioElementWithPitchShift = () => {
    const audioContext = new AudioContext();
    const audioElement = document.querySelector('audio');

    const track = audioContext.createMediaElementSource(audioElement);
    const pitchShift = new Tone.PitchShift({ pitch: 2 });

    track.connect(pitchShift).connect(audioContext.destination);

    // const player = new Tone.Player(track).connect(pitchShift);
    const btn = document.getElementById('audioElement-pitchShift');

    btn.addEventListener('click', () => {
      audioContext.start();
    });
  };

  // audioElementWithPitchShift();

  /* 
    📍 AudioElement + PitchShift 2
    - https://tonejs.github.io/docs/15.0.4/classes/UserMedia.html
    - Sourceがオシレーターとか、色々あって、そのなかの UserMediaが...
    - と思ったけど、たぶん違う。SourceのUserMediaはHTMLのaudioではない
    - とりあえずこれも一旦skip
  */
}
