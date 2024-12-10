'use strict';
{
  const audioContext = new AudioContext();

  const audioElement = document.querySelector('audio');
  const track = audioContext.createMediaElementSource(audioElement);
  track.connect(audioContext.destination);

  const playButton = document.querySelector('button');
  playButton.addEventListener(
    'click',
    () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (playButton.dataset.playing === 'false') {
        audioElement.play();
        playButton.dataset.playing = 'true';
      } else if (playButton.dataset.playing === 'true') {
        audioElement.pause();
        playButton.dataset.playing = 'false';
      }
    },
    false
  );

  audioElement.addEventListener("ended", () => {
    playButton.dataset.playing = "false";
  }, false);
}
