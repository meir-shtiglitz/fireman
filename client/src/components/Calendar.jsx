import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../api/event';
import EventModal from './EventModal';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import he from 'date-fns/locale/he';

const locales = {
    'he': he,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(window.innerWidth < 768 ? Views.DAY : Views.MONTH);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');

    useEffect(() => {
        fetchEvents();

        const handleResize = () => {
            setView(window.innerWidth < 768 ? Views.DAY : Views.MONTH);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [statusFilter, paymentFilter]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (paymentFilter) params.paymentStatus = paymentFilter;

            const fetchedEvents = await getEvents(params);

            // Format events for react-big-calendar
            const formattedEvents = fetchedEvents.map(ev => {
                const date = new Date(ev.eventDate);
                let start = new Date(date);
                let end = new Date(date);

                if (ev.eventTime) {
                    const [hours, minutes] = ev.eventTime.split(':');
                    start.setHours(parseInt(hours, 10), parseInt(minutes, 10));

                    // Simple end time calculation (start + duration in minutes)
                    if (ev.duration) {
                        const endTime = new Date(start.getTime() + ev.duration * 60000);
                        end = endTime;
                    } else {
                        end.setHours(parseInt(hours, 10) + 1, parseInt(minutes, 10)); // Default 1 hr
                    }
                }

                return {
                    id: ev._id,
                    title: `${ev.activityType || 'Event'} - ${ev.customer?.recipient || 'Customer'}`,
                    start,
                    end,
                    resource: ev // store original event data
                };
            });
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        let backgroundColor = '#3174ad'; // default (scheduled - blue)

        switch (event.resource.status) {
            case 'confirmed':
                backgroundColor = '#28a745'; // green
                break;
            case 'completed':
                backgroundColor = '#6c757d'; // gray
                break;
            case 'cancelled':
                backgroundColor = '#dc3545'; // red
                break;
            default:
                backgroundColor = '#007bff'; // blue
        }

        const style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return { style };
    };

    const handleSelectSlot = (slotInfo) => {
        setSelectedDate(slotInfo.start);
        setSelectedEvent(null);
        setShowModal(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource);
        setShowModal(true);
    };

    const CustomEvent = ({ event }) => {
        const { paymentStatus, receiptIssued } = event.resource;
        return (
            <span>
                <strong>{format(event.start, 'HH:mm')}</strong> {event.title}
                {paymentStatus === 'paid' && <span title="שולם"> 💰</span>}
                {receiptIssued && <span title="הוצאה קבלה"> 🧾</span>}
            </span>
        )
    };

    const CustomDateHeader = ({ label, date }) => {
        let hebrewDate = '';
        try {
            hebrewDate = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'short' }).format(date);
        } catch (e) {
            console.error("Error formatting Hebrew date", e);
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 5px' }}>
                <span style={{ fontSize: '0.8em', color: '#666' }}>{hebrewDate}</span>
                <span>{label}</span>
            </div>
        );
    };

    return (
        <Container fluid className="mt-4" style={{ direction: 'rtl', textAlign: 'right' }}>
            <Row className="mb-3">
                <Col md={3}>
                    <h2>יומן אירועים</h2>
                </Col>
                <Col md={4}>
                    <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">כל הסטטוסים</option>
                        <option value="scheduled">מתוכנן (כחול)</option>
                        <option value="confirmed">מאושר (ירוק)</option>
                        <option value="completed">הושלם (אפור)</option>
                        <option value="cancelled">מבוטל (אדום)</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
                        <option value="">כל התשלומים</option>
                        <option value="unpaid">לא שולם</option>
                        <option value="partial">שולם חלקית</option>
                        <option value="paid">שולם 💰</option>
                    </Form.Select>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5"><Spinner animation="border" /></div>
            ) : (
                <div style={{ height: '70vh' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        view={view}
                        onView={setView}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            event: CustomEvent,
                            month: {
                                dateHeader: CustomDateHeader
                            }
                        }}
                    />
                </div>
            )}

            {/* Event Modal for Create/Update */}
            {showModal && (
                <EventModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    event={selectedEvent}
                    selectedDate={selectedDate}
                    onSave={() => {
                        setShowModal(false);
                        fetchEvents();
                    }}
                />
            )}
        </Container>
    );
};

export default MyCalendar;
