const timeElement = document.getElementById("time");
const dateInput = document.getElementById("alarmDate");
const timeInput = document.getElementById("alarmTime");
const setAlarmButton = document.getElementById("setAlarm");
const alarmsContainer = document.getElementById("alarms");
let alarms = [];
const ringtone = new Audio('ringtone.mp3');

function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    timeElement.textContent = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${period}`;
}

function setAlarm() {
    const alarmDateTime = new Date(`${dateInput.value}T${timeInput.value}`);
    const now = new Date();
    if (alarmDateTime <= now) {
        alert("Invalid time. Please select a future date and time.");
        return;
    }
    if (alarms.some(alarm => alarm.time.getTime() === alarmDateTime.getTime())) {
        alert("You cannot set multiple alarms for the same time.");
        return;
    }
    if (alarms.length >= 3) {
        alert("You can only set a maximum of 3 alarms.");
        return;
    }
    const alarm = {
        time: alarmDateTime,
        timeoutId: setTimeout(() => {
            ringtone.play();
            renderAlarms();
        }, alarmDateTime.getTime() - now.getTime()),
        ringing: false
    };

    alarms.push(alarm);
    renderAlarms();
}

function removeAlarm(alarm) {
    clearTimeout(alarm.timeoutId);
    alarms = alarms.filter(a => a !== alarm);
    renderAlarms();
}

function dismissAlarm() {
    ringtone.pause();
    ringtone.currentTime = 0;
}

function renderAlarms() {
    alarmsContainer.innerHTML = "";
    alarms.forEach(alarm => {
        const alarmElement = document.createElement("div");
        alarmElement.classList.add("alarm");
        alarmElement.innerHTML = `
      <span>${alarm.time.toLocaleString()}</span>
      <button class="delete-alarm">Delete</button>
      <button class="dismiss-alarm">Dismiss</button>
    `;
        alarmElement.querySelector(".delete-alarm").addEventListener("click", () => removeAlarm(alarm));
        alarmElement.querySelector(".dismiss-alarm").addEventListener("click", dismissAlarm);
        alarmsContainer.appendChild(alarmElement);
    });
}

setAlarmButton.addEventListener("click", setAlarm);
setInterval(updateTime, 1000);
updateTime();
