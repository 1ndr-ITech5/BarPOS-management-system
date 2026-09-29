import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {useLoginMutation, useLoginDemoMutation} from '../store/apis/authApi.js';
import {setCurrentWorkspace} from "../store/slices/modalSlice.js";
import {loginSuccess} from '../store/slices/authSlice.js';
import { toast } from "react-toastify";

const Login = () => {
    // call our api hook for authentication
    const [login, {isLoading}] = useLoginMutation()
    const [loginDemo, {isLoading: loading}] = useLoginDemoMutation()

    const nav = useNavigate()
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
            dispatch(setCurrentWorkspace(response.data.workspaceId))
            nav("/tables")
            toast.success(response.data.response);
        }
    }

    // the demo case
    const handleSubmitDemo = async(e) => {
        e.preventDefault();

        const response = await loginDemo()
        if (response.error){
            toast.error(response.error?.data?.message || "Login Failed!")
        }else{
            // set the user info in localstorage
            localStorage.setItem("user", JSON.stringify(response.data))
            dispatch(loginSuccess(response.data))
            dispatch(setCurrentWorkspace(response.data.workspaceId))
            nav("/tables")
            toast.success(response.data.response);
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
            <button onClick={(e) => handleSubmit(e)} disabled={isLoading || loading}>{isLoading ? "Logging in..." : "Log In"}</button>
            <button onClick={(e) => handleSubmitDemo(e)} disabled={loading || isLoading}>Try Demo</button>
        </section>
    )
}

export default Login;