import React, {useContext} from "react";
import './RelatedProducts.css'
import data_product from '../Assets/data'
import Item from "../Items/Item";
import { ShopContext } from '../../Context/ShopContext'

const RelatedProducts = (props) => {
    const {all_product} = useContext(ShopContext)
    const {category} = props;
    const relatedItems = all_product
        .filter(item => item.category === category)
        .slice(0, 4);
    return (
        <div className="relatedproducts">
            <h1>Related Products</h1>
            <hr />
            <div className="relatedproducts-item">
            {relatedItems.map((item,i)=>{
                return(
                    <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            )})}
            </div>
        </div>
    )
}

export default RelatedProducts