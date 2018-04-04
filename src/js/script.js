'use strict';
var offset = 0;
var currentTime = 0;
var OFFSET = -1000 * 60 * 60 * 3;
var init = false;

function getOffset() {
  var timezone = document.getElementById('DropDownTimezone').selectedOptions[0].value;
  offset = +timezone * 60 * 60 * 1000;
}

function normalizeNumber(int) {
  if (int < 10) {
    int = '0' + int;
  }
  return int;
}

// get normolize odometer time
function getTime(time, offset) {
  time += offset;
  var nn = normalizeNumber;
  time = new Date(parseInt(time, 10));
  time = '' + nn(time.getDay()) + nn(time.getMonth() + 1) + nn(time.getFullYear()) +
    nn(time.getHours()) + nn(time.getMinutes()) + nn(time.getSeconds());
  return time;
}

window.onload = function timeUpdate() {

  //Moscow time
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://time100.ru/api.php?type=tu&t=' + (+new Date()));
  xhr.onload = function (e) {
    var res = JSON.parse(xhr.response.slice(7));
    getOffset();
    currentTime = +res.ts;
    if (!init) {
      runClock();
      setInterval(timeUpdate, 1000 * 60);
    }
    init = true;
  };
  xhr.onerror = function (e) {
    console.log(e);
  };
  xhr.send();
};

function runClock() {
  var od = new Odometer({
    el: document.getElementById('clock'),
    format: 'dd.dd.dddd dd:dd:dd',
    value: getTime(currentTime, offset + OFFSET)
  });
  od.render();
  setInterval(function () {
    currentTime += 1000;
    od.update('' + getTime(currentTime, offset + OFFSET));
  }, 1000);
}

