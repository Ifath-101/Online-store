import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import AddProduct from '../../Components/Addproduct/Addproduct'
import ListProduct from '../../Components/Listproduct/Listproduct'

const Admin = () => {
    return (
        <div className='admin'>
            <Sidebar/>
            <Routes>
                <Route path="/" element={<Navigate to="addproduct" replace />} />
                <Route path='/addproduct' element={<AddProduct/>}/>
                <Route path='/listproduct' element={<ListProduct/>}/>
            </Routes>
        </div>
    )
}

export default Admin