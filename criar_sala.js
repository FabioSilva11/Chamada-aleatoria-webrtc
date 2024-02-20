var peer;
var devInfo = document.getElementById("info-messages");

// Função para criar uma sala
function createRoom() {
  const roomId = document.getElementById("room-input").value.trim();

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;

      peer = new Peer(roomId, { config: turnConfig });

      peer.on("error", function (err) {
        devInfo.innerHTML = "Erro no Peer:" + err;
      });

      peer.on("open", function (id) {
        devInfo.innerHTML = "Sala criada com sucesso! ID da sala:" + id;
      });

      peer.on("call", function (call) {
        var currentCall = call;

        call.answer(localMediaStream);
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then(function (mediaStream) {
            localMediaStream = mediaStream;
            var video_local = document.getElementById("local-video");
            video_local.srcObject = localMediaStream;
            video_local.play();
          })
          .catch(function (err) {
            devInfo.innerHTML =
              "Erro ao obter o stream de mídia não é possível fazer streamer";
          });

        call.on("stream", function (remoteStream) {
          devInfo.innerHTML =
            "Stream recebido do chamador:" + JSON.stringify(remoteStream);
          var remoteVideo = document.getElementById("remote-video");

          remoteVideo.srcObject = remoteStream;
          remoteVideo.play();
        });

        peer.on("close", () => {
          devInfo.innerHTML = "Conexão de vídeo encerrada.";
        });

        document
          .getElementById("end-call-button")
          .addEventListener("click", function () {
            if (peer) {
              peer.destroy();
              devInfo.innerHTML = "a chamada de video vai ser encerrada";
            } else {
              devInfo.innerHTML = "O par não está definido. Não é possível fechar.";
            }
          });
      });
    })
    .catch(function (err) {
      devInfo.innerHTML = "Erro ao obter o stream de mídia não é possível fazer streamer";
    });
}