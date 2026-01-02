import { useState, useEffect } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { CreateRoom } from "./CreateRoom"
import { useNavigate } from "react-router-dom"
import { Plus, LogOut } from "lucide-react"
import { TailSpin } from "react-loader-spinner";

export function Dashboard() {
  const [rooms, setRooms] = useState<{ Roomid: string; Roomname: string }[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()
  const [loading, setloading] = useState(true);
  
  async function fetchData() {
    try {
      const response = await axios.get("https://syncboard-66a9.onrender.com/GetRooms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setRooms(response.data.Rooms || [])
    } catch (err) {
      toast.error("Failed to fetch rooms")
    }
  }

  async function create(name: string) {
    try {
      const response = await axios.post(
        "https://syncboard-66a9.onrender.com/CreateRoom",
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      if (response.data.error) {
        toast.error(response.data.error)
      } else {
        toast.success("Room created successfully!")
        await fetchData()
      }
    } catch (err) {
      toast.error("Error creating room")
    }
  }

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/")
    toast.success("Logged out successfully")
  }

  useEffect(() => {
    async function fetchRooms() {
      await fetchData();
      setloading(false);
    }
    fetchRooms();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">SyncBoard</h1>
          </div>

          
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
       
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">
              Workspace
            </h2>
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Create Room</span>
            </button>
          </div>
        </aside>

       
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Rooms</h2>

           
           {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <TailSpin
                  visible={true}
                  height="80"
                  width="80"
                  color="#2563eb"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
                <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium italic">Loading your workspace...</p>
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <button
                    key={room.Roomid}
                    onClick={() => navigate(`/Canvas/${room.Roomid}`)}
                    className="group relative p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-colors duration-300" />

                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {room.Roomname}
                      </h3>
                      <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Enter Room →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No rooms yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </main>
      </div>

    
      {showCreate && <CreateRoom onClose={() => setShowCreate(false)} onSubmit={create} />}

     
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}
