'use strict';
{
  /*
  
    [📍PROCESS] Web Audio API にアクセスするための準備
    - これを使って全ての機能にアクセスする。
  */
  const audioContext = new AudioContext();

  /*
    [PROCESS] HTMLに設置した Audio にアクセスし、それを AudioContext で扱う準備
    - ソースを使うには、エレメントを取得して、それを AudioContext に通す必要がある。
  */

  // audio element を取得
  const audioElement = document.querySelector('audio');

  // audio element を AudioContext にセットして、扱えるようにする
  const track = audioContext.createMediaElementSource(audioElement);

  //  gainNodeの 作成
  const gainNode = audioContext.createGain();

  /* 
    [METHOD OVERVIEW] MediaElementAudioSourceNode オブジェクトを作成する
    [SYNTAX] createMediaElementSource(myMediaElement)
    - [PARAMETERS] myMediaElement: HTMLMediaElement object
    - [RETURN VALUE] MediaElementAudioSourceNode
  */

  /*
    [MEMO] ブラウザでのオートプレイのポリシーについて
    - permissionなしだとブロックされる
    - 音声に関するスクリプトを動かす前に、許可が必要
    - なので、ユーザーのクリックイベントを使って、ブロックされることを防いで再生できるようにする
  */

  /*
    [MEMO]
    - 今すでに input node を作成している、audio elementをAPIに通すことによって
    - 大半部分で、私は output node を作る必要はない
    - ただ、他の node を BaseAudioContext.destination につなげば OK、現状はね。
  */

  /*
    [📍PROCESS] 音の入り口と出口を設定する
  */

  // 🌈 API を通してセットした audio (source) を context.destination (出力先) に接続

  // 1. 初回: audio(source) -> destination
  // track.connect(audioContext.destination);

  // 2. gainNode 追加後: audio(source) -> modification -> destination
  track.connext(gainNode).connect(audioContext.destination);

  /*
    [📍PROCESS] 再生、停止ボタン、イベントを設定する
  */

  // プレイボタンを取得
  const playButton = document.querySelector('button');

  // プレイボタンのイベントを設定
  playButton.addEventListener('click', () => {
    // ⭐️ AudioContextが保留状態かどうかを確認する -> autoplay policy ? ちょっと疑問が残る
    // AudioContextの状態が 保留状態の時
    // suspended は、つるした、ぶらさがった、漂っている、保留の、停止したなどの意味
    if (audioContext.state === 'suspended') {
      // AudioContext が再開される
      // resume は、再び始まる、復旧させる、回復するなどの意味
      audioContext.resume();

      /* 
        [METHOD OVERVIEW] AudioContextを再開する、回復させる
        [SYNTAX] AudioContext.resume()
        - [PARAMETERS] none
        - [RETURN VALUE] Promise
      */
    }

    // ⭐️ 状態にあわせて、track の Play か Pause を行う
    if (playButton.dataset.playing === 'false') {
      audioElement.play();
      playButton.dataset.playing = 'true';
    } else if (playButton.dataset.playing === 'true') {
      audioElement.pause();
      playButton.dataset.playing = 'false';
    }

    /* 
      [MEMO] オーディオの再生は、audioElementを行っていて、Web Audio API が行っているわけではない！
    */
  });

  // オーディオ再生が終わった時の挙動を設定
  audioElement.addEventListener(
    'ended',
    () => {
      playButton.dataset.playing = 'false';
    },
    // この boolean はイベントリスナーのオプション
    // イベントの伝搬方式を決定している
    // 一応デフォルトの設定、バブリングフェースというもので伝搬している。ターゲット要素から親要素へ
    // trueに なると、キャプチャリングフェースという伝搬方法になる、親要素からターゲットへ
    // [DETAIL] https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    // [DETAIL] https://www.quirksmode.org/js/events_order.html#link4
    false
  );

  /*
    [📍PROCESS] 音の操作
  */

  /*
    [📍PROCESS] 音量の調整にまつわる設定
    - gainNodeを、コード冒頭あたりのtrackの前で宣言。
    - track に connext で接続
  */
  
}
