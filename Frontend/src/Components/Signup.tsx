import { signup as signupAtom } from "../Atoms/atom";
import { useSetRecoilState } from "recoil";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export function Signup() {
  const setsignup = useSetRecoilState(signupAtom);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();


  async function handlesubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    if (!password.trim()) {
      toast.error("Password cannot be empty");
      return;
    }


    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        name,
        email,
        password
      });


      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        toast.success("Signup successful!");
        navigate("/Dashboard");
      } else if (response.data.message) {
        toast.error(response.data.message);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Signup failed!");
      } else {
        toast.error("An unexpected error occurred!");
      }
    }
  }
    return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-3xl font-bold text-white mb-6">Create Account</h2>

      <form className="w-full space-y-4">
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setname(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setemail(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setpassword(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <label className="flex items-center text-sm text-neutral-400 mt-4">
          <input type="checkbox" onChange={(e) => setAgreed(e.target.checked)} className="mr-2 rounded" />I agree to
          terms and conditions
        </label>
        <button
          type="submit"
          onClick={(e) => handlesubmit(e)}
          disabled={!agreed}
          className="w-full bg-blue-500 text-white rounded-lg py-3 font-semibold hover:bg-blue-600 transition disabled:bg-neutral-700 disabled:text-neutral-500 mt-6"
        >
          Sign Up
        </button>
      </form>

      <div className="text-sm text-center text-neutral-400 mt-4">
        <span>Already have an account? </span>
        <button
          onClick={() => setsignup((signup) => !signup)}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Login
        </button>
      </div>
    </div>
  )
}
