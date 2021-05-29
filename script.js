let videoElem = document.querySelector("video");
let recordBtn = document.querySelector(".record");
let captureImgBtn = document.querySelector(".clickBtn");
let filterArr = document.querySelectorAll(".filter");
let filterOverlayContainer = document.querySelector(".filter_overlay-container");
let timer = document.querySelector(".timing")

let mediarecordingObjectForCurrStream;
let isRecording = false;
let recording = [];
let counter = 0;
let clearObj;

let constraint = {
    audio: true, video: true
}

// promise 
let usermediaPromise = navigator.mediaDevices.getUserMedia(constraint);

usermediaPromise.
    then(function (stream) {
        videoElem.srcObject = stream;

        mediarecordingObjectForCurrStream = new MediaRecorder(stream);

        mediarecordingObjectForCurrStream.ondataavailable = function(e){
            recording.push(e.data);
        }

        // downloading the recording
        mediarecordingObjectForCurrStream.addEventListener("stop", function () {
            // convert recording to url
            // type -> MINE type
            const blob = new Blob(recording, { type: 'video/mp4' });
            const url = window.URL.createObjectURL(blob);

            let a = document.createElement("a");
            a.download = "file.mp4";
            a.href = url;
            a.click();
            recording = []
        })

    }).catch(function (err) {
        console.log(err)
        alert("please allow both microphone and camera");
    });

    recordBtn.addEventListener("click", function(){
        if (mediarecordingObjectForCurrStream == undefined) {
            alert("First select the devices");
            return;
        }

        if(isRecording == false){
            mediarecordingObjectForCurrStream.start();
            recordBtn.innerText = "Recording....";
            startTimer();
        }else{
            mediarecordingObjectForCurrStream.stop();
            recordBtn.innerText = "Record";
            stopTimer();
        }

        isRecording = !isRecording;
    })

    captureImgBtn.addEventListener("click", function(){
        let canvas = document.createElement("canvas");
        canvas.height = videoElem.videoHeight;
        canvas.width = videoElem.videoWidth;

        let tool = canvas.getContext("2d");
        tool.drawImage(videoElem, 0, 0);

        let url = canvas.toDataURL(); // function provided by canvas
        let a = document.createElement("a");
        a.download = "image.png";
        a.href = url;
        a.click();
        a.remove();
    })

    for(let i=0; i<filterArr.length; i++){
        filterArr[i].addEventListener("click", function(){
            let filterColor = filterArr[i].style.backgroundColor;
            filterOverlayContainer.style.backgroundColor = filterColor;
        })
    }

    function startTimer(){
        timer.style.display = "block";
        function fn(){
            let hours = Number.parseInt(counter / 3600);
            let remSeconds = counter % 3600;
            let minutes = Number.parseInt(remSeconds / 60);
            let seconds = remSeconds % 60;

            hours = hours < 10 ? `0${hours}` : hours;
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            timer.innerText = `${hours}:${minutes}:${seconds}`
            counter++;
        }
        clearObj = setInterval(fn, 1000);
    }

    function stopTimer(){
        timer.style.display = "none";
        clearInterval(clearObj);
    }
// to get video elem height and width -> videoHeight and videoWidth