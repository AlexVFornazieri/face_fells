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
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                window.location = window.location.protocol
                    + '//' + window.location.host + '/?url=' + encodeURI(downloadURL)
            });
        }
    )
});
