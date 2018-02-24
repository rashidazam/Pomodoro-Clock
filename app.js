var alarm = new Audio("https://telmotrooper.github.io/audio/analog-watch-alarm_daniel-simion.mp3");

function getRemainingTime(t) {
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)));

  if(seconds < 10) {
    seconds = "0" + seconds.toString();
  }
  if(minutes < 10) {
    minutes = "0" + minutes.toString();
  }
  if(hours < 10) {
    hours = "0" + hours.toString();
  }

  /* Writing remaining time to screen */
  $("#timer").html(hours + ":" + minutes + ":" + seconds);
}

function resumeTimerSession() {
  i = setInterval(function() {
    if(sesLenInMilliseconds <= 0) {
			alarm.play();

      resumeTimerBreak();

			clearInterval(i);
		} else {
			sesLenInMilliseconds -= 1000;
      getRemainingTime(sesLenInMilliseconds);
		}
	}, 1000);
}

function resumeTimerBreak() {
  $("#status").html("(In break)");

  j = setInterval(function() {
    if(breakLenInMilliseconds <= 0) {
      alarm.play();
      $("#status").html(""); // Clear status
      clearInterval(j);
    } else {
      breakLenInMilliseconds -= 1000;
      getRemainingTime(breakLenInMilliseconds);
    }
  }, 1000);
}

function startTimer() {
	var breakLen, sesLen;

  if($("#break").val() == "") {
		breakLen = $("#break").attr("placeholder");
	} else {
		breakLen = $("#break").val();
	}

	if($("#session").val() == "") {
		sesLen = $("#session").attr("placeholder");
	} else {
		sesLen = $("#session").val();
	}

  sesLenInMilliseconds = sesLen * 60000;
  breakLenInMilliseconds = breakLen * 60000;
  getRemainingTime(sesLenInMilliseconds);
	$("#status").html("(In session)");
  resumeTimerSession();
}

$(document).ready(function() {
  i = undefined; // Global variable for the interval

  $("#main-btn").on("click", function() {
    /* Switch between 'Start', 'Pause' and 'Resume' */
    if($("#main-btn").html() == "Start") {
      startTimer();
      $("#main-btn").html("Pause");
    } else if($("#main-btn").html() == "Pause") {
        if($("#status").html() == "(In session)") {
          clearInterval(i);
        } else {
          clearInterval(j);
        }
      $("#main-btn").html("Resume");
    } else {  // If 'resume'
      if($("#status").html() == "(In session)") {
        resumeTimerSession();
      } else {
        resumeTimerBreak();
      }

      $("#main-btn").html("Pause");
    }
	});

  $("#reset-btn").on("click", function() {
		if(i != undefined) {
      clearInterval(i);
    }

    $("#main-btn").html("Start");
    $("#timer").html("00:00:00");
    $("#status").html("");
	});
});
