"use client"
import Navbar from '../components/navbar'
import MyMeeting from '../components/tableMymeeting'

export default function admin() {

    return (
        <div className="bg-gray-100">
            <Navbar />
            <MyMeeting />
        </div>
    )
}