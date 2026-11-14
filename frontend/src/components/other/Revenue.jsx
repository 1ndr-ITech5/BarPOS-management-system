import "../../comp-style/other-style/Revenue.css";

const Revenue = ({title, payments}) => {

    const totalRevenue = payments.reduce((sum, payment) => {return sum + payment.totalAmount}, 0)

    return (
        <div className="revenue-card">
            <h1>{title} Revenue</h1>
            <h2>{totalRevenue} ALL</h2>
        </div>
    )
}

export default Revenue;