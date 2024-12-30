"use client"
import AddRoom from '../admin/addRoom'
import Navbar from '../components/navbar'

export default function admin() {

    return (
        <div className="bg-gray-100">
            <Navbar />
            <AddRoom />
        </div>
    )
}