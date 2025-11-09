import React, { useState } from "react";
import { Users } from "lucide-react";

interface Member {
  userid: string;
  username: string;
}

export const MembersDropdown: React.FC<{ members: Member[] }> = ({ members }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg flex items-center justify-center shadow-md"
        title="Show Members"
      >
        <Users size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700">
          <ul className="max-h-60 overflow-y-auto">
            {members.length > 0 ? (
              members.map((m) => (
                <li
                  key={m.userid}
                  className="px-4 py-2 hover:bg-gray-700 transition-colors"
                >
                  {m.username}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400 text-sm">No members yet</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
