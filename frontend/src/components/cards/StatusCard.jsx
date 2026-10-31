import { BiDish } from "react-icons/bi";
import { MdOutlineBookmarks } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import "../../comp-style/cards-style/StatusCard.css";

const StatusCard = ({tables, filter}) => {
    
    const numberOfTables = filter !== "all" ? tables.filter(table => table.status === filter).length : tables.length

    return (
        <div className="table-status-card">
            <div className="table-status-header">
                <h2>{filter === "occupied" ? "Occupied Tables" : filter === "available" ? "Available Tables" : "Total Tables"}</h2>
                {filter === "occupied" ? <MdOutlineBookmarks /> : filter === "available" ? <FaRegCircleCheck /> : <BiDish />}
            </div>
            <h1>{numberOfTables}</h1>
        </div>
    )
}

export default StatusCard;