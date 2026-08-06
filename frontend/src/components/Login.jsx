import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useLoginMutation} from '../store/apis/authApi.js';
import {loginSuccess} from '../store/slices/authSlice.js';

const Login = ({changeModal}) => {

    // call our api hook for authentication
    const [login, {isLoading}] = useLoginMutation()

    const dispatch = useDispatch()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    // what happens after button login gets clicked
    const handleSubmit = async(e) => {
        e.preventDefault();
        setError(null)

        const response = await login({username, password})
        if (response.error){
            setError(response.error?.data?.message || "Login Failed!")
        }else{
            // set the user info in localstorage
            localStorage.setItem("user", JSON.stringify(response.data))
            dispatch(loginSuccess(response.data))
            changeModal(false)
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
            <p style={{color: "red"}}>{error ? error : null}</p>
            <button onClick={(e) => handleSubmit(e)} disabled={isLoading}>{isLoading ? "Logging in..." : "Log In"}</button>
            <button onClick={() => changeModal(false)} disabled={isLoading}>Back</button>
        </section>
    )
}

export default Login;