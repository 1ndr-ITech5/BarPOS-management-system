import '../../comp-style/cards-style/TableCard.css';

const TableCard = ({table, onClick}) => {
    return(
        <div className="table-card" style={{backgroundColor: table.status === "available" ? "green" : "red"}} onClick={onClick}>
            <h3>Table: {table.tableNumber}</h3>
            <h4>Seats | {table.capacity}</h4>
            <button className="table-status">{table.status}</button>
            <div className="table-actions">
                <button>{table.status === "available" ? "Open Order" : "Update Order"}</button>
                {table.status === "occupied" ? <button>Checkout</button> : ""}
            </div>
        </div>
    )
}

export default TableCard;