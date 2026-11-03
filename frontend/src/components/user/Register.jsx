import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import {useRegisterMutation} from '../../store/apis/usersApi.js';
import {useState} from "react";
import { toast } from "react-toastify";
import "../../comp-style/user-style/Register.css";

const Register = ({changeModal}) => {

    const [register, {isLoading}] = useRegisterMutation();

    const [showCode, setShowCode] = useState(false)
    const [registerData, setRegisterData] = useState({
        first_name: "",
        last_name: "",
        code: "",
        role: "waiter"
    })

    // change the value of register fields live
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setRegisterData((prevData) => ({
            ...prevData, 
            [name]: value    
        }));
    };



    // function that inits the checks of fields in backend
    const handleSubmit = async() => {
        try{
            const response = await register(registerData).unwrap()
            console.log(response)
            toast.success(response.response)
            changeModal(false)
        }catch(error){
            toast.error(error?.data?.message || "Register Failed!")
        }
    }

    return (
        <div className="modal-backdrop">
            <section className="register" role="dialog" aria-modal="true">
                <h2>New User</h2>
                <div className="register-fields">
                    <label>First Name</label>
                    <input type="text" name="first_name" value={registerData.first_name} onChange={handleChange} required/>
                    <label>Last Name</label>
                    <input type="text" name="last_name" value={registerData.last_name} onChange={handleChange} required/>
                    <label>Code</label>
                    <input type={showCode ? "text" : "password"} name="code" value={registerData.code} onChange={handleChange} required/>
                    <button onClick={() => setShowCode(!showCode)}>{showCode ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                    <label>Role</label>
                    <select name="role" value={registerData.role} onChange={handleChange}>
                        <option value="waiter">Waiter</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="register-buttons">
                    <button onClick={() => handleSubmit()} disabled={isLoading}>Register</button>
                    <button onClick={() => changeModal(false)} disabled={isLoading}>Cancel</button>
                </div>
            </section>
        </div>
    )
}

export default Register;