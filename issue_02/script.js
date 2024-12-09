'use strict';
{
  const record = document.querySelector('.record');
  const stop = document.querySelector('.stop');
  const soundClips = document.querySelector('.sound-clips');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        // メディアストリームの作成に成功したら、 new Media Recorder instance を作る
        // で、MediaRecorder()がストリームを直接渡してくれる
        const mediaRecorder = new MediaRecorder(stream);
        // たくさんメソッドがある。レコードをコントロールするための

        // なぜかonClickがきかなかったよ....ほえぇえ？
        record.onclick = () => {
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          console.log('recorder started');
          record.style.background = 'red';
          record.style.color = 'black';
        };

        // record.addEventListener('click', () => {
        //   mediaRecorder.start();
        //   console.log(mediaRecorder.state);
        //   console.log('recorder started');
        //   record.style.background = 'red';
        //   record.style.color = 'black';
        // });
      })
      .catch((err) => {
        console.error('The following getUserMedia error occured:', err);
      });
  } else {
    console.log('getUserMedia not supported on your browser!');
  }
}
