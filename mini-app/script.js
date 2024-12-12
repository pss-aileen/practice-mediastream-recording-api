'use strict';
{
  /* 
    [PROCESS]
    - フィードバック防止のために一旦音声は外に出さない: done
    - マイクの許可を最初にもらう: done
    - ピッチを動かしたらピッチの値が変わるようにしておく（設定ボタンとかいらない）: done
    - 録音ボタンを押したら録音がはじまる: done
    - STOPしたら止まる: done
      - 将来的には20秒ぐらいで止めます
    - 終わったら、エレメントとしてsoundsに展開: done
    - 音楽をそこで確認、削除、ダウンロードできるようにする: done
    - UIをととのえる: done
    - DONE!

    [FUTURE]
    - 録音秒数の表示、制限時間も
    - 「録音中」の雰囲気、テキストを表示する: done
    - 可能だったらファイルのサイズなんかも表示したい...が...
    - あと長さも！
    - ビジュアライザーを出して、録音できているか確認できるようにしたい
    - インプットの種類を将来的に選ぼう
    - ピッチのオンオフ
  */

  // 入力、ボタン系取得
  const recBtn = document.getElementById('rec');
  const stopBtn = document.getElementById('stop');
  const pitch = document.getElementById('pitch');
  const soundContainer = document.getElementById('sound-container');
  const permissionBtn = document.getElementById('permission');
  const permissionCloseBtn = document.getElementById('permission-close');

  // ブラウザのオーディオ取得準備
  const mic = new Tone.UserMedia();

  // 状態
  let micPermission = false;
  let isRecording = false;

  // マイク初回接続許可、通常接続許可
  permissionBtn.addEventListener('click', () => {
    mic
      .open()
      .then(() => {
        console.log('mic open');
        renderPermissionFlag();
        init();
        permissionBtn.disabled = true;
      })
      .catch((e) => console.error('error', e));
  });

  // マイク接続切断
  permissionCloseBtn.addEventListener('click', async () => {
    mic.close();
    renderPermissionFlag();

    console.log('mic close');

    permissionBtn.disabled = false;
    permissionCloseBtn.disabled = true;
    recBtn.disabled = true;
    stopBtn.disabled = true;
  });

  // [❔] 物理的にもう一度許可をもらいなおす方法や、あらためて拒否する方法があるのか知りたい。

  function init() {
    // recorder 初期設定
    const recorder = new Tone.Recorder();

    // pitchShift 初期設定
    const pitchShift = new Tone.PitchShift({ pitch: pitch.value });

    /* 
    色々挑戦
   */

    // そのままのクラッシュした音
    const crusher = new Tone.BitCrusher(4);
    // ディストーション系
    const cheby = new Tone.Chebyshev(2);
    const dist = new Tone.Distortion(0.4);
    // よくわからん
    const shift = new Tone.FrequencyShifter(42);
    const tremolo = new Tone.Tremolo(9, 0.75);
    // ぴちぴちいってます
    const phaser = new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
    });
    const pingPong = new Tone.PingPongDelay('4n', 0.2);
    const autoWah = new Tone.AutoWah(50, 6, -30);
    const autoFilter = new Tone.AutoFilter('4n');

    mic.connect(pitchShift);
    pitchShift.connect(autoWah);
    autoWah.connect(recorder);
    // autoWah.toDestination();

    // 音源をPitchShiftへパス
    // mic.connect(pitchShift);

    // 音源 + PitchShift を recorder にパス
    // pitchShift.connect(recorder);

    // 🧪 確認用: 音源 + PitchShift を スピーカー にパス
    // pitchShift.toDestination();

    recBtn.disabled = false;

    recBtn.addEventListener('click', () => {
      console.log('rec start');
      renderRecordingFlag();

      // レコーディングスタート
      recorder.start();
      recBtn.disabled = true;
      stopBtn.disabled = false;
      recBtn.textContent = 'Recording...';
      recBtn.classList.add('is-recording');
    });

    stopBtn.addEventListener('click', async () => {
      console.log('rec stop');
      renderRecordingFlag();
      recBtn.disabled = false;
      stopBtn.disabled = true;
      permissionCloseBtn.disabled = false;
      recBtn.textContent = 'Record';
      recBtn.classList.remove('is-recording');

      // レコーディング終了、音声のblobが返却される
      const recording = await recorder.stop();
      console.log(recording);

      // Blobから音声のURLを作成する
      const url = window.URL.createObjectURL(recording);

      // 容量を計算する
      const sizeInKB = (recording.size / 1034).toFixed(2);
      const sizeInMB = (sizeInKB / 1034).toFixed(2);
      console.log(sizeInKB + 'kb');
      console.log(sizeInMB + 'mb');

      // 要素の容器を作成
      const containerElement = document.createElement('div');

      // 現在時刻取得
      const date = new Date().getTime();
      const dateElement = document.createElement('p');
      dateElement.textContent = date;

      // audio と anchor を囲む要素作成
      const audioAnchorContainer = document.createElement('div');

      // 音声プレビュー要素作成
      const audioElement = document.createElement('audio');
      audioElement.setAttribute('controls', '');
      audioElement.src = url;

      // ダウンロードリンク作成
      const anchorElement = document.createElement('a');
      anchorElement.download = 'recording.webm';
      anchorElement.href = url;
      anchorElement.textContent = 'DOWNLOAD';

      // 作った要素を描画
      containerElement.appendChild(dateElement);
      audioAnchorContainer.appendChild(audioElement);
      audioAnchorContainer.appendChild(anchorElement);
      containerElement.appendChild(audioAnchorContainer);
      soundContainer.prepend(containerElement);
    });

    // ピッチの値の変更
    pitch.addEventListener('input', () => {
      pitchShift.pitch = pitch.value;
    });

    // permissionがきれたら、stopする
  }

  /* 
    [UTILS]
  */

  function renderPermissionFlag() {
    micPermission = !micPermission;
    const element = document.getElementById('permission-flag');
    element.textContent = micPermission;
  }

  function renderRecordingFlag() {
    isRecording = !isRecording;
    const element = document.getElementById('recording-flag');
    element.textContent = isRecording;
  }
}
