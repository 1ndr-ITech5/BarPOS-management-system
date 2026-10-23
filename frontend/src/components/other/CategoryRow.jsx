import {useState} from "react";
import {toast} from "react-toastify";
import {FaPencilAlt} from "react-icons/fa";
import {RiDeleteBin6Line} from "react-icons/ri";
import {CiCircleRemove} from "react-icons/ci";
import {useEditCategoryMutation} from "../../store/apis/categoryApi.js";

const CategoryRow = ({category, index, productCount}) => {

    const [editCategory, {isLoading}] = useEditCategoryMutation();
    const [isEditing, setIsEditing] = useState(false)
    const [categoryName, setCategoryName] = useState(category.categoryName)


    const handleSubmit = async() => {
        try{
            const response = await editCategory({
                categoryId: category._id,
                categoryData: {categoryName}}).unwrap()
            toast.success(response.response)
            setIsEditing(false)
        }catch(error){
            toast.error(error?.data?.message || "Could not edit the category!")
        }
    }

    return (
        <tr>
            <td>{index + 1}</td>
            <td>
                {isEditing ? (
                    <div className="edit-name">
                        <button onClick={() => setIsEditing(false)}><CiCircleRemove /></button>
                        <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
                        <button onClick={handleSubmit} disabled={isLoading}>Submit</button>
                    </div>
                ) : category.categoryName}
            </td>
            <td>{productCount}</td>
            <td>
                <label className="toggle-switch">
                    <input type="checkbox" checked={category.isActive} disabled={category.isArchived} readOnly/>
                    <span className="toggle-slider"></span>
                </label>
            </td>
            <td>
                <button onClick={() => setIsEditing(true)} disabled={category.isArchived || isLoading}><FaPencilAlt /></button>
                <button disabled={category.isArchived || isLoading}><RiDeleteBin6Line /></button>
            </td>
        </tr>
    )
}

export default CategoryRow;