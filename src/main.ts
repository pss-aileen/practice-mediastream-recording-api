import './style.css';
import * as Tone from 'tone';

/* 
  PREPARE ELEMENTS
*/

// input element for event
const browserMicEnableBtn = document.getElementById('browser-mic-enable') as HTMLButtonElement;
const browserMicDisableBtn = document.getElementById('browser-mic-disable') as HTMLButtonElement;
const recordStartBtn = document.getElementById('record-start') as HTMLButtonElement;
const recordStopBtn = document.getElementById('record-stop') as HTMLButtonElement;
const pitchInput = document.getElementById('pitch') as HTMLInputElement;

// element for audio output
const outputContainer = document.getElementById('outputs') as HTMLElement;

/* 
  PREPARE FOR AUDIO
*/
let browserMic: Tone.UserMedia | null;
let isBrowerMicOpen = false;

let recorder: Tone.Recorder | null;
let pitchShift: Tone.PitchShift | null;

let fft: Tone.FFT | null;

/* 
  [EVENT] BROWSER MIC ENABLE
*/
browserMicEnableBtn.addEventListener('click', async () => {
  browserMic = new Tone.UserMedia();

  // enable browser mic
  browserMic
    .open()
    .then(() => {
      if (!browserMic) return;
      isBrowerMicOpen = true;

      // change element style
      setButtonDisabled({ enable: true, disable: false, start: false, stop: true });

      // initialize for recording
      recorder = new Tone.Recorder();
      pitchShift = new Tone.PitchShift();
      fft = new Tone.FFT(128);

      const pitchInputValue: number = parseFloat(pitchInput.value);
      pitchShift.pitch = pitchInputValue;

      browserMic.connect(fft);
      draw();
    })
    .catch((e) => console.error('Error:', e));
});

/* 
  [EVENT] BROWSER MIC DISABLE
*/
browserMicDisableBtn.addEventListener('click', () => {
  if (!browserMic) return;

  // disable browser mic
  browserMic.close();
  isBrowerMicOpen = false;

  // change element style
  setButtonDisabled({ enable: false, disable: true, start: true, stop: true });
});

/* 
  [EVENT] PITCH SHIFT INPUT
*/
pitchInput.addEventListener('input', (e) => {
  if (!pitchShift) return;

  const eventTarget = e.target as HTMLInputElement;
  const pitchInputValue: number = parseFloat(eventTarget.value);
  pitchShift.pitch = pitchInputValue;
});

/* 
  [EVENT] RECORD START
*/
recordStartBtn.addEventListener('click', () => {
  if (!(pitchShift && recorder && isBrowerMicOpen && browserMic && fft)) return;

  // add sound effect: browserMic -> pitchShift
  browserMic.disconnect(fft);
  browserMic.connect(pitchShift);

  // pass audio to recorder: pitchShift -> recorder
  pitchShift.connect(recorder);
  pitchShift.connect(fft);

  // 🧪 For checking: audio goes to speakers
  // pitchShift.toDestination();

  // start to record
  recorder.start();

  // change element style
  setButtonDisabled({ enable: true, disable: true, start: true, stop: false });
  recordStartBtn.classList.add('is-recording');
  recordStartBtn.innerHTML = '<i class="bi bi-record-circle-fill"></i> Recording...';
});

/* 
  RECORD STOP
*/
recordStopBtn.addEventListener('click', async () => {
  if (!(pitchShift && recorder && browserMic && fft)) return;

  // change element style
  setButtonDisabled({ enable: true, disable: false, start: false, stop: true });

  recordStartBtn.classList.remove('is-recording');
  recordStartBtn.innerHTML = '<i class="bi bi-record-circle"></i> START';

  // stop recording: get audio from recorder, return is blob
  const recording = await recorder.stop();

  // generate audio url from blob
  const url = window.URL.createObjectURL(recording);

  // calcurate audio size
  const sizeInKB = (recording.size / 1024).toFixed(2);

  // [RENDER ELEMENTS]
  const containerWrapper = document.createElement('dl');
  const titleContainer = document.createElement('dt');
  const bodyContainer = document.createElement('dd');

  // title element: time
  const nowDate = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = nowDate.getFullYear().toString();
  const month = pad(nowDate.getMonth());
  const date = pad(nowDate.getDate());
  const hour = pad(nowDate.getHours());
  const minute = pad(nowDate.getMinutes());
  const second = pad(nowDate.getSeconds());
  const titleText = year + month + date + '-' + hour + minute + '-' + second;
  const titleElement = document.createElement('span');
  titleElement.classList.add('title');
  titleElement.textContent = titleText;

  // audio size element
  const audioSizeElement = document.createElement('span');
  audioSizeElement.classList.add('size');
  audioSizeElement.textContent = sizeInKB + 'KB';

  // label element
  const labelElement = document.createElement('span');
  labelElement.classList.add('label');
  labelElement.textContent = 'NEW';

  // audio element
  const audioElement = document.createElement('audio');
  audioElement.setAttribute('controls', '');
  audioElement.src = url;

  // download link
  const downloadElement = document.createElement('a');
  downloadElement.download = 'record-voice-' + titleText + '.webm';
  downloadElement.href = url;
  downloadElement.innerHTML = '<i class="bi bi-cloud-arrow-down-fill"></i> DOWNLOAD';

  // render elements
  titleContainer.appendChild(titleElement);
  titleContainer.appendChild(audioSizeElement);
  titleContainer.appendChild(labelElement);
  bodyContainer.appendChild(audioElement);
  bodyContainer.appendChild(downloadElement);
  containerWrapper.appendChild(titleContainer);
  containerWrapper.appendChild(bodyContainer);
  outputContainer.prepend(containerWrapper);

  pitchShift.disconnect(fft);
  browserMic.connect(fft);
});

/* 
  [FUNCTIONS]
*/

function setButtonDisabled(states: { enable: boolean; disable: boolean; start: boolean; stop: boolean }) {
  browserMicEnableBtn.disabled = states.enable;
  browserMicDisableBtn.disabled = states.disable;
  recordStartBtn.disabled = states.start;
  recordStopBtn.disabled = states.stop;
}

/* 
  [VISUALIZER]
*/

const canvas = document.getElementById('visualizer') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

function draw() {
  if (!fft) return;

  const spectrum = fft.getValue();

  const minDB = -100;
  const maxDB = 0;
  const canvasHeight = canvas.height;

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / spectrum.length;

  spectrum.forEach((value, index) => {
    const height = Math.max(0, (canvasHeight * (value - minDB)) / (maxDB - minDB));
    const x = index * barWidth;

    canvasContext.fillStyle = 'red';
    canvasContext.fillRect(x + 1, canvasHeight - height + 1, barWidth - 1.5, height);

    canvasContext.fillStyle = 'blue';
    canvasContext.fillRect(x + 0.5, canvasHeight - height + 1, barWidth - 1.5, height);

    canvasContext.fillStyle = '#ffffff';
    canvasContext.fillRect(x, canvasHeight - height, barWidth - 1.5, height);
  });
  window.requestAnimationFrame(draw);
}
