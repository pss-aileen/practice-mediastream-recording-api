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
const browserMic = new Tone.UserMedia();
let isBrowerMicOpen = false;

let recorder: Tone.Recorder | null;
let pitchShift: Tone.PitchShift | null;
// let fft =
const fft = new Tone.FFT(128);
// pitchShift.connect(fft);
// console.log(fft);

/* 
  [EVENT] BROWSER MIC ENABLE
*/
browserMicEnableBtn.addEventListener('click', () => {
  // enable browser mic
  browserMic
    .open()
    .then(() => {
      isBrowerMicOpen = true;

      // change element style
      buttonDisabled(true, false, false, true);

      // initialize for recording
      recorder = new Tone.Recorder();
      pitchShift = new Tone.PitchShift();

      const pitchInputValue: number = parseFloat(pitchInput.value);
      pitchShift.pitch = pitchInputValue;
    })
    .catch((e) => console.error('Error:', e));
});

/* 
  [EVENT] BROWSER MIC DISABLE
*/
browserMicDisableBtn.addEventListener('click', () => {
  // disable browser mic
  browserMic.close();
  isBrowerMicOpen = false;

  // change element style
  buttonDisabled(false, true, true, true);
});

/* 
  [EVENT] PITCH SHIFT INPUT
*/
pitchInput.addEventListener('input', (e) => {
  checkValid(pitchShift);
  if (!pitchShift) return;

  const eventTarget = e.target as HTMLInputElement;
  const pitchInputValue: number = parseFloat(eventTarget.value);
  pitchShift.pitch = pitchInputValue;
});

/* 
  [EVENT] RECORD START
*/
recordStartBtn.addEventListener('click', () => {
  checkValid(pitchShift);
  checkValid(recorder);
  checkValid(isBrowerMicOpen);
  if (!(pitchShift && recorder && isBrowerMicOpen)) return;

  // add sound effect: browserMic -> pitchShift
  browserMic.connect(pitchShift);

  // pass audio to recorder: pitchShift -> recorder
  pitchShift.connect(recorder);

  pitchShift.connect(fft);

  // ⭐️
  // const fft = new Tone.FFT();
  // pitchShift.connect(fft);
  // console.log(fft);

  // 🧪 For checking: audio goes to speakers
  // pitchShift.toDestination();

  // start to record
  recorder.start();

  // change element style
  buttonDisabled(true, true, true, false);
  recordStartBtn.classList.add('is-recording');
  recordStartBtn.innerHTML = '<i class="bi bi-record-circle-fill"></i> Recording...';
});

/* 
  RECORD STOP
*/
recordStopBtn.addEventListener('click', async () => {
  checkValid(pitchShift);
  checkValid(recorder);
  if (!(pitchShift && recorder)) return;

  // change element style
  buttonDisabled(true, false, false, true);
  recordStartBtn.classList.remove('is-recording');
  recordStartBtn.innerHTML = '<i class="bi bi-record-circle"></i> Record';

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
  const year = String(nowDate.getFullYear());
  const month = String(nowDate.getMonth()).padStart(2, '0');
  const date = String(nowDate.getDate()).padStart(2, '0');
  const hour = String(nowDate.getHours()).padStart(2, '0');
  const minute = String(nowDate.getMinutes()).padStart(2, '0');
  const second = String(nowDate.getSeconds()).padStart(2, '0');
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
});

/* 
  [FUNCTIONS]
*/
function buttonDisabled(browserMicEnableBtnCondition: boolean, browserMicDisableBtnCondition: boolean, recordStartBtnCondition: boolean, recordStopBtnCondition: boolean): void {
  browserMicEnableBtn.disabled = browserMicEnableBtnCondition;
  browserMicDisableBtn.disabled = browserMicDisableBtnCondition;
  recordStartBtn.disabled = recordStartBtnCondition;
  recordStopBtn.disabled = recordStopBtnCondition;
}

function checkValid(variable: any) {
  if (!variable) {
    throw new Error(`There is no ${variable}.`);
  }
}

/* 
  Visualizer
*/

const canvas = document.getElementById('visualizer') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

let x = 0;
// setInterval(() => {
//   ;
// }, 100);

const MIN_DB = -100;
const MAX_DB = 0;

const width = canvas.width / 64;
const height = canvas.height;

function draw() {
  canvasContext.clearRect(0, 0, canvas.width, height);
  x++;
  canvasContext.fillStyle = '#fff';

  const spectrum = fft.getValue().map((value) => (value === -Infinity ? MIN_DB : value));
  const amplitude = spectrum.map((value) => (value === -Infinity ? 0 : Math.pow(10, value / 20)));

  // const value = fft.getValue()[200];
  // const value = (amplitude[100] * 1000000) / 2;
  // console.log(value);
  // canvasContext.fillRect(20, value, 1, 1);
  // canvasContext.fillRect(x, 0, 2, 200);
  canvasContext.fillRect(x, 0, 2, 200);

  console.log(amplitude[1] * -10000);

  for (let i = 0; i < 64; i++) {
    const value = amplitude[i] * -10000 * 2;
    canvasContext.fillRect(i * width, value + height - 4, width, 4);
  }

  window.requestAnimationFrame(draw);
}

draw();
// window.requestAnimationFrame(test);
