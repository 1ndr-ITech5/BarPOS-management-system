import {formatDate} from "../utils/DateFormat.js";
import "../layout-style/Header.css";

const Header = () => {
    const today = new Date()

    return (
        <div className="header">
            <h3>BarPOS System</h3>
            <h4>{formatDate(today)}</h4>
            <select className="language-dropdown">
                <option value="shqip">Shqip</option>
                <option value="english">English</option>
            </select>
        </div>
    )
}

export default Header;