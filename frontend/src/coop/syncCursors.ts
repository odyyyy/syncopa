const RTCConfig = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.nextcloud.com:443",
      ],
    },
  ],
};

const setupWebRTC = () => {
  const peer = new RTCPeerConnection(RTCConfig);

  const dataChannel = peer.createDataChannel("cursor");

  dataChannel.onopen = () => {
    dataChannel.send("Hello");
  };

  dataChannel.onclose = () => {};
};
