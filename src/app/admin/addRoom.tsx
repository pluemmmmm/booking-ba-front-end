"use client"
import Navbar from '../components/navbar'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import axios from 'axios';

const columns = [
    { id: 'meetname', label: 'รายชื่อห้องประชุม', minWidth: 550, align: 'center' as const },
];

interface payloadAddRoom {
    meetname: string;
}

export default function addRoom() {
    const router = useRouter()
    const [room, setRoom] = React.useState('')
    const [rows, setRows] = React.useState<any[]>([]);

    async function getMeetingRoom() {
        try {
            const res = await axios.get(`http://localhost:3030/api/v1/meetingRoom`)
            setRows(res.data); // อัพเดทข้อมูลห้องประชุมให้กับตาราง
        } catch (error) {
            console.error('Error fetching meeting room data:', error);
        }
    }

    async function addMeetRoom() {
        const payload: payloadAddRoom = {
            meetname: room
        };
        try {
            await axios.post(`http://localhost:3030/api/v1/meetingRoom/addRoom`, payload)
            toast.success('เพิ่มห้องประชุมสำเร็จ!')
            setRoom('');
            getMeetingRoom(); // เมื่อเพิ่มห้องประชุมเรียบร้อยแล้วให้ดึงข้อมูลห้องประชุมใหม่
        } catch (error) {
            console.error('Error adding meeting room:', error);
        }
    }

    async function deleteMeetRoom(id: string) {
        const res = await axios.delete(`http://localhost:3030/api/v1/meetingRoom/deleteRoom?id=${id}`)
        console.log(res)
        getMeetingRoom()
        toast.success('ลบห้องประชุมสำเร็จ!')
        setTimeout(() => {
        }, 1500);
    }

    React.useEffect(() => {
        getMeetingRoom()
    }, [])

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginLeft: '3%',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Card sx={{ height: 250, minWidth: 500 }}>
                    <CardContent className=''>
                        <div className='mt-5 flex justify-center'>
                            <Typography variant="h5" component="div">
                                เพิ่มห้องประชุม
                            </Typography>
                        </div>
                        <div className="mt-7 ml-5 mr-5">
                            <input
                                type="text"
                                name="title"
                                className="text-lg block w-full rounded-md border-2 border-solid border-black px-3 text-gray-900 ring-gray-300 placeholder:text-gray-400 sm:leading-10"
                                value={String(room)}
                                onChange={(e) => setRoom(e.target.value)}
                                placeholder="กรอกชื่อห้องประชุม"
                            />
                        </div>
                        <div className='mt-10 ml-40 mr-40'>
                            <button
                                onClick={() => {
                                    addMeetRoom()
                                }}
                                className="text-lg inline-flex w-full justify-center rounded-md bg-sky-400 px-2 py-1 font-semibold text-white shadow-sm hover:bg-sky-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2 border-2 border-sky-600"
                            >
                                เพิ่ม
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 400, overflowX: 'hidden', overflowY: 'auto' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <button onClick={() => deleteMeetRoom(row._id)} className="mr-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl flex justify-center items-center gap-1">
                                                            นำออก
                                                        </button>
                                                        {row.meetname}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <ToastContainer />
                </div>
            </Box>
        </>
    );
}
