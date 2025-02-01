import { TOTP } from '../dist/TOTP.js';
import * as base32 from 'hi-base32';

const key = 'NNSXS==='; // Demo
let code;
let count;

async function generateCode() {
    const totp = new TOTP();

    code = await totp.gen(key);
}

async function main(ftg) {
    await generateCode();
    console.log(`Generated code: ${code}`);
    if (ftg) {
        document.getElementById("keychain").innerHTML += '<div class="keyslot" id="tempkeyslot"><div class="keycontents"><span class="keyname" id="keyname">' + base32.decode(key) + '<span class="count" id="count"> &#183; Grabbing Time...</span></span><br><span class="key" id="keydisplay">' + code + '</span></div></div>';
    } else {
        document.getElementById("keyname").innerHTML = base32.decode(key);
        document.getElementById("keydisplay").innerHTML = code;
    }
}


main(true)

/* function resetall() {
    startCountdown(30)
}
function startCountdown(seconds) {
    let timeRemaining = seconds;
  
    const intervalId = setInterval(() => {
      if (timeRemaining === 0) {
        clearInterval(intervalId);
        console.log("Regenerating Code....");
        document.getElementById("count").innerHTML =  "";
        main();
      } else {
        timeRemaining--;
        document.getElementById("count").innerHTML = " &#183; " + timeRemaining + "s until regeneration...";
        if (timeRemaining < 10) {
            document.getElementById("keydisplay").style = "color: #d42f2f;";
        } else if (timeRemaining < 20) {
            document.getElementById("keydisplay").style = "color: #d4ce2f;";
        } else {
            document.getElementById("keydisplay").style = "color: #2c9641;";
        }
      }
    }, 1000); // 1000 milliseconds = 1 second
  }

setInterval(resetall(), 30000); */

function startCountdown() {
    let timeLeft = 30;
  
    const countdown = setInterval(() => {
        console.log(timeLeft); // Or update your HTML element here
        document.getElementById("count").innerHTML = " &#183; " + timeLeft + "s until regeneration...";
        if (timeLeft < 10) {
            document.getElementById("keydisplay").style = "color: #d42f2f;";
        } else if (timeLeft < 20) {
            document.getElementById("keydisplay").style = "color:rgb(219, 213, 38);";
        } else {
            document.getElementById("keydisplay").style = "color: #2c9641;";
        }
      if (timeLeft === 1) {
        main(false);
        timeLeft = 30;
        clearInterval(countdown);
      } else {
        timeLeft--;
      }
    }, 1000); // 1000 milliseconds = 1 second
  }
  

setInterval(startCountdown(),30000)