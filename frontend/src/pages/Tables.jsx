import TableCard from "../components/cards/TableCard.jsx";
import {useGetTablesQuery} from "../store/apis/tablesApi.js";
import {useSelector} from "react-redux";
import Spinner from "../components/other/Spinner.jsx";
import '../pages-style/Tables.css';

const Tables = () => {
    const workspaceId = useSelector((state) => state.modals.currentWorkspace)

    const {data: tables, isLoading} = useGetTablesQuery(undefined, {skip: !workspaceId, refetchOnMountOrArgChange: true})
    
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
                <div className="tables-grid">
                    {tables?.map(table => (
                        <TableCard key={table._id} table={table}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Tables;