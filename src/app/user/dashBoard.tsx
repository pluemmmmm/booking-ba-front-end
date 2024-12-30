"use client"
import Navbar from '../components/navbar'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import React from 'react';
import axios from 'axios';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import Chart from "react-apexcharts";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import dayjs from 'dayjs';

interface CountData {
    January: number;
    February: number;
    March: number;
    April: number;
    May: number;
    June: number;
    July: number;
    August: number;
    September: number;
    October: number;
    November: number;
    December: number;
}

interface Today {
    count: number;
    fullname: string;
    meetName: string;
}

interface Room {
    room: string;
    month: number;
    year: number;
    count: number;
}

interface Row {
    name: string;
    code: string;
    population: number;
    size: number;
    density: number;
}

interface AccountData {
    username: string;
    flowtype: string;
}

export default function dashBorad() {

    const [userData, setUserData] = React.useState<AccountData | null>(null);

    React.useEffect(() => {
        const accountString = localStorage.getItem('account');
        if (accountString) {
            try {
                const accountData: AccountData = JSON.parse(accountString);
                setUserData(accountData);
            } catch (error) {
                console.error("Error parsing account data:", error);
            }
        }
    }, []);

    async function countBookingOfMonth() {
        try {
            const res = await axios.get(`http://localhost:3030/api/v1/booking/countBookingOfMonths`)
            console.log(res.data);
            setCount(res.data);
        } catch (error) {
            console.error('Error fetching meeting room data:', error);
        }
    }

    async function countTodayBookings() {
        try {
            const res = await axios.get(`http://localhost:3030/api/v1/booking/counttodayBookings`)
            console.log(res.data);
            setToday(res.data);
        } catch (error) {
            console.error('Error fetching meeting room data:', error);
        }
    }

    async function roomBookingCountByMonth() {
        try {
            const res = await axios.get(`http://localhost:3030/api/v1/booking/roomBookingCountByMonth`)
            console.log(res.data);
            setCountMeetRoom(res.data);
        } catch (error) {
            console.error('Error fetching meeting room data:', error);
        }
    }

    async function getBookingData() {
        try {
            const res = await axios.get(`http://localhost:3030/api/v1/booking?fullname=${userData?.username}`);
            const filteredData = res.data.filter((booking: any) => booking.status === true);
            setRows(filteredData);
            console.log(res);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    }

    React.useEffect(() => {
        countBookingOfMonth()
    }, [])

    React.useEffect(() => {
        countTodayBookings()
    }, [])

    React.useEffect(() => {
        roomBookingCountByMonth()
    }, [])

    React.useEffect(() => {
        if (userData) {
            getBookingData();
        }
    }, [userData]);

    const [count, setCount] = React.useState<CountData>({ January: 0, February: 0, March: 0, April: 0, May: 0, June: 0, July: 0, August: 0, September: 0, October: 0, November: 0, December: 0 });
    const [today, setToday] = React.useState<Today>({ count: 0, fullname: '', meetName: '' });
    const [countMeetRoom, setCountMeetRoom] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState<any[]>([]);

    const chartBar = {
        type: "bar",
        height: 240,
        width: 500,
        series: [
            {
                name: "จำนวนการจอง",
                data: [
                    count.January,
                    count.February,
                    count.March,
                    count.April,
                    count.May,
                    count.June,
                    count.July,
                    count.August,
                    count.September,
                    count.October,
                    count.November,
                    count.December,
                ],
            },
        ],
        options: {
            chart: {
                toolbar: {
                    show: false,
                },
            },
            title: {
                show: "",
            },
            dataLabels: {
                enabled: false,
            },
            colors: ["#089BCC"],
            stroke: {
                lineCap: "round",
                curve: "smooth",
            },
            markers: {
                size: 0,
            },
            xaxis: {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
                categories: [
                    "ม.ค.",
                    "ก.พ.",
                    "มี.ค.",
                    "เม.ย.",
                    "พ.ค.",
                    "มิ.ย.",
                    "ก.ค.",
                    "ส.ค.",
                    "ก.ย.",
                    "ต.ค.",
                    "พ.ย.",
                    "ธ.ค.",
                ],
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "#dddddd",
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 5,
                    right: 20,
                },
            },
            fill: {
                opacity: 0.8,
            },
            tooltip: {
                theme: "dark",
            },
        },
    };

    const chartConfig = {
        type: "bar",
        height: 240,
        width: 500,
        series: [
            {
                name: "จำนวนการจอง",
                data: countMeetRoom.map((item) => item.count), // ใช้ข้อมูลจำนวนการจองจาก countMeetRoom
            },
        ],
        options: {
            chart: {
                toolbar: {
                    show: false,
                },
            },
            title: {
                show: "",
            },
            dataLabels: {
                enabled: false,
            },
            colors: ["#089BCC"],
            stroke: {
                lineCap: "round",
                curve: "smooth",
            },
            markers: {
                size: 0,
            },
            xaxis: {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
                categories: countMeetRoom.map((item) => {
                    return item.room.length > 10 ? item.room.substring(0, 10) + "..." : item.room;
                }),
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "#dddddd",
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 5,
                    right: 20,
                },
            },
            fill: {
                opacity: 0.8,
            },
            tooltip: {
                theme: "dark",
                y: {
                    formatter: function (val: number) {
                        return val + " ครั้ง";
                    },
                },
                x: {
                    formatter: function (val: string) {
                        const room = countMeetRoom.find((item) => item.room.substring(0, 10) + "..." === val);
                        return room ? room.room : val;
                    },
                },
            },
        },
    };

    return (
        <>
            <style jsx global>{`
            body {
                background-color: #f4f6f9;
            }
        `}</style>
            <Navbar />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginLeft: '3%',
                    alignItems: 'center',
                    height: '100vh',
                    width: '95%',
                }}>
                <div className='col-2 mt-5'>
                    <div className='flex justify-center item-center gap-2'>

                        <Card>
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
                            >
                                <div className="">
                                    {/* <Square3Stack3DIcon className="h-6 w-6" /> */}
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        การจองห้องประชุมแต่ละเดือน
                                    </Typography>
                                </div>
                            </CardHeader>
                            <CardBody className="px-2 pb-0">
                                <Chart {...chartBar} />
                            </CardBody>
                        </Card>

                        <Card className=''>
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
                            >
                                <div className="">
                                    {/* <Square3Stack3DIcon className="h-6 w-6" /> */}
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        การจองห้องประชุมแต่ละห้อง
                                    </Typography>
                                </div>
                            </CardHeader>
                            <CardBody className="px-2 pb-0">
                                <Chart {...chartConfig} />
                            </CardBody>
                        </Card>

                        <Card className="w-[280px]">
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="grid grid-cols-1 gap-x-2 ml-2 md:items-center text-left text-sm "
                            >
                                <div className="">
                                </div>
                                <div>
                                    <Typography className='grid grid-cols-1 gap-x-4 ml-2 text-center' variant="h6" color="blue-gray">
                                        ปีนี้
                                    </Typography>
                                    <div className='text-sm text-left mt-1 ml-5'>
                                        <div>
                                            <div className=''>{countMeetRoom.map((item, index) => (
                                                <div key={index}>
                                                    {item.room} : <span className='text-[#089BCC]'>{item.count}</span> ครั้ง
                                                </div>
                                            ))}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="px-2 pb-4">
                            </div>
                        </Card>

                    </div>
                    <div className='mt-2 flex justify-center gap-2 h-44'>

                        <Card className="w-[300px] flex items-center">
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="flex flex-col gap-1 rounded-none md:flex-row md:items-center "
                            >
                                <div className="">
                                </div>
                                <div>
                                    <Typography className='text-center' variant="h6" color="blue-gray">
                                        วันนี้
                                    </Typography>
                                    <div className=''>
                                        มีการจองห้องประชุม : <span className='text-[#089BCC]'>{today.count}</span> ครั้ง
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="px-2 pb-4">
                            </div>
                        </Card>

                        <Card className="w-[500px] flex items-center">
                            <div className='mt-2 text-center'>
                                <Typography variant="h6" color="blue-gray">
                                    การจองห้องประชุมแต่ละเดือน
                                </Typography>
                            </div>
                            <div className="grid grid-cols-3 gap-x-4 ml-2 md:items-center text-left">
                                <div className='text-sm text-black text-left mt-1 mr-4'>มกราคม : <span className='text-[#089BCC]'>{count.January}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>กุมภาพันธ์ : <span className='text-[#089BCC]'>{count.February}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>มีนาคม : <span className='text-[#089BCC]'>{count.March}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>เมษายน : <span className='text-[#089BCC]'>{count.April}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>พฤษภาคม : <span className='text-[#089BCC]'>{count.May}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>มิถุนายน : <span className='text-[#089BCC]'>{count.June}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>กรกฎาคม : <span className='text-[#089BCC]'>{count.July}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>สิงหาคม : <span className='text-[#089BCC]'>{count.August}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>กันยายน : <span className='text-[#089BCC]'>{count.September}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>ตุลาคม : <span className='text-[#089BCC]'>{count.October}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1 mr-4'>พฤศจิกายน : <span className='text-[#089BCC]'>{count.November}</span> ครั้ง</div>
                                <div className='text-sm text-left mt-1'>ธันวาคม : <span className='text-[#089BCC]'>{count.December}</span> ครั้ง</div>
                            </div>
                        </Card>
                    </div>

                </div>

            </Box>
        </>
    );
}
