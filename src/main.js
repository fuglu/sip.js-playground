// TODO: Change credentials
var USERNAME = "1234567e0";
var PASSWORD = "XXXXXXXXX";

var ua = new SIP.UA({
  password: PASSWORD,
  uri: "sip:" + USERNAME + "@sipgate.de",
  transportOptions: {
    wsServers: ["wss://tls01.sipgate.de", "wss://tls02.sipgate.de"]
  }
});

var session;

var dial = number => {
  session = ua.invite("sip:" + number + "@sipgate.de", {
    sessionDescriptionHandlerOptions: {
      constraints: { audio: true, video: false }
    }
  });

  var remoteAudio = document.getElementById("remoteAudio");
  var localAudio = document.getElementById("localAudio");

  session.on("trackAdded", function() {
    var pc = session.sessionDescriptionHandler.peerConnection;

    var remoteStream = new MediaStream();
    pc.getReceivers().forEach(function(receiver) {
      remoteStream.addTrack(receiver.track);
    });
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play();

    var localStream = new MediaStream();
    pc.getSenders().forEach(function(sender) {
      localStream.addTrack(sender.track);
    });
    localAudio.srcObject = localStream;
    localAudio.play();
  });
};

var hangup = () => {
  if (session) {
    session.terminate();
  }
};
