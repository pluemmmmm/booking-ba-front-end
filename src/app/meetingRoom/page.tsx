"use client"
import Navbar from '../components/navbar'
import MeetingRoom from '../user/meetingRoom'

export default function admin() {

    return (
        <div className="bg-gray-100">
            <Navbar />
            <MeetingRoom />
        </div>
    )
}