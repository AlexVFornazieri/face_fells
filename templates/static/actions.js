var uploadProgress = document.getElementById('uploadProgress');
var fileInput = document.getElementById('fileInput');

// The user select a file
fileInput.addEventListener('change', function (e) {
  var file = e.target.files[0];
  if (!file) return;

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
      const storedPath = task.snapshot.ref.fullPath;
      // Create request to vision
      subimitToVision(storedPath);

      // Clear input and progress
      uploadProgress.value = 0;
      fileInput.value = "";
    }
  )
});

function processResult(response) {
  const annotations = response.responses[0].faceAnnotations[0];

  const likelihoods = ['UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'];
  const likelihoodsText = ['Desconhecido', 'Muito improvável', 'Improvável', 'Possível', 'Provavél', 'Muito provavél'];
  const fells = ['joy', 'sorrow', 'anger', 'surprise', 'underExposed', 'blurred'];
  const fellsText = ['Feliz', 'Triste', 'Com raiva', 'Surpresa', 'Pouca exposixão', 'Desfocada'];

  var results = [];

  for (var x = 0; x < fells.length; x++) {
    const fell = fells[x];
    const likelihood = annotations[fell + 'Likelihood'];
    results.push({
      feel: fell,
      score: likelihoods.indexOf(likelihood)
    })
  }

  // Order by likely
  results.sort(dynamicSort('score'));
  showResults(results)
}

function showResults(results) {
  const imageFeels = document.getElementById('imageFeels');
  imageFeels.innerHTML = '';

  for (var x = results.length - 1; x >=0 ; x--) {
    const result = results[x];

    if (result.score >= 2) {
      var span = document.createElement('span');

      var className = result.feel;
      if (result.score === 5) {
        className += ' very';
      }
      span.className = className;

      imageFeels.appendChild(span)
    }
  }

  console.log(results)
}

function subimitToVision(path) {
  var API_KEY = 'AIzaSyDLns0jY32H1bhq-8ESm_LD20XrTTseSA0';

  var requestBody =
    {
      "requests": [
        {
          "image": {
            "source": {
              "gcsImageUri": `gs://${config.storageBucket}/${path}`
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
    if (this.readyState === 4 && this.status === 200) {
      processResult(JSON.parse(this.responseText))
    }
  };
  xhttp.open("POST", `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(requestBody));
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}
