import '../comp-style/TableCard.css';

const TableCard = ({table, onClick}) => {
    return(
        <div className="table-card" style={{backgroundColor: table.status === "available" ? "green" : "red"}} onClick={onClick}>
            {table.tableNumber}
        </div>
    )
}

export default TableCard;