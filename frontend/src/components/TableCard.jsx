import '../comp-style/TableCard.css';

const TableCard = ({table, addModal}) => {
    return(
        <div className="table-card" style={{backgroundColor: table.status === "available" ? "green" : "red"}} onClick={addModal}>
            {table.tableNumber}
        </div>
    )
}

export default TableCard;