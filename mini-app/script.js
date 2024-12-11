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
    - UIをととのえる
    - DONE!

    [FUTURE]
    - 録音秒数の表示、制限時間も
    - 「録音中」の雰囲気、テキストを表示する
    - 可能だったらファイルのサイズなんかも表示したい...が...
    - あと長さも！
    - インプットの種類を将来的に選ぼう
  */

  const recBtn = document.getElementById('rec');
  const stopBtn = document.getElementById('stop');
  const pitch = document.getElementById('pitch');
  const soundContainer = document.getElementById('sound');

  const permissionBtn = document.getElementById('permission');
  const permissionCloseBtn = document.getElementById('permission-close');

  const mic = new Tone.UserMedia();

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
        // あとで、きちんと許可されているかされていないかで制御ができたらいいなぁ...
      })
      .catch((e) => console.error('error', e));
  });

  // マイク接続切断
  permissionCloseBtn.addEventListener('click', () => {
    mic.close();
    renderPermissionFlag();
    console.log('mic close');
  });

  // [❔] 物理的にもう一度許可をもらいなおす方法や、あらためて拒否する方法があるのか知りたい。

  function init() {
    // recorder 初期設定
    const recorder = new Tone.Recorder();

    // pitchShift 初期設定
    const pitchShift = new Tone.PitchShift({ pitch: 1 });

    // 音源をPitchShiftへパス
    mic.connect(pitchShift);

    // 音源 + PitchShift を recorder にパス
    pitchShift.connect(recorder);

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
    });

    stopBtn.addEventListener('click', async () => {
      console.log('rec stop');
      renderRecordingFlag();
      recBtn.disabled = false;

      // レコーディング終了、音声のblobが返却される
      const recording = await recorder.stop();

      // Blobから音声のURLを作成する
      const url = window.URL.createObjectURL(recording);

      // 要素の容器を作成
      const containerElement = document.createElement('div');

      // 現在時刻取得
      const date = new Date();
      const dateElement = document.createElement('p');
      dateElement.textContent = date;

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
      containerElement.appendChild(audioElement);
      containerElement.appendChild(anchorElement);
      soundContainer.appendChild(containerElement);
    });

    // ピッチの値の変更
    pitch.addEventListener('input', () => {
      pitchShift.pitch = pitch.value;
    });
  }

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
