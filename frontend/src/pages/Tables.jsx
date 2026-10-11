import TableCard from "../components/cards/TableCard.jsx";
import {useGetTablesQuery} from "../store/apis/tablesApi.js";
import StatusCard from "../components/cards/StatusCard.jsx";
import {useSelector} from "react-redux";
import Spinner from "../components/other/Spinner.jsx";
import PreBill from "../components/other/PreBill.jsx";
import {useState} from "react";
import '../pages-style/Tables.css';

const Tables = () => {
    const workspaceId = useSelector((state) => state.modals.currentWorkspace)

    const {data: tables, isLoading} = useGetTablesQuery(undefined, {skip: !workspaceId, refetchOnMountOrArgChange: true})

    const [orderData, setOrderData] = useState(null)
    const viewOrder = useSelector(state => state.order.viewOrder)
    
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
            {viewOrder && <PreBill orderData={orderData}/>}
        </div>
    )
}

export default Tables;