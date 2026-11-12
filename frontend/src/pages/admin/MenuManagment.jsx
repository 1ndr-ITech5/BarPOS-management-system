import {useGetCategoriesQuery} from "../../store/apis/categoryApi.js";
import {useGetProductsQuery} from "../../store/apis/productsApi.js";
import Category from "../../components/subpages/Category.jsx";
import Product from "../../components/subpages/Product.jsx";
import Spinner from "../../components/other/Spinner.jsx";
import {useSelector, useDispatch} from "react-redux";
import {setSubpage} from "../../store/slices/pagesSlice.js";
import {useEffect} from "react";
import "../../pages-style/admin/MenuManagment.css";

const MenuManagment = () => {
    const dispatch = useDispatch();

    const {data: categories, isLoading: categoriesLoading} = useGetCategoriesQuery();
    const {data: products, isLoading: productsLoading} = useGetProductsQuery();
    
    const activeTab = useSelector(state => state.pages.menu_subpage)

    useEffect(() => {
        localStorage.setItem("menu-tab", activeTab)
    }, [activeTab])

    useEffect(() => {
        return () => {
            localStorage.removeItem("menu-tab")
        }
    }, []) 

    if(categoriesLoading || productsLoading){
        return (
            <div>
                <h2>Fetching the products!</h2>
                <Spinner/>
            </div>
        )
    }

    return (
        <div className="menu-managment">
            <h1>Menu</h1>
            <h3>Manage your menu items!</h3>
            <div className="menu-tabs">
                <button className={activeTab === "products" ? "active" : ""}
                    onClick={() => dispatch(setSubpage("products"))}>Products</button>
                <button className={activeTab === "categories" ? "active" : ""}
                    onClick={() => dispatch(setSubpage("categories"))}>Categories</button>
            </div>
            {activeTab === "products" ? 
                <Product allCategories={categories} allProducts={products}/> : 
                <Category allCategories={categories} allProducts={products}/>}
        </div>
    )
}

export default MenuManagment;