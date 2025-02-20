



import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

const server_url = 'https://lms4-7d49.onrender.com/';

let connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function VideoMeetComponent() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screen, setScreen] = useState(false);
  const [showModal, setModal] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [newMessages, setNewMessages] = useState(0);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState('');
  const [videos, setVideos] = useState([]);
  // const [role, setRole] = useState('student'); // Default role is student

  const {role} = useSelector((state)=>state.auth);
  console.log(role);
  const videoRef = useRef([]);

  useEffect(() => {
    getPermissions();
  }, []);

  const getDislayMedia = () => {
    if (role === 'INSTRUCTOR' && screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log('Video permission granted');
      } else {
        setVideoAvailable(false);
        console.log('Video permission denied');
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log('Audio permission granted');
      } else {
        setAudioAvailable(false);
        console.log('Audio permission denied');
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  const getMedia = () => {
    if (role === 'INSTRUCTOR') {
      setVideo(videoAvailable);
      setAudio(audioAvailable);
    }
    connectToSocketServer();
  };

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id]
        .createOffer()
        .then((description) => {
          connections[id]
            .setLocalDescription(description)
            .then(() => {
              socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
            })
            .catch((e) => console.log(e));
        });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id]
              .createOffer()
              .then((description) => {
                connections[id]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
                  })
                  .catch((e) => console.log(e));
              });
          }
        })
    );
  };

  const getUserMedia = () => {
    if (role === 'INSTRUCTOR' && ((video && videoAvailable) || (audio && audioAvailable))) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
           
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id]
        .createOffer()
        .then((description) => {
          connections[id]
            .setLocalDescription(description)
            .then(() => {
              socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
            })
            .catch((e) => console.log(e));
        });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  const gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === 'offer') {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit('signal', fromId, JSON.stringify({ sdp: connections[fromId].localDescription }));
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e) => console.log(e));
      }
    }
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-call', window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on('chat-message', addMessage);

      socketRef.current.on('user-left', (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on('user-joined', (id, clients) => {
        // const isTeacher = clients.length === 1; // First user is the teacher
        // setRole(isTeacher ? 'teacher' : 'student');

        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit('signal', socketListId, JSON.stringify({ ice: event.candidate }));
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find((video) => video.socketId === socketListId);

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId ? { ...video, stream: event.stream } : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
                role: role, // Add role to the video object
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null && role === 'INSTRUCTOR') {  //////
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              if (role === 'INSTRUCTOR') {
                connections[id2].addStream(window.localStream);
              }
            } catch (e) {}

            connections[id2]
              .createOffer()
              .then((description) => {
                connections[id2]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit('signal', id2, JSON.stringify({ sdp: connections[id2].localDescription }));
                  })
                  .catch((e) => console.log(e));
              });
          }
        }
      });
    });
  };

  const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement('canvas'), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const handleVideo = () => {
    if (role === 'INSTRUCTOR') {
      setVideo(!video);
    }
  };

  const handleAudio = () => {
    if (role === 'INSTRUCTOR') {
      setAudio(!audio);
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  const handleScreen = () => {
    if (role === 'INSTRUCTOR') {
      setScreen(!screen);
    }
  };

  const handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = '/';
  };

  const openChat = () => {
    setModal(true);
    setNewMessages(0);
  };

  const closeChat = () => {
    setModal(false);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [...prevMessages, { sender: sender, data: data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  const sendMessage = () => {
    socketRef.current.emit('chat-message', message, username);
    setMessage('');
  };

  const connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div className="flex flex-col h-screen p-4 text-white bg-gray-900">
      {askForUsername ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <h2 className="text-2xl font-bold">Enter into Lobby</h2>
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            className="bg-white rounded"
          />
          <Button variant="contained" onClick={connect} className="bg-blue-500 hover:bg-blue-600">
            Connect
          </Button>
          <div>
            <video ref={localVideoref} autoPlay muted className="object-cover w-48 rounded-lg h-36"></video>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="p-6 bg-gray-800 rounded-lg w-96">
                <h1 className="mb-4 text-2xl font-bold">Chat</h1>
                <IconButton onClick={closeChat} className="text-white hover:bg-gray-700">
                    <CloseIcon />
                  </IconButton>
                <div className="h-64 mb-4 overflow-y-auto">
                  {messages.length !== 0 ? (
                    messages.map((item, index) => (
                      <div key={index} className="mb-4">
                        <p className="font-bold">{item.sender}</p>
                        <p>{item.data}</p>
                      </div>
                    ))
                  ) : (
                    <p>No Messages Yet</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    id="outlined-basic"
                    label="Enter Your chat"
                    variant="outlined"
                    className="flex-grow bg-gray-700 rounded"
                  />
                  <Button variant="contained" onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 space-x-4 bg-gray-800">
            {role === 'INSTRUCTOR' && (
              <>
                <IconButton onClick={handleVideo} className="text-white hover:bg-gray-700">
                  {video ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
                <IconButton onClick={handleAudio} className="text-white hover:bg-gray-700">
                  {audio ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
              </>
            )}
            <IconButton onClick={handleEndCall} className="text-red-500 hover:bg-gray-700">
              <CallEndIcon />
            </IconButton>
            {screenAvailable && role === 'INSTRUCTOR' && (
              <IconButton onClick={handleScreen} className="text-white hover:bg-gray-700">
                {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
              </IconButton>
            )}
            <Badge badgeContent={newMessages} max={999} color="orange">
              <IconButton onClick={() => setModal(!showModal)} className="text-white bg-black z-[100] hover:bg-gray-700">
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          {/* <div className="flex flex-wrap gap-4 mt-4">
            {videos
              .filter((video) => video.role === 'INSTRUCTOR') // Only show teacher's video
              .map((video) => (
                <div key={video.socketId} className="w-64 h-48 overflow-hidden bg-gray-700 rounded-lg">
                  <video
                    data-socket={video.socketId}
                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                    playsInline // Use playsInline instead of playsinline
                    className="object-cover w-full h-full"
                  ></video>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} */}

           {/* <video
            ref={localVideoref}
            autoPlay
            muted
            className="fixed object-cover w-48 rounded-lg shadow-lg h-36 bottom-20 right-4"
          ></video>  */}

           {/* <div className="flex flex-wrap gap-4 mt-4">
            {videos.map((video) => (
              <div key={video.socketId} className="w-64 h-48 overflow-hidden bg-gray-700 rounded-lg">
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  className="object-cover w-full h-full"
                ></video>
              </div>
            ))}
          </div>  */}
           <div>
      {role === "INSTRUCTOR" && (
        <div>
          <h2>Instructors Video</h2>
          <video ref={localVideoref} autoPlay playsInline muted />
          <button >Start Class</button>
          <button >End Class</button>
        </div>
      )}

      {role !== "INSTRUCTOR" && videos.length > 0 && (
        <div>
          <h2>Live Class</h2>
          {videos.map((video) => (
            <video key={video.socketId} autoPlay playsInline ref={(ref) => ref && (ref.srcObject = video.stream)} />
          ))}
        </div>
      )}
    </div>
        </div>
      )}
    </div>
  );
}
