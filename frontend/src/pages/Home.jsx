import TableCard from "../components/TableCard.jsx";
import TableModal from "../components/TableModal.jsx";
import Login from "../components/Login.jsx";
import {useState} from 'react';
import './Home.css';

const Home = () => {

    const tables = [
        {
            "tableNo": 1,
            "status": "available"
        },
        {
            "tableNo": 2,
            "status": "available"
        },
        {
            "tableNo": 3,
            "status": "occupied"
        },
        {
            "tableNo": 4,
            "status": "available"
        }
    ]

    // set the state of choosen table and the modal appearence
    const [choosenTable, setTable] = useState(null)
    const [modalState, setModal] = useState(false)

    // login modal
    const [loginModal, setLoginModal] = useState(false)

    const handleTableClick = (table) => {
        setTable(table)
        setModal(true)
    }

    const handleRemoveModal = () => {
        setTable(null)
        setModal(false)
    }


    return (
        <div>
            <div className="main-page">
                <h1>Bar Restaurant Natyra</h1>
                <div className="tables-grid">
                    {tables.map(table => (
                        <TableCard key={table.tableNo} table={table} addModal={() => handleTableClick(table)}/>
                    ))}
                </div>
                <button onClick={() => setLoginModal(true)}>Login</button>
            </div>

            {/* Manage the modal state */}
            {modalState && <TableModal table={choosenTable} removeModal={() => handleRemoveModal()}/>}

            {/* Manage the login modal */}
            {loginModal && <Login changeModal={setLoginModal}/>}
        </div>
    )
}

export default Home;