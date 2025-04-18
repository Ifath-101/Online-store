import React, { useContext } from 'react'
import {ShopContext} from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import Productdisplay from '../Components/Productdisplay/Productdisplay';
import Descriptionbox from '../Components/Descriptionbox/Descriptionbox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
    const {all_product} = useContext(ShopContext);
    const {productId} = useParams();
    const product = all_product.find((e)=> e.id === Number(productId));
    return (
        <div>
            <Breadcrum product={product}/>
            <Productdisplay product={product} />
            <Descriptionbox />
            <RelatedProducts category={product.category} />
        </div>
    )
}
export default Product