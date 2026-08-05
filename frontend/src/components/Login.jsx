import {useState} from 'react';

const Login = ({changeModal}) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <section className="login">
            <h2>Welcome Back!</h2>
            <div className="log-fields">
                <label>Username</label>
                <input type="text" value={username} placeholder="Type your username..." onChange={(e) => setUsername(e.target.value)}/>
                <label>Password</label>
                <input type="password" value={password} placeholder="Type password..." onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button>Log In</button>
            <button onClick={() => changeModal(false)}>Back</button>
        </section>
    )
}

export default Login;