"use client";
import * as React from 'react';
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function login() {
    const router = useRouter()
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    async function goLogin() {
        const payload = {
            userid: username,
            userpass: password
        }
        const res = await axios.post(`http://localhost:3030/api/v1/user/login`, payload)
        if (username.trim() == '' || password.trim() == '') {
            location.reload()
        } else if (res.data && res.data.userData && res.data.userData.status === true) {
            localStorage.setItem('account', JSON.stringify(res.data.userData))
            toast.success('เข้าสู่ระบบสำเร็จ!')
            setTimeout(() => {
                router.push('/home')
            }, 1500);
        } else {
            toast.error('กรุณาข้อมูลให้ถูกต้อง!')
        }
    }

    return (
        <div className="relative bg-gray-200">
            <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
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
                                htmlFor="text"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                รหัสประจำตัว
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                รหัสผ่าน
                            </label>
                            <input
                                type="password"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Link
                            href="/forget"
                            className="text-xs text-blue-600 hover:underline"
                        >
                        </Link>
                        <div className="mt-12" onClick={goLogin}>
                            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#0089F7] rounded-md hover:bg-[#3da6fd] focus:outline-none focus:bg-gray-600">
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-center text-gray-700">
                        ยังไม่มีบัญชี?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            สมัครใช้งาน
                        </Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
