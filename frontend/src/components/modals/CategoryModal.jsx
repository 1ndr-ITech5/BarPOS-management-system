import { IoArrowBack } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import {useCreateCategoryMutation} from "../../store/apis/categoryApi.js";
import {useState} from "react";
import {toast} from "react-toastify";
import "../../comp-style/modals-style/CategoryModal.css";

const CategoryModal = ({goBack}) => {

    const [createCategory, {isLoading: newCategoryCreating}] = useCreateCategoryMutation();

    const [categoryName, setCategoryName] = useState("")

    const handleCreateCategory = async(e) => {
        e.preventDefault();

        try{
            const response = await createCategory({categoryName}).unwrap()
            toast.success(response.response)
            goBack(false)
        }catch(error){
            toast.error(error.data.message)
        }
    }

    return (
        <div className="category-modal">
            <h2>New Category</h2>
            <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
            <div className="modal-buttons">
                <button onClick={(e) => handleCreateCategory(e)} disabled={newCategoryCreating}><IoMdAdd /> Add</button>
                <button onClick={() => goBack(false)} disabled={newCategoryCreating}><IoArrowBack /> Back</button>
            </div>
        </div>
    )
}

export default CategoryModal;