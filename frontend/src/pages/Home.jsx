import Header from "../layout/Header.jsx";
import Navbar from "../layout/Navbar.jsx";
import Footer from "../layout/Footer.jsx";
import TableCard from "../components/TableCard.jsx";
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

    return (
        <div>
            <Header/>
            <Navbar/>
            <div className="main-page">
                <h1>Bar Restaurant Natyra</h1>
                <div className="tables-grid">
                    {tables.map(table => (
                        <TableCard key={table.tableNo} table={table}/>
                    ))}
                </div>
                <button>Login</button>
            </div>
            <Footer/>
        </div>
    )
}

export default Home;