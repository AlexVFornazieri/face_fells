var uploadProgress = document.getElementById('uploadProgress');
var fileInput = document.getElementById('fileInput');

// The user select a file
fileInput.addEventListener('change', function (e) {
  var file = e.target.files[0];

  var storageRef = firebase.storage().ref('uploads/' + file.name);

  var task = storageRef.put(file);

  task.on('state_changed',

    function progress(snap) {
      var progress = (snap.bytesTransferred / snap.totalBytes) * 100;
      uploadProgress.value = progress
    },

    function error(err) {
      console.error(err)
    },

    function complete() {
      var storedPath = task.snapshot.ref.fullPath
      var interval = 'back-end-santos-test.appspot.com'
      var API_KEY = 'AIzaSyDLns0jY32H1bhq-8ESm_LD20XrTTseSA0'

      var requestBody =
        {
          "requests": [
            {
              "image": {
                "source": {
                  "gcsImageUri": `gs://${interval}/${storedPath}`
                }
              },
              "features": [
                {
                  "type": "FACE_DETECTION"
                },
                {
                  "type": "LANDMARK_DETECTION"
                }
              ]
            }
          ]
        };

      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(JSON.parse(this.responseText));
        }
      };
      xhttp.open("POST", `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(requestBody));


    }
  )
});
