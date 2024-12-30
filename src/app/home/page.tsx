"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import ErrorIcon from '@mui/icons-material/Error';
import { EventSourceInput } from '@fullcalendar/core/index.js'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from '../components/navbar'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs'
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import localeTh from '@fullcalendar/core/locales/th';
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Event {
    title: String;
    name: String;
    start: Dayjs;
}

interface AccountData {
    username: string;
    flowtype: string;
}

interface BookingPayload {
    readonly meetName: String;
    readonly fullname: String;
    readonly startDate: Dayjs;
    readonly endDate: Dayjs;
    readonly event: String;
    readonly phone: String;
}

export default function home() {
    const [userData, setUserData] = useState<AccountData | null>(null);
    const router = useRouter();

    useEffect(() => {
        const accountString = localStorage.getItem('account');
        if (accountString) {
            try {
                const accountData: AccountData = JSON.parse(accountString);
                setUserData(accountData);
            } catch (error) {
                console.error("Error parsing account data:", error);
            }
        }
    }, [])

    const [allEvents, setAllEvents] = useState<Event[]>([])
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const [newEvent, setNewEvent] = useState<Event>({
        title: '',
        name: '',
        start: dayjs(),
    })
    const [meetRoom, setMeetRoom] = useState<String>('')
    const [event, setEvent] = useState<String>('')
    const [phone, setPhone] = useState<String>('')
    const [dateStart, setDateStart] = useState<Dayjs | null>(null);
    const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
    const [type, setType] = useState<String | Number>("");
    const [data, setData] = useState<any[]>([]);
    const eightAM = dayjs().set('hour', 8).startOf('hour');
    const eighteenThirtyAM = dayjs().set('hour', 18).set('minute', 30).startOf('minute');
    const [dateSelected, setDateSelected] = useState(false);

    const handlegetRoom = async (type: String) => {
        setType(Number(type));
    };

    const clearState = () => {
        setType("");
        setDateStart(null);
        setDateEnd(null);
        setNewEvent(
            {
                title: '',
                name: '',
                start: dayjs(),
            }
        )
    }

    function handleDateClick(arg: any) {
        setDateStart(dayjs(arg.date).set('hour', 8).startOf('hour'));
        setDateEnd(dayjs(arg.date).set('hour', 18).set('minute', 30).startOf('minute'));
        setShowModal(true);
    }

    function handleDeleteModal(data: { event: { id: string } }) {
        setShowDeleteModal(true)
        setIdToDelete(Number(data.event.id))
    }

    function handleDelete() {
        // setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)))
        setShowDeleteModal(false)
        setIdToDelete(null)
    }

    function handleCloseModalCreate() {
        setShowModal(false);
        clearState();
    }

    function handleCloseModal() {
        setShowModal(false)
        setNewEvent({
            title: '',
            name: '',
            start: dayjs(),
        })
        setShowDeleteModal(false)
        setIdToDelete(null)
    }

    function addEventToCalendar(newEvent: Event) {
        setAllEvents([...allEvents, newEvent]);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewEvent({
            ...newEvent,
            title: e.target.value
        })
    }

    async function getMeetingRoom() {
        const res = await axios.get(`http://localhost:3030/api/v1/meetingRoom`)
        setAllEvents(res.data);
        setData(res.data)
        console.log(res)
    }

    async function getBookingData() {
        try {
            const res = await axios.get(`http://localhost:3030/api/v1/booking?fullname=${userData?.username}`)
            setAllEvents(res.data)
            console.log(res)
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    }

    useEffect(() => {
        if (userData) {
            getBookingData();
            alert("ตำแนะนำสำหรับจองห้องประชุม! สามารถเลือกวันที่ตามช่องวันที่ปฏิทิน และกรอกข้อมูลของท่านได้เลย");
        }
    }, [userData]);

    useEffect(() => {
        if (userData) {
            getBookingData();
        }
    }, [userData]);

    useEffect(() => {
        if (userData) {
            getMeetingRoom();
            getBookingData();
        }
    }, [userData, type, dateStart, dateEnd, event, meetRoom])

    async function addBooking() {
        const payload: BookingPayload = {
            meetName: meetRoom,
            fullname: userData?.username!!,
            startDate: dateStart!!,
            endDate: dateEnd!!,
            event: event,
            phone: phone
        };
        try {
            const res = await axios.post(`http://localhost:3030/api/v1/booking/addBooking`, payload);
            if (res.data === 'Booking already exists for this time range and meetName.') {
                toast.error('เกิดข้อผิดพลาด: มีการจองในช่วงเวลาและสถานที่เดียวกันแล้ว');
            } else {
                toast.success('สร้างสำเร็จ!');
                setTimeout(() => {
                    router.push('/home');
                }, 1000);
            }
        } catch (e) {
            console.log(e);
            toast.error('เกิดข้อผิดพลาดในการสร้างการจอง');
        }
    }

    const disableKeyboardEntry = (e: any) => {
        if (e?.preventDefault) {
            e?.preventDefault();
            e?.stopPropagation();
        }
    };

    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white text-black font-bold">
                <div className="grid grid-cols-10 w-full h-full mt-10">
                    <div className="col-span-10">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                            headerToolbar={{
                                left: 'today prev,next',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={allEvents as EventSourceInput}
                            nowIndicator={true}
                            editable={true}
                            droppable={true}
                            selectable={true}
                            selectMirror={true}
                            dateClick={handleDateClick}
                            // drop={(data) => addEvent(data)}
                            eventClick={(data) => handleDeleteModal(data)}
                        // locale={localeTh} // Set the locale to Thai
                        />
                    </div>
                </div>

                <Transition.Root show={showDeleteModal} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"

                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-16">
                                        <div className="bg-white px-4 pb-4 pt-5 sm:p-2 sm:pb-4">
                                            <div className="sm:items-start">
                                                <div className=" mx-auto flex h-8 w-12 items-center justify-center rounded-full text-center">
                                                    <ErrorIcon className="h-20 w-20 text-orange-500 " aria-hidden="true" />
                                                </div>
                                                <div className="mt-6 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-3xl text-center font-semibold leading-10 text-gray-900 mt-10">
                                                        Delete Event
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-xl text-gray-500">
                                                            Are you sure you want to delete this event?
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-10 sm:mt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-5">
                                            <button type="button" className="text-lg inline-flex w-full justify-center rounded-md bg-red-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2 border-2 border-black" onClick={handleDelete}>
                                                Delete
                                            </button>
                                            <button type="button" className="text-lg mt-3 inline-flex w-full justify-center rounded-md bg-white px-2 py-1 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto border-2 border-black"
                                                onClick={handleCloseModal}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={showModal} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={setShowModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[650px] sm:p-16 max-h-[100vh]" style={{ marginTop: "5vh" }}>
                                        <div>
                                            <div className=" text-center">

                                                <Dialog.Title as="h3" className="text-3xl font-semibold leading-10 text-gray-900">
                                                    Create Meeting
                                                </Dialog.Title>

                                                <div className="mt-5">
                                                    <label
                                                        htmlFor="text"
                                                        className="flex items-start text-sm font-semibold text-gray-800">
                                                        Meeting Name
                                                    </label>
                                                </div>
                                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-20 border-2 border-solid border-black rounded-md text-left">
                                                    <FormControl className="md:w-[535px]">
                                                        <Select
                                                            id="type"
                                                            defaultValue={""}
                                                            onChange={(e) => {
                                                                setMeetRoom(e.target.value)
                                                            }}>
                                                            {data.map((item, index) => (
                                                                <MenuItem
                                                                    key={item.meetname}
                                                                    value={item.meetname}>
                                                                    {item.meetname}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                <div className="mt-5 flex">
                                                    <label
                                                        htmlFor="text"
                                                        className="flex items-start text-sm font-semibold text-gray-800 mr-24">
                                                        Start date
                                                    </label>
                                                    <label
                                                        htmlFor="text"
                                                        className="flex items-start text-sm font-semibold text-gray-800 ml-28">
                                                        Start date
                                                    </label>
                                                </div>

                                                <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-4 mt-1 text-xl">
                                                    <div className="flex flex-col gap-2 md:flex-row md:gap-16 items-center border-2 border-solid border-black rounded-md">
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DateTimePicker
                                                                format="DD/MM/YYYY HH:mm"
                                                                slotProps={{
                                                                    textField: {
                                                                        onBeforeInput: disableKeyboardEntry,
                                                                        onMouseDown: disableKeyboardEntry,
                                                                        onMouseEnter: disableKeyboardEntry,
                                                                        size: "medium",
                                                                    },
                                                                }}
                                                                value={dateStart || eightAM}
                                                                onChange={(newValue) => {
                                                                    setDateStart(newValue);
                                                                }}
                                                                ampm={false}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-2 md:gap-16 items-center border-2 border-solid border-black rounded-md">
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DateTimePicker
                                                                format="DD/MM/YYYY HH:mm"
                                                                slotProps={{
                                                                    textField: {
                                                                        onBeforeInput: disableKeyboardEntry,
                                                                        onMouseDown: disableKeyboardEntry,
                                                                        onMouseEnter: disableKeyboardEntry,
                                                                        size: "medium",
                                                                    },
                                                                }}
                                                                value={dateEnd || eighteenThirtyAM}
                                                                onChange={(newValue) => setDateEnd(newValue)}
                                                                ampm={false}
                                                                minDate={dateStart}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>

                                                <div className="mt-5">
                                                    <label
                                                        htmlFor="text"
                                                        className="flex items-start text-sm font-semibold text-gray-800">
                                                        Full name
                                                    </label>
                                                    <input
                                                        name="Name"
                                                        className="text-lg block w-full rounded-md border-2 border-solid border-black px-3 text-gray-900 ring-gray-300 placeholder:text-gray-400 sm:leading-10"
                                                        value={userData?.username!!}
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div className="mt-5">
                                                    <label
                                                        htmlFor="text"
                                                        className="flex items-start text-sm font-semibold text-gray-800">
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        className="text-lg block w-full rounded-md border-2 border-solid border-black px-3 text-gray-900 ring-gray-300 placeholder:text-gray-400 sm:leading-10"
                                                        value={String(phone)}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="Please enter your phone number."
                                                    />
                                                </div>

                                                <div className="mt-5">
                                                    <label
                                                        htmlFor="text"
                                                        className="flex items-start text-sm font-semibold text-gray-800">
                                                        Remark
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        className="text-lg block w-full rounded-md border-2 border-solid border-black px-3 text-gray-900 ring-gray-300 placeholder:text-gray-400 sm:leading-10"
                                                        value={String(event)}
                                                        onChange={(e) => setEvent(e.target.value)}
                                                        placeholder="Please enter your event."
                                                    />
                                                </div>

                                                <div className="mt-5">
                                                    {/* <div className="mt-5">
                                                        <label
                                                            htmlFor="text"
                                                            className="flex items-start text-sm font-semibold text-gray-800">
                                                            Remark
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            className="text-lg block w-full rounded-md border-2 border-solid border-black px-3 text-gray-900 ring-gray-300 placeholder:text-gray-400 sm:leading-10"
                                                            value={String(event)}
                                                            onChange={(e) => setEvent(e.target.value)}
                                                            placeholder="Please enter your event."
                                                        />
                                                    </div> */}


                                                    <div className="mt-10 sm:mt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-5">
                                                        <button
                                                            onClick={() => {
                                                                addBooking();
                                                                handleCloseModal();
                                                            }}
                                                            className="text-lg inline-flex w-full justify-center rounded-md bg-sky-400 px-2 py-1 font-semibold text-white shadow-sm hover:bg-sky-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2 border-2 border-sky-600"                                                        >
                                                            Create
                                                        </button>

                                                        <button
                                                            className="text-lg mt-3 inline-flex w-full justify-center rounded-md bg-white px-2 py-1 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto border-2 border-black"
                                                            onClick={() => {
                                                                handleCloseModal();
                                                                clearState();
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog >
                </Transition.Root >
            </main >
            <ToastContainer />
        </>
    )
}