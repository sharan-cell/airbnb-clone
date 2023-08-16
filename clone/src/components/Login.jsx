import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../useContext";


function Login() {
  const history = useNavigate();
 
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const {setUser} = useContext(UserContext);

  async function loginUser(ev) {
    ev.preventDefault();
    try {
       const UserInfo = await axios.post('/login', {email,password}, {withCredentials: true});
      setUser(UserInfo);
      alert("Login successful");
      document.cookie = `token=${UserInfo.data.token}; path=/`;
      history("/");
    } catch (e) {
      alert("Login failed");
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={loginUser}>
          <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Dont have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;