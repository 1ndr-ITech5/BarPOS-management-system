import {useState} from "react";
import {useRegisterMutation} from '../../store/apis/authApi.js';
import { toast } from "react-toastify";

const Register = ({changeModal}) => {

    const [register, {isloading}] = useRegisterMutation();

    const [registerData, setRegisterData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
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
    const handleSubmit = async(e) => {
        e.preventDefault();

        const response = await register(registerData)
        if (response.error){
            toast.error(response.error?.data?.message || "Register Failed!")
        }else{
            toast.success(response.data.response)
            changeModal(false)
        }
    }

    return (
        <section className="register">
            <h2>Register New User</h2>
            <div className="register-fields">
                <label>First Name</label>
                <input type="text" name="first_name" value={registerData.first_name} onChange={handleChange} required/>
                <label>Last Name</label>
                <input type="text" name="last_name" value={registerData.last_name} onChange={handleChange} required/>
                <label>Username</label>
                <input type="text" name="username" value={registerData.username} onChange={handleChange} required/>
                <label>Password</label>
                <input type="password" name="password" value={registerData.password} onChange={handleChange} required/>
                <label>Role</label>
                <select name="role" value={registerData.role} onChange={handleChange}>
                    <option value="waiter">Waiter</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="register-buttons">
                <button onClick={(e) => handleSubmit(e)} disabled={isloading}>Register</button>
                <button onClick={() => changeModal(false)} disabled={isloading}>Back</button>
            </div>
        </section>
    )
}

export default Register;