import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LiveKitRoom,
  useTracks,
  RoomAudioRenderer,
  VideoTrack,
  useLocalParticipant,
  TrackRefContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import { Video, Mic, MicOff, VideoOff, MonitorUp } from "lucide-react";

interface Member {
  userid: string;
  username: string;
}

interface VideoChatProps {
  roomId: string | undefined;
  currentUserId: string;
  members: Member[]; 
}

const VideoChat: React.FC<VideoChatProps> = ({ roomId, currentUserId, members }) => {
  const [token, setToken] = useState<string | null>(null);

  
  useEffect(() => {
    const joinRoom = async () => {
      try {
        const resp = await axios.get("http://localhost:3000/token", {
          params: { room: roomId, currentUserId },
        });
        setToken(resp.data.token);
      } catch (err) {
        console.error("Error getting token:", err);
      }
    };
    
    if (roomId && currentUserId && !token) {
      joinRoom();
    }
  }, [roomId, currentUserId, token]);

  if (!token) {
    return (
      <div className="flex justify-center">
        <div className="text-white text-sm">Connecting...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl bg-gray-900 bg-opacity-90 rounded-lg overflow-hidden shadow-2xl">
      <LiveKitRoom
        token={token}
        serverUrl="wss://syncboard-4ih1dz8g.livekit.cloud"
        video={true}
        audio={true}
        className="w-full"
        data-lk-theme="default"
      >
        <VideoGrid members={members} /> {/* Pass members to VideoGrid */}
        <RoomAudioRenderer />
        <CustomControls />
      </LiveKitRoom>
    </div>
  );
};

function VideoGrid({ members }: { members: Member[] }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  
  const getUsernameFromId = (userid: string): string => {
    const member = members.find(m => m.userid === userid);
    return member ? member.username : userid;
  };

  
  const participantTracks = new Map();
  
  tracks.forEach((track) => {
    const identity = track.participant.identity;
    const existing = participantTracks.get(identity);
    
    if (!existing || track.source === Track.Source.ScreenShare) {
      participantTracks.set(identity, track);
    }
  });

  const uniqueTracks = Array.from(participantTracks.values());

  if (uniqueTracks.length === 0) {
    return null;
  }

  return (
    <div className={`grid gap-2 p-2 ${
      uniqueTracks.length === 1 
        ? 'grid-cols-1' 
        : 'grid-cols-2'
    }`}>
      {uniqueTracks.map((trackRef) => {
        const userid = trackRef.participant.identity;
        const displayName = getUsernameFromId(userid);
        
        return (
          <TrackRefContext.Provider key={userid} value={trackRef}>
            <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: '120px' }}>
              <VideoTrack
                trackRef={trackRef}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white px-1.5 py-0.5 rounded text-xs">
                {displayName}
                {trackRef.source === Track.Source.ScreenShare && " 🖥️"}
              </div>
            </div>
          </TrackRefContext.Provider>
        );
      })}
    </div>
  );
}

function CustomControls() {
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const toggleAudio = async () => {
    if (!localParticipant) return;
    const newState = !isMuted;
    await localParticipant.setMicrophoneEnabled(!newState);
    setIsMuted(newState);
  };

  const toggleVideo = async () => {
    if (!localParticipant) return;
    const newState = !videoOff;
    await localParticipant.setCameraEnabled(!newState);
    setVideoOff(newState);
  };

  const toggleScreenShare = async () => {
    if (!localParticipant) return;
    try {
      const newState = !isSharing;
      await localParticipant.setScreenShareEnabled(newState);
      setIsSharing(newState);
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-95 p-2 flex justify-center gap-2">
      <button
        onClick={toggleAudio}
        title={isMuted ? "Unmute" : "Mute"}
        className={`px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
          isMuted
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        } text-white`}
      >
        {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
      </button>

      <button
        onClick={toggleVideo}
        title={videoOff ? "Start Video" : "Stop Video"}
        className={`px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
          videoOff
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
       {videoOff ? <VideoOff size={16} /> : <Video size={16} />}
      </button>

    <button
        onClick={toggleScreenShare}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${
          isSharing
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-slate-600 hover:bg-slate-500"
        } text-white shadow-md`}
      >
        <MonitorUp size={16} />
        <span className="text-xs">{isSharing ? "Stop" : "Share"}</span>
      </button>
    </div>
  );
}

export default VideoChat;