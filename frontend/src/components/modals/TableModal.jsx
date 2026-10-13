import {useCreateTableMutation, useUpdateTableMutation} from "../../store/apis/tablesApi.js";
import { CiCircleRemove } from "react-icons/ci";
import {useDispatch, useSelector} from "react-redux";
import {setTableModal, removeTableforUpdate} from "../../store/slices/modalSlice.js";
import {useState} from "react";
import {toast} from "react-toastify";

const TableModal = () => {
    const dispatch = useDispatch()

    const [createTable, {isLoading: createProcess}] = useCreateTableMutation()
    const [updateTable, {isLoading: updateProcess}] = useUpdateTableMutation()
    const tableId = useSelector(state => state.modals.updatingTableId)

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
            const response = await createTable(tableData).unwrap()
            toast.success(response.response)
            dispatch(setTableModal())
        }catch(error){
            toast.error(error.data.message)
        }
    }

    const handleUpdateTable = async(e) => {
        e.preventDefault()

        try{
            const response = await updateTable({tableId, tableData}).unwrap()
            toast.success(response.response)
            dispatch(setTableModal())
        }catch(error){
            toast.error(error.data.message)
        }
    }

    return (
        <div className="table-modal">
            <CiCircleRemove
                onClick={() => {
                    if (tableId) dispatch(removeTableforUpdate());
                    dispatch(setTableModal());}}/>
            <h1>{tableId ? "Update Table" : "Create new table"}</h1>
            <h2>{tableId ? "Modify this table's data" : "Add more tables for your workspace"}</h2>
            <div className="modal-lables">
                <label>Table Name</label>
                <input type="text" name="name" value={tableData.name} onChange={handleChangeFields}
                placeholder="Enter the table's name"/>
                <label>Capacity</label>
                <input type="number" name="capacity" min={1} max={20} step={1} value={tableData.capacity}
                onChange={handleChangeFields}/>
            </div>
            <button
                onClick={tableId ? handleUpdateTable : handleCreateTable}
                disabled={tableId ? updateProcess : createProcess}>
            {tableId ? "Update Table" : "Create Table"}
            </button>
        </div>
    )
}

export default TableModal;