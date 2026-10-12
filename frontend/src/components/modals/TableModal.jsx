import {useCreateTableMutation} from "../../store/apis/tablesApi.js";
import { CiCircleRemove } from "react-icons/ci";
import {useDispatch} from "react-redux";
import {setTableModal} from "../../store/slices/modalSlice.js";
import {useState} from "react";
import {toast} from "react-toastify";

const TableModal = () => {
    const dispatch = useDispatch()

    const [createTable, {isLoading}] = useCreateTableMutation()

    const [tableData, setTableData] = useState({
        name: "",
        capacity: 1
    })

    const handleChangeFields = (e) => {
        const {name, value} = e.target

        setTableData((prevTableData) => ({
            ...prevTableData,
            [name]: name === "capacity" ? Number(value) : value
        }))
    }

    const handleCreateTable = async(e) => {
        e.preventDefault()

        try{
            const response = await createTable(tableData)
            toast.success(response.data.response)
            dispatch(setTableModal())
        }catch(error){
            toast.error(error.data.message)
        }
    }

    return (
        <div className="table-modal">
            <CiCircleRemove onClick={() => dispatch(setTableModal())}/>
            <h1>Create new table</h1>
            <h2>Add more tables for your workspace</h2>
            <div className="modal-lables">
                <label>Table Name</label>
                <input type="text" name="name" value={tableData.name} 
                onChange={(e) => handleChangeFields(e)} placeholder="Enter the table's name"/>
                <label>Capacity</label>
                <input type="number" name="capacity" min={1} max={20} step={1} value={tableData.capacity}
                onChange={(e) => handleChangeFields(e)}/>
            </div>
            <button onClick={(e) => handleCreateTable(e)} disabled={isLoading}>Create Table</button>
        </div>
    )
}

export default TableModal;