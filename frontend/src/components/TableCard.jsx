import './TableCard.css';

const TableCard = ({table, addModal}) => {
    return(
        <div className="table-card" style={{backgroundColor: table.status === "available" ? "green" : "red"}} onClick={addModal}>
            {table.tableNo}
        </div>
    )
}

export default TableCard;