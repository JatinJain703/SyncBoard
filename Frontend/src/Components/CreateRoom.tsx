import { useState } from "react"

interface CreateRoomProps {
  onClose: () => void
  onSubmit: (name: string) => void
}

export function CreateRoom({ onClose, onSubmit }: CreateRoomProps) {
  const [name, setName] = useState("")

  const handleClick = () => {
    if (!name.trim()) return
    onSubmit(name)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-96 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Create Room</h2>

        <input
          type="text"
          placeholder="Enter room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-4 py-3 mb-6 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleClick}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
