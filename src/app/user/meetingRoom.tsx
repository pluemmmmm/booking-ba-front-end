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
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import axios from 'axios';
import { Card } from '@material-tailwind/react';

const columns = [
    { id: '', label: '', minWidth: 50, align: 'center' as const },
    { id: 'fullname', label: 'ชื่อ-นามสกุล', minWidth: 100, align: 'left' as const },
    {
        id: 'event',
        label: 'หมายเหตุ',
        minWidth: 100,
        align: 'left' as const,
    },
    {
        id: 'startDate',
        label: 'เวลาเริ่มการประชุม',
        minWidth: 100,
        align: 'center' as const,
        format: (value: string) => dayjs(value).format('DD MMM YYYY HH:mm น.'),
        locale: 'th',
    },
    {
        id: 'endDate',
        label: 'เวลาจบการประชุม',
        minWidth: 100,
        align: 'center' as const,
        format: (value: string) => dayjs(value).format('DD MMM YYYY HH:mm น.'),
        locale: 'th',
    },
    {
        id: 'meetName',
        label: 'ชื่อห้องประชุม',
        minWidth: 100,
        align: 'left' as const,
    },
    {
        id: 'phone',
        label: 'เบอร์โทรศัพท์',
        minWidth: 100,
        align: 'left' as const,
    },
];

interface AccountData {
    username: string;
    flowtype: string;
}

interface Row {
    name: string;
    code: string;
    population: number;
    size: number;
    density: number;
}

export default function meetingRoom() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState<any[]>([]);
    const [userData, setUserData] = React.useState<AccountData | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

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

    async function getBookingData() {
        try {
            const res = await axios.get(`http://localhost:3030/api/v1/booking/findAll`)
            setRows(res.data)
            console.log(res)
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    }

    React.useEffect(() => {
        if (userData) {
            getBookingData();
        }
    }, [userData]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper sx={{ width: '95%', overflow: 'hidden' }}>
                <Card>
                    <div className='flex justify-end mt-2 mb-2 mr-2'>
                        <input
                            className='felx justify-end border-2 border-gray-400 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none'
                            type="text"
                            placeholder="ค้นหาห้องประชุม..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ marginBottom: '10px', padding: '5px', width: '25%' }}
                        />
                    </div>
                    <TableContainer sx={{ maxHeight: 440 }}>
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
                                {rows.length === 0 ? (
                                    <TableRow style={{ height: 300 }}>
                                        <TableCell colSpan={columns.length + 1} align="center">
                                            <SchoolIcon style={{ color: '#EEEEEE', height: '100px', width: '100px' }} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows
                                        .filter(row => row.meetName.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id as keyof Row];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'string'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell key="actions" align="left">
                                                        {/* <button onClick={() => deleteBookingData(row._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl flex justify-center items-center gap-1">
                                                        <DeleteIcon />
                                                        ยกเลิกการจอง
                                                    </button> */}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                )}
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
                </Card>
            </Paper>
            <ToastContainer />
        </div>
    );
}
