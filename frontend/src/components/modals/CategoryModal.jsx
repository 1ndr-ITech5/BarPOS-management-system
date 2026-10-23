import { IoArrowBack } from "react-icons/io5";
import {useCreateCategoryMutation} from "../../store/apis/categoryApi.js";
import {useState} from "react";
import {toast} from "react-toastify";

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
            <label>Name</label>
            <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
            <button onClick={() => goBack(false)} disabled={newCategoryCreating}><IoArrowBack /> Back</button>
            <button onClick={(e) => handleCreateCategory(e)} disabled={newCategoryCreating}>Create</button>
        </div>
    )
}

export default CategoryModal;