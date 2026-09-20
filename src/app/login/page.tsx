"use client";
import * as React from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function login() {
    const router = useRouter();
    const [username, setUsername] = React.useState('');
    const [flowtype, setFlowtype] = React.useState('Admin');

    function goLogin() {
        if (!username.trim()) {
            toast.error('กรุณากรอกชื่อผู้ใช้ / รหัสประจำตัว!');
            return;
        }

        const userData = {
            username: username.trim(),
            flowtype: flowtype,
            status: true
        };

        localStorage.setItem('account', JSON.stringify(userData));
        toast.success('เข้าสู่ระบบสำเร็จ!');
        setTimeout(() => {
            router.push('/home');
        }, 1000);
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
                                ชื่อผู้ใช้ / รหัสประจำตัว
                            </label>
                            <input
                                type="text"
                                value={username}
                                placeholder="กรอกชื่อผู้ใช้งาน"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-sm font-semibold text-gray-800"
                            >
                                สิทธิ์การใช้งาน (Role)
                            </label>
                            <select
                                value={flowtype}
                                onChange={(e) => setFlowtype(e.target.value)}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            >
                                <option value="Admin">Admin (ผู้ดูแลระบบ)</option>
                                <option value="User">User (ผู้ใช้งานทั่วไป)</option>
                            </select>
                        </div>
                        <div className="mt-8">
                            <button
                                onClick={goLogin}
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#0089F7] rounded-md hover:bg-[#3da6fd] focus:outline-none focus:bg-gray-600"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

