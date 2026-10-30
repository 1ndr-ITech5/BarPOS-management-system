import { FaDeleteLeft } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import {useSelector} from "react-redux";
import {useState} from "react";

const UserLogin = () => {
    const workspaceType = useSelector(state => state.workspace.currentWorkspace.type)

    const [code, setCode] = useState("")
    const [showCode, setShowCode] = useState(false)

    // handle number insert in code
    const handleCode = (number) => {
        if (code.length > 6) return;
        setCode((prevCode) => prevCode + number)
    }

    const handleCodeVisibility = () => {
        if (showCode === true) {setShowCode(false)}
        else {setShowCode(true)}
    }

    return (
        <div>
            <button>Bar Name</button>
            {workspaceType === "demo" ? 
            <div>
                <button>Log As Admin</button>
                <button>Log as Waiter</button>
            </div> 
            : 
            <div>
                <div>
                    <label>Code</label>
                    <button onClick={() => handleCodeVisibility()}>{!showCode ? <FaRegEye/> : <FaRegEyeSlash/>}</button>
                    <input type="password"/>
                    <button type="button" onClick={() => setCode((prevCode) => prevCode.slice(0, -1))}>
                        <FaDeleteLeft />
                    </button>
                </div>
                <div className="keypad">
                    {Array.from({ length: 10 }, (_, index) => (
                        <button key={index} type="button" onClick={() => handleCode(index)}>
                            {index}
                        </button>
                    ))}
                </div>
            </div>}
            <div className="action-buttons">
                <button>{workspaceType === "demo" ? "" : "Log In"}</button>
                <button>Sign out</button>
            </div>
        </div>
    )
}

export default UserLogin;