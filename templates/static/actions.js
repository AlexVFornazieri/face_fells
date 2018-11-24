// likelihoods intensity enum
const likelihoods = ['UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'];
const likelihoodsText = ['Desconhecido', 'Muito improvável', 'Improvável', 'Possível', 'Provavél', 'Muito provavél'];

// Returned feelings list
const fells = ['joy', 'sorrow', 'anger', 'surprise', 'underExposed', 'blurred'];
const fellsText = ['Feliz', 'Triste', 'Com raiva', 'Surpresa', 'Pouca exposixão', 'Desfocada'];

// DOM elements
const uploadProgress = document.getElementById('uploadProgress');
const fileInput = document.getElementById('fileInput');
const analysedImage = document.getElementById('analysedImage');
const imageFeels = document.getElementById('imageFeels');


// The user select a file
fileInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    imageFeels.innerHTML = '';
    fileInput.style.display = 'none';
    analysedImage.style.display = 'none';
    uploadFile(file);
  }
});

/**
 * Upload a file to Firebase Storage
 * @param file
 */
function uploadFile(file) {
  const storageRef = firebase.storage().ref('uploads/' + file.name);
  const task = storageRef.put(file);

  task.on('state_changed',
    function progress(snap) {
      var progress = (snap.bytesTransferred / snap.totalBytes) * 100;
      uploadProgress.value = progress
    },

    function error(err) {
      console.error(err);
    },

    function complete() {
      task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        analysedImage.src = downloadURL;
      });
      const storedPath = task.snapshot.ref.fullPath;
      // Create request to vision
      submitToVision(storedPath);

      // Clear input and progress
      uploadProgress.removeAttribute('value');
      fileInput.value = "";
    }
  )
}


/**
 * Vision annotate faces detection
 * @param path
 */
function submitToVision(path) {
  const API_KEY = 'AIzaSyDLns0jY32H1bhq-8ESm_LD20XrTTseSA0';

  const requestBody =
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

/**
 * Process Vision result
 * @param response
 */
function processResult(response) {
  if (!response.responses[0].faceAnnotations) {
    console.log("Não encontrado faces");
    // TODO Inform user
    return
  }
  const annotations = response.responses[0].faceAnnotations[0];

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
  showResults(results.reverse())
}

/**
 * Show result in DOM
 * @param results
 */
function showResults(results) {
  imageFeels.innerHTML = '';
  uploadProgress.style.display = 'none';
  analysedImage.style.display = 'block';

  if (results[0].score >= 2) {
    appendFeel(results[0].feel);
    if (results[1].score === 5) {
      appendFeel(results[1].feel)
    }
  } else {
    appendFeel('unknown')
  }

  console.log(results)
}

function appendFeel(feel) {
  var span = document.createElement('span');
  var className = feel;
  span.className = className;
  imageFeels.appendChild(span);
}

/**
 * Helper to sort array by a object property
 * @param property
 * @returns {function(*, *): number}
 */
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
