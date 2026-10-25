import TableCard from "../components/cards/TableCard.jsx";
import {useGetTablesQuery} from "../store/apis/tablesApi.js";
import StatusCard from "../components/cards/StatusCard.jsx";
import {useSelector, useDispatch} from "react-redux";
import Spinner from "../components/other/Spinner.jsx";
import PreBill from "../components/other/PreBill.jsx";
import TableModal from "../components/modals/TableModal.jsx";
import {setTableModal} from "../store/slices/modalSlice.js";
import {useState} from "react";
import { IoMdAdd } from "react-icons/io";
import '../pages-style/Tables.css';

const Tables = () => {
    const dispatch = useDispatch()
    const workspaceId = useSelector((state) => state.modals.currentWorkspace)
    const user = useSelector(state => state.user.user)

    const {data: tables, isLoading} = useGetTablesQuery(undefined, {skip: !workspaceId, refetchOnMountOrArgChange: true})

    const [orderData, setOrderData] = useState(null)
    const tableModal = useSelector(state => state.modals.tableModal)
    const preBill = useSelector(state => state.order.preBillOrderId)
    
    if (isLoading) return (
        <div>
            <h1>Loading tables...</h1>
            <Spinner/>
        </div>
    );

    return (
        <div className="home">
            <div className="main-page">
                <div className="text">
                    <h1>Tables</h1>
                    <h2>Live floor view</h2>
                </div>
                {user.role === "admin" ? <button onClick={() => dispatch(setTableModal())}><IoMdAdd /> Add table</button> : ""}
                <div className="table-stats">
                    <StatusCard tables={tables} filter="all"/>
                    <StatusCard tables={tables} filter="available"/>
                    <StatusCard tables={tables} filter="occupied"/>
                </div>
                <div className="tables-grid">
                    {tables?.map(table => (
                        <TableCard key={table._id} table={table} setOrder={setOrderData}/>
                    ))}
                </div>
            </div>
            {preBill && <PreBill orderData={orderData}/>}
            {tableModal && <TableModal/>}
        </div>
    )
}

export default Tables;