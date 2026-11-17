import TableCard from "../../components/cards/TableCard.jsx";
import {useGetTablesQuery} from "../../store/apis/tablesApi.js";
import StatusCard from "../../components/cards/StatusCard.jsx";
import {useSelector, useDispatch} from "react-redux";
import Spinner from "../../components/other/Spinner.jsx";
import TableModal from "../../components/modals/TableModal.jsx";
import {setTableModal} from "../../store/slices/modalSlice.js";
import { IoMdAdd } from "react-icons/io";
import '../../pages-style/Tables.css';

const Tables = () => {
    const dispatch = useDispatch()
    
    const workspaceId = useSelector((state) => state.workspace.currentWorkspace.workspaceId)
    const user = useSelector(state => state.user.user)
    const tableModal = useSelector(state => state.modals.tableModal)

    const {data: tables, isLoading} = useGetTablesQuery(undefined, {skip: !workspaceId, refetchOnMountOrArgChange: true})
    
    if (isLoading) return (
        <div className="loading">
            <h2>Loading tables...</h2>
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
                        <TableCard key={table._id} table={table}/>
                    ))}
                </div>
            </div>
            {tableModal && <TableModal/>}
        </div>
    )
}

export default Tables;