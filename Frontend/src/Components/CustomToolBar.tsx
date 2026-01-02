import { track, GeoShapeGeoStyle, type Editor } from "@tldraw/tldraw"
import { useEffect, useRef } from "react"
import {
  MousePointer,
  PenSquare,
  Eraser,
  Square,
  Circle,
  LineChart,
  ArrowUpRight,
  Hand,
  Type,
  StickyNote,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ToolbarItem {
  id: string
  label: string
  icon: LucideIcon
  shape?: string
}

interface CustomToolBarProps {
  editor: Editor
  socket: WebSocket | null
  Roomid: string
  isApplyingRemoteChanges: boolean
}


export const CustomToolBar = track(({ editor, socket, Roomid, isApplyingRemoteChanges }: CustomToolBarProps) => {
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const snapshotTimeoutRef = useRef<number | null>(null);
  const hasChangesRef = useRef(false)


  useEffect(() => {
    if (!editor || !socket) return

    let pendingPatches: any[] = []
    let timeoutId: number | null = null

    const sendBatchedPatches = () => {
      if (pendingPatches.length > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "patch",
            Roomid,
            patches: pendingPatches,
          }),
        )
        pendingPatches = []
      }
      timeoutId = null
    }


    const unsubscribe = editor.store.listen((entry) => {

      if (isApplyingRemoteChanges) return;
      
       hasChangesRef.current = true

      const hasTextChanges = Object.values(entry.changes.updated).some(([_from, to]: any) => {
        return to.typeName === 'shape' && (to.type === 'text' || to.type === 'note');
      });


      for (const record of Object.values(entry.changes.added)) {
        pendingPatches.push({
          type: "added",
          record: record,
        })
      }


      for (const [_from, to] of Object.values(entry.changes.updated)) {
        pendingPatches.push({
          type: "updated",
          record: to,
        })
      }


      for (const record of Object.values(entry.changes.removed)) {
        pendingPatches.push({
          type: "removed",
          id: record.id,
        })
      }


      if (timeoutId) {
        clearTimeout(timeoutId)
      }


      if (hasTextChanges) {
        isTypingRef.current = true;


        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          isTypingRef.current = false;
        }, 500);


        timeoutId = setTimeout(sendBatchedPatches, 150);
      } else {

        timeoutId = setTimeout(sendBatchedPatches, 16);
      }

      if (snapshotTimeoutRef.current) {
        clearTimeout(snapshotTimeoutRef.current)
      }

      snapshotTimeoutRef.current = window.setTimeout(() => {
        if (!hasChangesRef.current) return
        if (socket.readyState !== WebSocket.OPEN) return

        const snapshot = JSON.parse(JSON.stringify(editor.getSnapshot()))

        socket.send(
          JSON.stringify({
            type: "snapshot",
            Roomid,
            snapshot,
          })
        )

        hasChangesRef.current = false
        console.log("📸 Snapshot sent (debounced)")
      }, 1500)
     })


      return () => {
        unsubscribe()
        if (timeoutId) {
          clearTimeout(timeoutId)
          sendBatchedPatches()
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        if (snapshotTimeoutRef.current) {
          clearTimeout(snapshotTimeoutRef.current)

           if (socket.readyState === WebSocket.OPEN) {
            const snapshot = JSON.parse(
              JSON.stringify(editor.getSnapshot())
            )

            socket.send(
              JSON.stringify({
                type: "snapshot",
                Roomid,
                snapshot,
              })
            )
          }
        }
      }
    }, [editor, socket, Roomid, isApplyingRemoteChanges])

    const toolbarItems: ToolbarItem[] = [
      { id: "select", label: "Select", icon: MousePointer },
      { id: "draw", label: "Draw", icon: PenSquare },
      { id: "eraser", label: "Eraser", icon: Eraser },
      { id: "geo", label: "Rectangle", icon: Square, shape: "rectangle" },
      { id: "geo", label: "Oval", icon: Circle, shape: "oval" },
      { id: "line", label: "Line", icon: LineChart },
      { id: "arrow", label: "Arrow", icon: ArrowUpRight },
      { id: "hand", label: "Hand", icon: Hand },
      { id: "text", label: "Text", icon: Type },
      { id: "note", label: "Sticky Note", icon: StickyNote },
    ]

    const activeToolId = editor?.getCurrentToolId?.()
    const currentGeoStyle = editor?.getStyleForNextShape?.(GeoShapeGeoStyle)

    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "16px",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          background: "linear-gradient(135deg, rgba(24, 24, 27, 0.95) 0%, rgba(39, 39, 42, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          padding: "12px",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
          zIndex: 50,
        }}
      >
        {toolbarItems.map((item, idx) => {
          const key = `${item.id}-${item.shape ?? idx}`
          const isGeoActive = item.id === "geo" && item.shape === currentGeoStyle
          const isActive = activeToolId === item.id && (item.id !== "geo" || isGeoActive)

          const handleClick = () => {
            if (!editor) return
            if (item.id === "geo" && item.shape) {
              editor.run(() => {
                editor.setStyleForNextShapes(GeoShapeGeoStyle, item.shape!)
                editor.setCurrentTool("geo")
              })
            } else {
              editor.setCurrentTool(item.id)
            }
          }

          return (
            <button
              key={key}
              onClick={handleClick}
              title={item.label}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isActive
                  ? "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8))"
                  : "rgba(255, 255, 255, 0.05)",
                color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                border: isActive ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"
                }
              }}
            >
              <item.icon size={20} strokeWidth={1.5} />
            </button>
          )
        })}
      </div>
    )
  })