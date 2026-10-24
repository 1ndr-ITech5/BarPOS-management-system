import {useState} from "react";
import {toast} from "react-toastify";
import {FaPencilAlt} from "react-icons/fa";
import {RiDeleteBin6Line} from "react-icons/ri";
import {CiCircleRemove} from "react-icons/ci";
import {useEditCategoryMutation, useToggleActivityMutation, 
    useDeleteCategoryMutation, useRestoreCategoryMutation} from "../../store/apis/categoryApi.js";

const CategoryRow = ({category, index, productCount}) => {

    const [editCategory, {isLoading}] = useEditCategoryMutation();
    const [toggleActivity] = useToggleActivityMutation();
    const [deleteCategory, {isLoading: deletingCategory}] = useDeleteCategoryMutation();
    const [restoreCategory, {isLoading: restoringCategory}] = useRestoreCategoryMutation();

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

    const handleSwitchActivity = async() => {
        try{
            await toggleActivity(category._id).unwrap()
        }catch(error){
            console.log(error.data.message)
        }
    }

    const handleDeleteCategory = async() => {
        try{
            const response = await deleteCategory(category._id).unwrap()
            toast.success(response.response)
        }catch(error){
            toast.error(error.data.message)
        }
    }

    const handleRestoreCategory = async() => {
        try{
            const response = await restoreCategory(category._id).unwrap()
            toast.success(response.response)
        }catch(error){
            toast.error(error.data.message)
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
                <label className="toggle-switch" onClick={handleSwitchActivity}>
                    <input type="checkbox" checked={category.isActive} disabled={category.isArchived} readOnly/>
                    <span className="toggle-slider"></span>
                </label>
            </td>
            <td>
                {category.isArchived === true ? 
                <button onClick={handleRestoreCategory} disabled={restoringCategory}>Restore</button> : 
                <div>
                    <button onClick={() => setIsEditing(true)} disabled={isLoading || deletingCategory}>
                        <FaPencilAlt /></button>
                    <button onClick={handleDeleteCategory} disabled={isLoading || deletingCategory}>
                        <RiDeleteBin6Line /></button>
                </div>}
            </td>
        </tr>
    )
}

export default CategoryRow;