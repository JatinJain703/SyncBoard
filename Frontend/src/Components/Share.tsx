import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

export function ShareDropdown({ Roomid }: { Roomid: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const roomLink = `${window.location.origin}/Canvas/${Roomid}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my canvas room",
          url: roomLink,
        });
      } else {
        await copyLink();
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="relative">
     
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 bg-white shadow-sm hover:bg-gray-50 transition"
      >
        <Share2 size={18} />
        Share
      </button>

     
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
          <p className="text-sm font-semibold mb-1">Room Link</p>
          <div className="flex items-center justify-between bg-gray-100 rounded px-2 py-1 text-xs break-all">
            <span className="truncate">{roomLink}</span>
            <button
              onClick={copyLink}
              className="ml-2 text-gray-600 hover:text-black"
              title="Copy link"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <button
            onClick={shareLink}
            className="mt-2 w-full flex items-center justify-center gap-2 text-sm border border-gray-300 rounded-md py-1 hover:bg-gray-50 transition"
          >
            <Share2 size={16} />
            Share via Device
          </button>
        </div>
      )}
    </div>
  );
}
