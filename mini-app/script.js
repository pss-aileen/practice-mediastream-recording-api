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

  const mic = new Tone.UserMedia();
  permissionBtn.addEventListener('click', () => {
    mic
      .open()
      .then(() => {
        console.log('mic open');
      })
      .catch((e) => console.error('error', e));
  });

  Tone.UserMedia.enumerateDevices().then((devices) => {
    // print the device labels
    console.log(devices.map((device) => device.label));
  });

  // mic
  //   .open()
  //   .then(() => {
  //     console.log('mic open');
  //   })
  //   .catch((e) => {
  //     console.error('mic not open:', e);
  //   });
}
