'use strict';

{
  // const synth = new Tone.Synth().toDestination();
  // const now = Tone.now();
  // synth.triggerAttackRelease('C4', '8n', now);
  // synth.triggerAttackRelease('E4', '8n', now + 0.5);
  // synth.triggerAttackRelease('G4', '8n', now + 1);

  const button = document.querySelector('button');
  const player = new Tone.Player({
    url: './audio.mp3',
    // autostart: true,
  });
  const pitch = new Tone.PitchShift({ pitch: 4 }).toDestination();

  player.connect(pitch);

  button.addEventListener('click', () => {
    player.start();
  });
}
