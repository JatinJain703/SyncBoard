import { useNavigate } from "react-router-dom"
import { signup as signupAtom } from "../Atoms/atom"
import { useSetRecoilState } from "recoil"

export default function Main() {
  const setsignup = useSetRecoilState(signupAtom)
  const navigate = useNavigate()

  const handleSignup = () => {
    setsignup(true)
    navigate("/SignupLogin")
  }
  const handleLogin = () => {
    setsignup(false)
    navigate("/SignupLogin")
  }
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <div className="text-2xl font-bold">SyncBoard</div>
        <div className="flex gap-4">
          <button
            onClick={handleLogin}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={handleSignup}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8 py-20 gap-8">
        <div className="flex flex-col gap-3 items-center">
          <div className="inline-block px-4 py-2 bg-red-600 rounded-full text-sm font-medium">
            SyncBoard is now live
          </div>
        </div>

        <h1 className="text-6xl font-bold text-center max-w-3xl">Teamwork, meet deep work</h1>

        <p className="text-xl text-gray-400 text-center max-w-2xl">
          The new standard for visual teamwork — connect, draw, and brainstorm without limits.
        </p>

        <div className="mt-12 w-full max-w-4xl">
          <img
            src="/Canvas.jpeg"
            alt="SyncBoard canvas demo"
            className="w-full rounded-lg shadow-2xl border border-gray-800"
          />
        </div>
      </section>

      <footer className="bg-gray-950 border-t border-gray-800 px-8 py-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="grid grid-cols-4 gap-8 w-full">
            <div className="text-center">
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2025 SyncBoard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
