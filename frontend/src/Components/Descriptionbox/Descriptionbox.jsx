import React from 'react'
import './Descriptionbox.css'

const Descriptionbox = () => {
    return (
        <div className='descriptionbox'>
            <div className='descriptionbox-navigator'>
                <div className='descriptionbox-nav-box'>Description</div>
                <div className='descriptionbox-nav-box fade'>Reviews (122)</div>
            </div>
            <div className='descriptionbox-description'>
                <p>An e-commerce website, or electronic commerce website, is an online platform where businesses and individuals can buy and sell goods and services over the internet. 
                E-commerce websites facilitate online transactions, allowing customers to browse products, add them to a cart, and complete purchases securely.They typically include features like product catalogs, search filters, shopping carts, secure payment gateways, and order management systems.  
                </p>
                <p>E-commerce encompasses various transactions, including online shopping, ordering software services, business-to-consumer (B2C), business-to-business (B2B), and consumer-to-consumer (C2C). 
                </p>
            </div>
        </div>
    )
}

export default Descriptionbox