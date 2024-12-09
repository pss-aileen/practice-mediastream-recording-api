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

        // なぜかonClickがきかなかったよ....ほえぇえ？ -> onclick() となっていたのが間違い
        record.onclick = () => {
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          console.log('recorder started');
          record.style.background = 'red';
          record.style.color = 'black';
        };

        let chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        stop.onclick = () => {
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          console.log('recorder stopped');
          record.style.background = '';
          record.style.color = '';
        };

        // ストップおされたら、チュンクを完成系にする

        mediaRecorder.onstop = (e) => {
          console.log('recorder stopped');

          const clipName = prompt('Enter a name for your sound clip');

          const clipContainer = document.createElement('article');
          const clipLabel = document.createElement('p');
          const audio = document.createElement('audio');
          const deleteButton = document.createElement('button');

          audio.setAttribute('controls', '');
          deleteButton.textContent = 'Delete';
          clipLabel.textContent = clipName;

          clipContainer.appendChild(audio);
          clipContainer.appendChild(clipLabel);
          clipContainer.appendChild(deleteButton);
          soundClips.appendChild(clipContainer);

          const blob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });
          chunks = [];
          const audioURL = window.URL.createObjectURL(blob);
          audio.src = audioURL;

          deleteButton.onclick = (e) => {
            let evtTgt = e.target;
            evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
          };
        };
      })
      .catch((err) => {
        console.error('The following getUserMedia error occured:', err);
      });
  } else {
    console.log('getUserMedia not supported on your browser!');
  }
}
