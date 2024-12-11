'use strict';
{
  /* 
    [PROCESS]
    - フィードバック防止のために一旦音声は外に出さない
    - マイクの許可を最初にもらう
    - ピッチを動かしたらピッチの値が変わるようにしておく（設定ボタンとかいらない）
    - 録音ボタンを押したら録音がはじまる
    - STOPしたら止まる
      - 将来的には20秒ぐらいで止めます
    - 終わったら、エレメントとしてsoundsに展開
    - 音楽をそこで確認、削除、ダウンロードできるようにする
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

  const permissionBtn = document.getElementById('permission');
  const permissionCloseBtn = document.getElementById('permission-close');

  const mic = new Tone.UserMedia();

  let micPermission = false;

  // マイク初回接続許可、通常接続許可
  permissionBtn.addEventListener('click', () => {
    mic
      .open()
      .then(() => {
        console.log('mic open');
        micPermission = true;
        renderPermissionFlag();
        init();
        // あとで、きちんと許可されているかされていないかで制御ができたらいいなぁ...
      })
      .catch((e) => console.error('error', e));
  });

  // マイク接続切断
  permissionCloseBtn.addEventListener('click', () => {
    mic.close();
    micPermission = false;
    renderPermissionFlag();
    console.log('mic close');
  });

  // [❔] 物理的にもう一度許可をもらいなおす方法や、あらためて拒否する方法があるのか知りたい。

  function init() {
    const recorder = new Tone.Recorder();
    mic.connect(recorder);
    // mic.toDestination();

    recBtn.addEventListener('click', () => {
      console.log('rec start');
      recorder.start();
    });

    stopBtn.addEventListener('click', async () => {
      console.log('rec stop');
      const recording = await recorder.stop();
      const url = window.URL.createObjectURL(recording);
      const anchor = document.createElement('a');
      anchor.download = 'recording.webm';
      anchor.href = url;
      anchor.click();
    });
  }

  function renderPermissionFlag() {
    const element = document.getElementById('permissionFlag');
    element.textContent = micPermission;
  }
}
