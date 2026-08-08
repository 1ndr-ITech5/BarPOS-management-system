import TableCard from "../components/TableCard.jsx";
import TableModal from "../components/TableModal.jsx";
import UserPanel from "../components/UserPanel.jsx";
import {useState} from 'react';
import {useGetTablesQuery} from "../store/apis/tablesApi.js";
import './Tables.css';

const Tables = () => {

    const {data: tables, isloading} = useGetTablesQuery();
    
    if (isloading) return (<p>Loading tables...</p>);

    // set the state of choosen table and the modal appearence
    const [choosenTable, setTable] = useState(null)
    const [modalState, setModal] = useState(false)

    const handleTableClick = (table) => {
        setTable(table)
        setModal(true)
    }

    const handleRemoveModal = () => {
        setTable(null)
        setModal(false)
    }


    return (
        <div className="home">
            <h1>Bar Restaurant Natyra</h1>
            <div className="main-page">
                <div className="tables-grid">
                    {tables?.map(table => (
                        <TableCard key={table._id} table={table} addModal={() => handleTableClick(table)}/>
                    ))}
                </div>
                <UserPanel/>
            </div>

            {/* Manage the modal state */}
            {modalState && <TableModal table={choosenTable} removeModal={() => handleRemoveModal()}/>}
        </div>
    )
}

export default Tables;