"use client"
import Navbar from '../components/navbar'
import TableManage from '../admin/tableManage'

export default function manage() {

    return (
        <div className="bg-gray-100">
            <Navbar />
            <TableManage />
        </div>
    )
}