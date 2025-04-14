import React from "react";
import { Link } from "react-router-dom";
import './Breadcrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrum = (props) => {
    const {product} = props;
    return(
        <div className="breadcrum">
            <Link className="breadcrumb-link" to='/'>HOME</Link>
            <img src={arrow_icon} alt="" />
            <span>SHOP</span>
            <img src={arrow_icon} alt="" />
            <Link className="breadcrumb-link" to={`/${product.category}`}><span>{product.category}</span></Link>
            <img src={arrow_icon} alt="" />
            <span>{product.name}</span>
        </div>

    )
}

export default Breadcrum