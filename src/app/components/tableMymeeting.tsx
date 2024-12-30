import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';
import dayjs from 'dayjs';

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
        align: 'left' as const,
        format: (value: string) => dayjs(value).format('DD MMM YYYY HH:mm น.'),
    },
    {
        id: 'endDate',
        label: 'เวลาจบการประชุม',
        minWidth: 100,
        align: 'left' as const,
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

function createRow(name: string, code: string, population: number, size: number) {
    const density = population / size;
    return { name, code, population, size, density } as Row;
}

export default function tableMymeeting() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState<any[]>([]);
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

    async function getBookingData() {
        try {
            const res = await axios.get(`http://localhost:3030/api/v1/booking/findUserName?fullname=${userData?.username}`)
            const filteredData = res.data.filter((booking: any) => booking.status === true);
            setRows(filteredData);
            // setRows(res.data)
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
                            {rows.length === 0 ? (
                                <TableRow style={{ height: 300 }}>
                                    <TableCell colSpan={columns.length} align="center">
                                        <SchoolIcon style={{ color: '#EEEEEE', height: '100px', width: '100px' }} />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows
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
                                                    <div className="bg-green-500 text-white font-bold py-1 rounded-3xl flex justify-center items-center mr-10">
                                                        อนุมัติแล้ว
                                                    </div>
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
            </Paper>
        </div>
    );
}
