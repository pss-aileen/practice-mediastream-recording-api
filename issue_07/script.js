'use strict';

{
  // const synth = new Tone.Synth().toDestination();
  // const now = Tone.now();
  // synth.triggerAttackRelease('C4', '8n', now);
  // synth.triggerAttackRelease('E4', '8n', now + 0.5);
  // synth.triggerAttackRelease('G4', '8n', now + 1);

  const player = new Tone.Player({
    url: './audio.mp3',
    autostart: true,
  });
  const pitch = new Tone.PitchShift({ pitch: 10 }).toDestination();
  // const reverb = new Tone.Reverb().toDestination();
  // const filter = new Tone.Filter(400, 'lowpass').toDestination();
  // const feedbackDelay = new Tone.FeedbackDelay(0, 0).toDestination();

  // connect the player to the feedback delay and filter in parallel
  player.connect(pitch);
  // player.connect(feedbackDelay);
}
