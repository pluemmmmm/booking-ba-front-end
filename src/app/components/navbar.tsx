// Navbar.js
"use client"
import React, { useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import LayersIcon from '@mui/icons-material/Layers';
import SearchIcon from '@mui/icons-material/Search';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupsIcon from '@mui/icons-material/Groups';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

const Navbar = () => {
    const router = useRouter()
    interface AccountData {
        username: string;
        flowtype: string;
    }

    function logout() {
        localStorage.removeItem('account');
        toast.success('ออกจากระบบสำเร็จ!')
        setTimeout(() => {
            router.push('/login');
        }, 1500);
    }

    let data: AccountData | null = null;
    const accountString = localStorage.getItem('account');

    if (accountString) {
        try {
            const accountData: AccountData = JSON.parse(accountString);
            data = accountData;
        } catch (error) {
            console.error("Error parsing account data:", error);
        }
    }

    return (
        <nav className="bg-white dark:bg-[#1E293B] fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="/assets/calendar.png" className="h-11 w-11" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Booking <span style={{ color: '#0089F7' }}>BA</span></span>
                </a>

                <div className="flex items-center">
                    <Link href={"/home"}>
                        <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                            <HomeIcon className="w-10 h-10 " />
                            <span className="text-sm ml-1">Booking</span>
                        </div>
                    </Link>
                </div>

                {data?.flowtype === "User" && (
                    <div className="flex items-center">
                        <Link href={"/myMeetingRoom"}>
                            <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                                <LayersIcon className="w-10 h-10" />
                                <span className="text-sm sm-1">My reservation</span>
                            </div>
                        </Link>
                    </div>
                )}

                {data?.flowtype === "Admin" && (
                    <div className="flex items-center">
                        <Link href={"/approveRegister"}>
                            <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                                <SupervisorAccountIcon className="w-10 h-10" />
                                <span className="text-sm ml-1">Candidate</span>
                            </div>
                        </Link>
                    </div>
                )}

                {data?.flowtype === "Admin" && (
                    <div className="flex items-center">
                        <Link href={"/manage"}>
                            <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                                <ManageAccountsIcon className="w-10 h-10" />
                                <span className="text-sm ml-1">Manage</span>
                            </div>
                        </Link>
                    </div>
                )}

                {data?.flowtype === "User" && (
                    <div className="flex items-center">
                        <Link href={"/meetingRoom"}>
                            <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                                <GroupsIcon className="w-10 h-10" />
                                <span className="text-sm ml-1">Meeting room</span>
                            </div>
                        </Link>
                    </div>
                )}

                {data?.flowtype === "Admin" && (
                    <div className="flex items-center">
                        <Link href={"/addRoom"}>
                            <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                                <AddBusinessIcon className="w-10 h-10" />
                                <span className="text-sm ml-1">Add room</span>
                            </div>
                        </Link>
                    </div>
                )}

                {data?.flowtype === "Admin" && (
                    <div className="flex items-center">
                        <Link href={"/dashBoard"}>
                            <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                                <EqualizerIcon className="w-10 h-10" />
                                <span className="text-sm ml-1">Dashboard</span>
                            </div>
                        </Link>
                    </div>
                )}

                {data?.flowtype === "Admin" && (
                    <div className="flex items-center">
                        <Link href={"/approveBooking"}>
                            <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                                <DownloadDoneIcon className="w-10 h-10" />
                                <span className="text-sm ml-1">Approve</span>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="flex justify-between items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
                    <div className="flex items-center space-x-2">
                        <AccountCircleIcon className="w-10 h-10" />
                        <div className='text-base'>{data?.username}</div>
                    </div>
                    <button className="text-xs h-8 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-3xl flex justify-center items-center gap-1"
                        onClick={logout}>
                        <ExitToAppIcon />
                        Sign out
                    </button>
                </div>

                {/* {data?.flowtype === "User" && (
                    <div className="flex items-center">
                        <Link href={"/meetingRoom"}>
                            <div className="flex items-center transition-all duration-100 transform hover:scale-125">
                                <ChecklistRtlIcon className="w-10 h-10" />
                                <span className="text-sm ml-1">Check status</span>
                            </div>
                        </Link>
                    </div>
                )} */}

            </div>
            <ToastContainer />
        </nav >
    );
};

export default Navbar;
