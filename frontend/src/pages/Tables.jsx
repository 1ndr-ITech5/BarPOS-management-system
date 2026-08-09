import TableCard from "../components/TableCard.jsx";
import UserPanel from "../components/UserPanel.jsx";
import {useGetTablesQuery} from "../store/apis/tablesApi.js";
import TableModal from "../components/TableModal.jsx";
import {useDispatch, useSelector} from "react-redux";
import Warning from "../components/Warning.jsx";
import {setTableModal, setSelectedTable} from "../store/slices/modalSlice.js";
import './Tables.css';

const Tables = () => {
    // destruct the api hook
    const {data: tables, isLoading} = useGetTablesQuery();

    const dispatch = useDispatch();

    const {tableModal, selectedTable, warningModal, loginModal} = useSelector((state) => state.modals)
    
    if (isLoading) return (<p>Loading tables...</p>);

    const handleClick = (table) => {
        if (warningModal || loginModal){
            return;
        }else{
            dispatch(setTableModal(true))
            dispatch(setSelectedTable(table))
        }
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
            {tableModal && <TableModal table={selectedTable}/>}
            {warningModal && <Warning/>}
        </div>
    )
}

export default Tables;