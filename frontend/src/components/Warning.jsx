import {setLoginModal, setWarningModal} from "../store/slices/modalSlice.js";
import {useDispatch} from "react-redux";

const Warning = () => {

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(setLoginModal(true))
        dispatch(setWarningModal(false))
    }

    return(
        <div>
            <h1 style={{color: "red"}}>Warning!</h1>
            <h2>Please log In to continue!</h2>
            <div>
                <button onClick={() => handleClick()}>Login</button>
                <button onClick={() => dispatch(setWarningModal(false))}>Back</button>
            </div>
        </div>
    )
}

export default Warning;