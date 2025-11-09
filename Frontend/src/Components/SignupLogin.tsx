import { signup as signupAtom} from "../Atoms/atom";
import { useRecoilValue } from "recoil";
import { Signup } from "./Signup";
import { Login } from "./Login";

export function SignupLogin()
{
    const signup=useRecoilValue(signupAtom);
     return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-8">
        {signup ? <Signup /> : <Login />}
      </div>
    </div>
  )
}
