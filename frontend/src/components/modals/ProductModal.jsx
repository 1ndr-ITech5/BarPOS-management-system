import {useCreateProductMutation} from "../../store/apis/productsApi.js";
import {useState} from "react";
import {toast} from "react-toastify";

const ProductModal = ({categories, goBack}) => {
    const [createProduct, {isLoading}] = useCreateProductMutation();

    const [productData, setProductData] = useState({
        productName: "",
        category: "",
        price: 0
    })

    const handleSetData = (e) => {
        const {name, value} = e.target

        setProductData(prevData => ({
            ...prevData,
            [name] : name === "price" ? Number(value) : value
        }))
    }

    const handleSubmit = async() => {
        try{
            const response = await createProduct(productData).unwrap()
            toast.success(response.response)
            goBack(false)
        }catch(error){
            toast.error(error.data.message)
        }
    }

    return (
        <div>
            <h1>New Product</h1>
            <h2>Add a new product to the menu!</h2>
            <div>
                <label>Name</label>
                <input type="text" name="productName" value={productData.productName} 
                    onChange={(e) => handleSetData(e)} placeholder="Type product's name..."/>

                <label>Category</label>
                <select name="category" value={productData.category} onChange={handleSetData}>
                    <option value="">Select Category</option>
                    {categories.filter(category => category.isArchived === false).map(category => (
                    <option key={category._id} value={category.categoryName}>{category.categoryName}</option>))}
                </select>

                <label>Price</label>
                <input type="number" name="price" value={productData.price} 
                    onChange={(e) => handleSetData(e)}/>
            </div>
            <div>
                <button onClick={() => goBack(false)} disabled={isLoading}>Back</button>
                <button onClick={handleSubmit} disabled={isLoading}>Create</button>
            </div>
        </div>
    )
}

export default ProductModal;