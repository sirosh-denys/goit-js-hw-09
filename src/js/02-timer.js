import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

let dateFrromFlatpicker = 0;

const refs = {
  startBtn: document.querySelector(`button[data-start]`),
  daysField: document.querySelector(`span[data-days]`),
  hoursField: document.querySelector(`span[data-hours]`),
  minutesField: document.querySelector(`span[data-minutes]`),
  secondsField: document.querySelector(`span[data-seconds]`),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    dateFrromFlatpicker = selectedDates[0].getTime();    
    if (dateFrromFlatpicker >= Date.now()) {
      refs.startBtn.removeAttribute(`disabled`);
    } else {
      window.alert('Please choose a date in the future');
    }    
  },
};

const timer = {
  intervalID: null,
  isActive: false,

  onStart() {
    if (this.isActive) {
      return;
    }
    
    if (dateFrromFlatpicker <= Date.now()) {
      window.alert('Please choose a date in the future');
      return;
    }

    this.isActive = true;

    this.intervalID = setInterval(() => {
      const currentDate = Date.now();
      const deltaTime = dateFrromFlatpicker - currentDate;
      const { days, hours, minutes, seconds } = convertMs(deltaTime);

      updateClockface(days, hours, minutes, seconds);
      
      if (
        days === `00` &&
        hours === `00` &&
        minutes === `00` &&
        seconds === `00`
      ) {
        clearInterval(this.intervalID);
        this.isActive = false;
      }
    }, 1000);
  },
};

refs.startBtn.setAttribute(`disabled`, true);
flatpickr('#datetime-picker', options);

refs.startBtn.addEventListener(`click`, () => {
  timer.onStart();
});

function addLeadingZero(value) {
  return String(value).padStart(2, `0`);
}

function convertMs(ms) {
  
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  
  const days = addLeadingZero(Math.floor(ms / day));
  
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function updateClockface(days, hours, minutes, seconds) {
  refs.daysField.textContent = days;
  refs.hoursField.textContent = hours;
  refs.minutesField.textContent = minutes;
  refs.secondsField.textContent = seconds;
}