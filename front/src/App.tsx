import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

function App() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isCallActive) {
      startVideo();
    } else {
      stopVideo();
    }
  }, [isCallActive]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopVideo = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleCall = () => {
    setIsCallActive(!isCallActive);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl aspect-video">
        {/* Remote Video (Full Screen) */}
        <div className="w-full h-full rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-800">
          {isCallActive ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center">
                <Video size={48} className="text-zinc-600" />
              </div>
              <p className="text-xl font-light">Waiting for someone to join...</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture in Picture) */}
        <div className="absolute top-4 right-4 w-48 aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-800 bg-zinc-900">
          {isCallActive ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700">
              <Video size={24} />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-4 p-4 rounded-full bg-zinc-900/90 border border-zinc-800">
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-200 ${
                isVideoEnabled 
                  ? 'bg-zinc-800 hover:bg-zinc-700' 
                  : 'bg-red-500/80 hover:bg-red-600/80'
              }`}
            >
              {isVideoEnabled ? (
                <Video size={24} className="text-zinc-300" />
              ) : (
                <VideoOff size={24} className="text-white" />
              )}
            </button>

            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all duration-200 ${
                isAudioEnabled 
                  ? 'bg-zinc-800 hover:bg-zinc-700' 
                  : 'bg-red-500/80 hover:bg-red-600/80'
              }`}
            >
              {isAudioEnabled ? (
                <Mic size={24} className="text-zinc-300" />
              ) : (
                <MicOff size={24} className="text-white" />
              )}
            </button>

            <button
              onClick={toggleCall}
              className={`p-4 rounded-full transition-all duration-200 ${
                isCallActive 
                  ? 'bg-red-500/80 hover:bg-red-600/80' 
                  : 'bg-green-500/80 hover:bg-green-600/80'
              }`}
            >
              {isCallActive ? (
                <PhoneOff size={24} className="text-white" />
              ) : (
                <Phone size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;