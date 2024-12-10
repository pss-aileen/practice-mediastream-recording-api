'use strict';
{
  const record = document.querySelector('.record');
  const stop = document.querySelector('.stop');
  const soundClips = document.querySelector('.sound-clips');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUDerMedia supported.');

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        record.onclick = () => {
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          record.disabled = true;

          setInterval(() => {
            console.log('10秒経過。STOP。');
            mediaRecorder.stop();
            record.disabled = false;
          }, 10000);
        };

        let chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        stop.onclick = () => {
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          record.disabled = false;
        };

        mediaRecorder.onstop = (e) => {
          console.log('recorder stopped');

          const clipName = new Date().getTime();

          const clipContainer = document.createElement('div');
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
            let eventTarget = e.target;
            URL.revokeObjectURL(audioURL);
            eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);
          };
        };
      })
      .catch((err) => {
        console.error('The following getUserMedia error occured:', err);
      });
  }
}
