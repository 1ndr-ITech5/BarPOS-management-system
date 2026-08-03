import './TableCard.css';

const TableCard = ({table}) => {
    return(
        <div className="table-card" style={{backgroundColor: table.status === "available" ? "green" : "red"}}>
            {table.tableNo}
        </div>
    )
}

export default TableCard;