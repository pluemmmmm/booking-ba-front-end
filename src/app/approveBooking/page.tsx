"use client"
import Navbar from '../components/navbar'
import ApproveBooking from '../user/approveBooking'

export default function admin() {

    return (
        <div className="bg-gray-100">
            <Navbar />
            <ApproveBooking />
        </div>
    )
}