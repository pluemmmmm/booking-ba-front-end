"use client"
import Navbar from '../components/navbar'
import DashBoard from '../user/dashBoard'

export default function admin() {

    return (
        <div className="bg-gray-100">
            <Navbar />
            <DashBoard />
        </div>
    )
}