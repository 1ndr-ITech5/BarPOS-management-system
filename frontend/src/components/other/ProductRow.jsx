import {FaPencilAlt} from "react-icons/fa";
import {RiDeleteBin6Line} from "react-icons/ri";
import {useEditProductMutation, useRestoreProductMutation,
    useToggleProductMutation, useDeleteProductMutation} from "../../store/apis/productsApi.js";
import {useState} from "react";
import {CiCircleRemove} from "react-icons/ci";
import {toast} from "react-toastify";

const ProductRow = ({product, index, categories}) => {
    const [editProduct, {isLoading}] = useEditProductMutation();
    const [restoreProduct, {isLoading: restoringProduct}] = useRestoreProductMutation();
    const [deleteProduct, {isLoading: deletingProduct}] = useDeleteProductMutation();
    const [toggleProduct] = useToggleProductMutation();

    const [isEdit, setIsEdit] = useState(false)
    const [editedData, setEditedData] = useState({
        productName: product.productName,
        category: product.categoryId?.categoryName ?? "",
        price: product.price
    })

    const handleEditing = (e) => {
        const {name, value} = e.target

        setEditedData((prevData) => ({
            ...prevData,
            [name]: name === "price" ? Number(value) : value
        }))
    }

    const handleSubmitEdit = async(productId) => {
        try{
            const response = await editProduct({productData: editedData, productId}).unwrap()
            toast.success(response.response)
            setIsEdit(false)
        }catch(error){
            toast.error(error?.data?.message)
        }
    }

    const handleToggle = async() => {
        if(!product.categoryId?.isActive || product.categoryId?.isArchived || product.isArchived) return;

        try{
            await toggleProduct(product._id)
        }catch{}
    }

    const handleDelete = async(productId) => {
        try{
            const response = await deleteProduct(productId).unwrap()
            toast.success(response.response)
        }catch(error){
            toast.error(error?.data?.message)
        }
    }

    const handleRestore = async(productId) => {
        try{
            const response = await restoreProduct(productId).unwrap()
            toast.success(response.response)
        }catch(error){
            toast.error(error?.data?.message)
        }
    }

    return (
        <tr>
            <td>{isEdit ? <button onClick={() => setIsEdit(false)}><CiCircleRemove /></button> : index + 1}</td>
            <td>
                {isEdit
                    ? <input type="text" name="productName" value={editedData.productName} onChange={(e) => handleEditing(e)}/>
                    : product.productName}
            </td>
            <td>
                {isEdit
                    ? <select name="category" value={editedData.category} onChange={(e) => handleEditing(e)}>
                    {categories.map(category => 
                        category.isActive && !category.isArchived ? 
                        <option key={category._id}>{category.categoryName}</option> : null
                    )}
                    </select> : product.categoryId?.categoryName ?? "-"}
            </td>
            <td>
                {isEdit
                    ? <input type="number" name="price" value={editedData.price} onChange={(e) => handleEditing(e)}/>
                    : `${product.price} ALL`}
            </td>
            <td>
                <label className="toggle-switch" onClick={() => handleToggle()}>
                    <input type="checkbox" checked={product.isAvailable} 
                        disabled={product.isArchived || !product.categoryId?.isActive} readOnly/>
                    <span className="toggle-slider"></span>
                </label>
            </td>
            <td>
                {product.isArchived ? 
                    (<button onClick={() => handleRestore(product._id)} disabled={restoringProduct}>Restore</button>) 
                : isEdit ? 
                    (<button onClick={() => handleSubmitEdit(product._id)} disabled={isLoading}>Submit</button>) 
                : ( <div>
                        <button onClick={() => setIsEdit(true)}><FaPencilAlt /></button>
                        <button onClick={() => handleDelete(product._id)}><RiDeleteBin6Line /></button>
                    </div>
                )}
            </td>
        </tr>
    )
}

export default ProductRow;