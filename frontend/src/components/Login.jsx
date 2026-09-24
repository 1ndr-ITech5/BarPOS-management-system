import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useLoginMutation} from '../store/apis/authApi.js';
import {loginSuccess} from '../store/slices/authSlice.js';
import {setLoginModal} from "../store/slices/modalSlice.js";
import { toast } from "react-toastify";

const Login = () => {

    // call our api hook for authentication
    const [login, {isLoading}] = useLoginMutation()

    const dispatch = useDispatch()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // what happens after button login gets clicked
    const handleSubmit = async(e) => {
        e.preventDefault();

        const response = await login({username, password})
        if (response.error){
            toast.error(response.error?.data?.message || "Login Failed!")
        }else{
            // set the user info in localstorage
            localStorage.setItem("user", JSON.stringify(response.data))
            dispatch(loginSuccess(response.data))
            toast.success(response.data.response);
            dispatch(setLoginModal(false))
        }
    }

    return (
        <section className="login">
            <h2>Welcome Back!</h2>
            <div className="log-fields">
                <label>Username</label>
                <input type="text" value={username} placeholder="Type your username..." onChange={(e) => setUsername(e.target.value)}/>
                <label>Password</label>
                <input type="password" value={password} placeholder="Type password..." onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button onClick={(e) => handleSubmit(e)} disabled={isLoading}>{isLoading ? "Logging in..." : "Log In"}</button>
            <button onClick={() => dispatch(setLoginModal(false))} disabled={isLoading}>Back</button>
        </section>
    )
}

export default Login;