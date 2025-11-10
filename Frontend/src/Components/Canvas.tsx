import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor, Tldraw } from "@tldraw/tldraw";
import '@tldraw/tldraw/tldraw.css';
import { CustomToolBar } from "./CustomToolBar";
import VideoChat from "./VideoChat";
import { MembersDropdown } from "./Members";
import { ShareDropdown } from "./Share";
import { Header } from "./Header";

interface member {
  userid: string;
  username: string;
}

export function Canvas() {
  const navigate = useNavigate();
  const { Roomname, Roomid } = useParams();
  const [Host, setHost] = useState(null);
  const [Members, setMembers] = useState<member[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [socket, setsocket] = useState<WebSocket | null>(null);
  const [editor, seteditor] = useState<Editor | null>(null);
  const [isApplyingRemoteChanges, setIsApplyingRemoteChanges] = useState(false);

  // Handle editor mount
  const handleEditorMount = useCallback((editorInstance: Editor) => {
    seteditor(editorInstance);
  }, []);

  // Setup WebSocket
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found!");
      navigate("/SignupLogin");
      return;
    }

    const ws = new WebSocket(`https://syncboard-ws.onrender.com?token=${token}`);
    setsocket(ws);

    ws.onopen = () => {
      setTimeout(() => {
        ws.send(JSON.stringify({
          type: "join_room",
          Roomid: Roomid
        }));
      }, 2000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "MEMBERS") {
        console.log("Members update:", msg);
        setHost(msg.host);
        setMembers(msg.members);

        const currentMember = msg.members.find((m: member) => m.username === "You");
        if (currentMember && !currentUserId) {
          setCurrentUserId(currentMember.userid);
        }
      }

      if (msg.type === "PATCH" && editor) {
        try {
          let patches = msg.patches;

          if (typeof patches === "string") {
            patches = JSON.parse(patches);
          }
          patches = Array.isArray(patches) ? patches : [patches];

          setIsApplyingRemoteChanges(true);

          editor.store.mergeRemoteChanges(() => {
            for (const patch of patches) {
              if (patch.type === "added" || patch.type === "updated") {
                if (patch.record) {
                  editor.store.put([patch.record]);
                }
              } else if (patch.type === "removed") {
                if (patch.id) {
                  editor.store.remove([patch.id]);
                }
              }
            }
          });

          setTimeout(() => setIsApplyingRemoteChanges(false), 50);
        } catch (err) {
          console.error("Failed to apply patches:", err, msg.patches);
          setIsApplyingRemoteChanges(false);
        }
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "leave_room",
          Roomid: Roomid
        }));
      }
      ws.close();
    };
  }, [Roomid, Roomname, navigate, editor, currentUserId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "leave_room", Roomid }));
        socket.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, Roomid]);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Header/>
      <Tldraw hideUi onMount={handleEditorMount}>
        {editor && socket && (
          <CustomToolBar
            editor={editor}
            socket={socket}
            Roomid={Roomid!}
            isApplyingRemoteChanges={isApplyingRemoteChanges}
          />
        )}
      </Tldraw>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {currentUserId && (
          <VideoChat
            roomId={Roomid}
            currentUserId={currentUserId}
            members={Members}
          />
        )}
      </div>
      
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          zIndex: 10000,
          display: "flex",
          gap: "10px",
        }}
      >
        <MembersDropdown members={Members} />
        <ShareDropdown Roomid={Roomid!} />
      </div>
    </div>
  );
}