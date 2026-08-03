const TableModal = ({table, removeModal}) => {
    return(
        <div className="table-modal">
            <h3>Table no.{table.tableNo}</h3>
            <p style={{color: table.status === "available" ? "green" : "red"}}>Status: {table.status}</p>
            {table.status === "available" ?
                (<button>Open Table</button>)
            :
                (<>
                    <button>Update Table</button>
                    <button>Checkout</button>
                </>)
            }
            <button onClick={removeModal}>Back</button>
        </div>
    )
}

export default TableModal;