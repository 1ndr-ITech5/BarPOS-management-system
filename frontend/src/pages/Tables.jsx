import TableCard from "../components/cards/TableCard.jsx";
import UserPanel from "../components/user/UserPanel.jsx";
import {useGetTablesQuery} from "../store/apis/tablesApi.js";
import TableModal from "../components/modals/TableModal.jsx";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../components/other/Spinner.jsx";
import {setTableModal, setSelectedTable} from "../store/slices/modalSlice.js";
import '../pages-style/Tables.css';

const Tables = () => {

    const {data: tables, isLoading} = useGetTablesQuery(undefined, {refetchOnMountOrArgChange: true})
    const dispatch = useDispatch();

    const {tableModal, selectedTable} = useSelector((state) => state.modals)
    
    if (isLoading) return (
        <div>
            <h1>Loading tables...</h1>
            <Spinner/>
        </div>
    );

    const handleClick = (table) => {
        dispatch(setTableModal(true))
        dispatch(setSelectedTable(table._id))
    }

    return (
        <div className="home">
            <h1>Bar Restaurant Natyra</h1>
            <div className="main-page">
                <div className="tables-grid">
                    {tables?.map(table => (
                        <TableCard key={table._id} table={table} onClick={() => handleClick(table)}/>
                    ))}
                </div>
                <UserPanel/>
            </div>
            {/* Manage the modal state */}
            {tableModal && <TableModal selectedTableId={selectedTable} allTables={tables}/>}
        </div>
    )
}

export default Tables;