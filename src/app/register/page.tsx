"use client"
import Link from "next/link";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

interface registerPayload {
    readonly userid: String;
    readonly userpass: String;
    readonly username: String;
    readonly usertype: String;
}

export default function register() {
    const [data, setData] = useState<any[]>([]);
    const [userId, setUserId] = useState<String>("");
    const [userPass, setUserPass] = useState<String>("");
    const [fullname, setFullname] = useState<String>("");
    const [userType, setUserType] = useState<String>("");
    const router = useRouter()

    async function getUserType() {
        const res = await axios.get(`http://localhost:3030/api/v1/userType`)
        setData(res.data)
        console.log(res)
    }

    useEffect(() => {
        getUserType()
    }, [])

    async function sendRegiter() {
        try {
            const paylaod: registerPayload = {
                userid: userId,
                userpass: userPass,
                username: fullname,
                usertype: userType
            }
            if (userId.trim() === "" || userPass.trim() === "" || fullname.trim() === "" || userType.trim() === "") {

                return;
            } else {
                const res = await axios.post(`http://localhost:3030/api/v1/user/create`, paylaod)
                toast.success('สมัครสมาชิกสำเร็จ!')
                setTimeout(() => {
                    router.push('/login')
                }, 1500);
                console.log(res)
            }
        } catch (e) {
            console.log(e)
        }
    }

    // useEffect(() => {
    //     sendRegiter()
    // }, [])

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-200">
            <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">

                <a className="flex items-center space-x-3 rtl:space-x-reverse justify-center">
                    <img src="/assets/ba.png" className="h-20 w-17" alt="Logo" />
                    <span className="self-center text-4xl font-semibold whitespace-nowrap dark:text-black">
                        Booking | <span style={{ color: '#0089F7' }}>BA</span>
                    </span>
                </a>

                <div className="mt-6">
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            ชื่อ-นามสกุล
                        </label>
                        <input
                            type="email"
                            onChange={(e) => setFullname(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            รหัสประจำตัว
                        </label>
                        <input
                            type="email"
                            onChange={(e) => setUserId(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <div className="mb-4 ">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            คณะ
                        </label>
                        <Select
                            defaultValue={""}
                            className="block w-full mt-2 text-gray-700 bg-white rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40 text-md"
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            {data.map((item, index) => (
                                <MenuItem key={item.userType}
                                    value={item.userType}>
                                    {item.userType}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            รหัสผ่าน
                        </label>
                        <input
                            onChange={(e) => setUserPass(e.target.value)}
                            type="password"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <Link
                        href="/forget"
                        className="text-xs text-blue-600 hover:underline"
                    >
                    </Link>

                    <div className="mt-12">
                        <button onClick={sendRegiter} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#0089F7] rounded-md hover:bg-[#3da6fd] focus:outline-none focus:bg-gray-600">
                            สมัครสมาชิก
                        </button>
                    </div>

                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
