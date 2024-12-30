import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ToastContainer, toast } from 'react-toastify';
import SchoolIcon from '@mui/icons-material/School';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const columns = [
    { id: '', label: '', minWidth: 50, align: 'center' as const },
    { id: 'userid', label: 'รหัสประจำตัว', minWidth: 170, align: 'left' as const },
    { id: 'username', label: 'ชื่อ-นามสกุล', minWidth: 170, align: 'left' as const },
    {
        id: 'usertype',
        label: 'คณะ',
        minWidth: 190,
        align: 'left' as const,
        format: (value: any) => value,
    },
];

interface Row {
    name: string;
    code: string;
    population: number;
    size: number;
    density: number;
}

function createRow(name: string, code: string, population: number, size: number) {
    const density = population / size;
    return { name, code, population, size, density } as Row;
}

export default function tableApprove() {
    const [rows, setRows] = React.useState<any[]>([]);

    async function getRegister() {
        const res = await axios.get(`http://localhost:3030/api/v1/user`)
        setRows(res.data)
        console.log(res)
    }

    React.useEffect(() => {
        getRegister()
    }, [])

    async function deleteRegister(id: string) {
        const res = await axios.delete(`http://localhost:3030/api/v1/user/delete?id=${id}`)
        console.log(res)
        getRegister()
        toast.error('ลบข้อมูลสำเร็จ!')
        setTimeout(() => {
        }, 1500);
    }

    async function approveRegister(id: string) {
        const res = await axios.get(`http://localhost:3030/api/v1/user/approve?id=${id}`)
        console.log(res)
        getRegister()
        toast.success('อนุมัติข้อมูลสำเร็จ!')
        setTimeout(() => {
        }, 1500);
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const renderTableBody = () => {
        if (rows.length === 0) {
            return (
                <TableRow style={{ height: 300 }}>
                    <TableCell colSpan={columns.length + 1} align="center">
                        <SchoolIcon style={{ color: '#EEEEEE', height: '100px', width: '100px' }} />
                    </TableCell>
                </TableRow>
            );
        } else {
            return rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {columns.map((column) => {
                                const value = row[column.id as keyof Row];
                                return (
                                    <TableCell key={column.id} align={column.align}>
                                        {column.format && typeof value === 'number'
                                            ? column.format(value)
                                            : value}
                                    </TableCell>
                                );
                            })}
                            <TableCell key="actions" align="left">
                                <button onClick={() => approveRegister(row._id)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-3xl mr-2 ">
                                    <CheckCircleIcon style={{ marginRight: '5px' }} />
                                    อนุมัติ
                                </button>
                                <button onClick={() => deleteRegister(row._id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl ml-5">
                                    <DeleteIcon style={{ marginRight: '3px' }} />
                                    ไม่อนุมัติ
                                </button>
                            </TableCell>
                        </TableRow>
                    );
                });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper sx={{ width: '80%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440, height: '100%' }}>
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
                                <TableCell key="actions" align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderTableBody()}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <ToastContainer />
        </div>
    );
}
