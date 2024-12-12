import './style.css';
import * as Tone from 'tone';

/* 
  [RULE]
  - コードを完璧に..！
  [FUTURE]
  - プレイヤーをもっと操作しやすくしたい。自分で実装したい。 -> しなくてもいいかも。
*/

// buttons
const browserMicEnableBtn = document.getElementById('browser-mic-enable') as HTMLButtonElement;
const browserMicDisableBtn = document.getElementById('browser-mic-disable') as HTMLButtonElement;
const recordStartBtn = document.getElementById('record-start') as HTMLButtonElement;
const recordStopBtn = document.getElementById('record-stop') as HTMLButtonElement;

// setting
const pitch = document.getElementById('pitch');

// dom
const outputContainer = document.getElementById('output');

browserMicEnableBtn.addEventListener('click', () => {
  console.log('browserMicEnableBtn');
  buttonDisabled(true, false, false, true);
});

browserMicDisableBtn.addEventListener('click', () => {
  console.log('browserMicDisableBtn');
  buttonDisabled(false, true, true, true);
});

recordStartBtn.addEventListener('click', () => {
  console.log('recordStartBtn');
  buttonDisabled(true, true, true, false);
  recordStartBtn.classList.add('is-recording');
  recordStartBtn.innerHTML = '<i class="bi bi-record-circle-fill"></i> Recording...';
});

recordStopBtn.addEventListener('click', () => {
  console.log('recordStopBtn');
  buttonDisabled(true, false, false, true);
  recordStartBtn.classList.remove('is-recording');
  recordStartBtn.innerHTML = '<i class="bi bi-record-circle"></i> Record';
});

// [FUNCTIONS]

function buttonDisabled(browserMicEnableBtnCondition: boolean, browserMicDisableBtnCondition: boolean, recordStartBtnCondition: boolean, recordStopBtnCondition: boolean): void {
  browserMicEnableBtn.disabled = browserMicEnableBtnCondition;
  browserMicDisableBtn.disabled = browserMicDisableBtnCondition;
  recordStartBtn.disabled = recordStartBtnCondition;
  recordStopBtn.disabled = recordStopBtnCondition;
}
