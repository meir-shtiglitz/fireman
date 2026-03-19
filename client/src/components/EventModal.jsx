import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Tabs, Tab, Table, Badge } from 'react-bootstrap';
import { createEvent, updateEvent, deleteEvent } from '../api/event';
import { getTricks } from '../api/trick';
import { attachTrickToEvent, getEventTricks, updateEventTrick, removeTrickFromEvent, batchReorderTricks } from '../api/eventTrick';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

const EventModal = ({ show, onHide, event, selectedDate, onSave }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');

    const [formData, setFormData] = useState({
        activityType: '',
        eventDate: selectedDate ? new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '', // YYYY-MM-DD
        eventTime: '',
        duration: '',
        price: '',
        address: '',
        notes: '',
        status: 'scheduled',
        paymentStatus: 'unpaid',
        receiptIssued: false,
        amountPaid: '',
        customer: {
            recipient: '',
            contactPerson: '',
            phone: '',
            email: ''
        },
        childrenCount: '',
        childrenAges: '',
        reminder: {
            enabled: true,
            sendBeforeHours: 24,
            sent: false
        },
        quoteId: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Tricks Tab State
    const [allTricks, setAllTricks] = useState([]);
    const [eventTricks, setEventTricks] = useState([]);
    const [selectedTrickToAdd, setSelectedTrickToAdd] = useState('');
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);

    useEffect(() => {
        if (event) {
            setFormData({
                ...event,
                eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
                customer: event.customer || { recipient: '', contactPerson: '', phone: '', email: '' },
                reminder: event.reminder || { enabled: true, sendBeforeHours: 24, sent: false },
                quoteId: event.quoteId ? event.quoteId._id || event.quoteId : '' // Handle populated quoteId
            });
        }
        if (show && event?._id) {
            fetchTricksData();
        } else {
            setEventTricks([]);
            setAllTricks([]);
        }
    }, [event, show]);

    const fetchTricksData = async () => {
        try {
            const [tricksRes, eventTricksRes] = await Promise.all([
                getTricks({ isActive: true }),
                getEventTricks(event._id)
            ]);
            setAllTricks(tricksRes);
            setEventTricks(eventTricksRes);
        } catch (err) {
            console.error("Error fetching tricks data", err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.quoteId) delete dataToSubmit.quoteId;

            if (event?._id) {
                await updateEvent(event._id, dataToSubmit);
            } else {
                await createEvent(dataToSubmit);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error saving event');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק אירוע זה?')) {
            try {
                setLoading(true);
                await deleteEvent(event._id);
                onSave();
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'שגיאה במחיקת אירוע');
                setLoading(false);
            }
        }
    };

    const handleViewQuote = () => {
        if (formData.quoteId) {
            navigate(`/quotes/${formData.quoteId}`);
        }
    };

    /* --- Tricks Functions --- */
    const handleAddTrick = async () => {
        if (!selectedTrickToAdd || !event?._id) return;
        try {
            setLoading(true);
            await attachTrickToEvent({
                eventId: event._id,
                trickId: selectedTrickToAdd,
                order: eventTricks.length
            });
            setSelectedTrickToAdd('');
            await fetchTricksData();
        } catch (err) {
            console.error("Error adding trick", err);
            setError("שגיאה בהוספת קסם לאירוע");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTrick = async (eventTrickId) => {
        try {
            setLoading(true);
            await removeTrickFromEvent(eventTrickId);
            await fetchTricksData();
        } catch (err) {
            console.error("Error removing trick", err);
            setError("שגיאה במחיקת קסם מאירוע");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEventTrick = async (eventTrickId, field, value) => {
        try {
            // Optimistic UI update
            setEventTricks(prev => prev.map(t => t._id === eventTrickId ? { ...t, [field]: value } : t));
            await updateEventTrick(eventTrickId, { [field]: value });
        } catch (err) {
            console.error("Error updating trick", err);
            // Revert on error by refetching
            fetchTricksData();
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // HTML5 drag and drop hack for Firefox
        if (e.dataTransfer.setData) {
            e.dataTransfer.setData('text/html', e.target.parentNode);
        }
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;

        const items = [...eventTricks];
        const draggedItem = items[draggedItemIndex];
        items.splice(draggedItemIndex, 1);
        items.splice(index, 0, draggedItem);

        setDraggedItemIndex(index);
        setEventTricks(items);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        if (draggedItemIndex === null) return;
        try {
            const orderPayload = eventTricks.map((item, index) => ({
                _id: item._id,
                order: index
            }));
            await batchReorderTricks(orderPayload);
        } catch (err) {
            console.error("Error reordering tricks", err);
            setError("שגיאה בשינוי סדר קסמים");
            fetchTricksData(); // Revert on error
        }
        setDraggedItemIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    const totalPlannedDuration = eventTricks.reduce((sum, item) => sum + (item.trickId?.durationMinutes || 0), 0);
    const totalActualDuration = eventTricks.reduce((sum, item) => sum + (item.actualDurationMinutes || 0), 0);

    return (
        <Modal show={show} onHide={onHide} size="lg" style={{ direction: 'rtl', textAlign: 'right' }}>
            <Modal.Header closeButton style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                <Modal.Title>{event ? 'ערוך אירוע' : 'צור אירוע'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body style={{ minHeight: '50vh', maxHeight: '70vh', overflowY: 'auto' }}>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" dir="rtl">
                        <Tab eventKey="details" title="פרטי אירוע">
                            <div className="pt-3">
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>סוג הפעלה</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="activityType"
                                                value={formData.activityType || ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>שם המזמין</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="customer.recipient"
                                                value={formData.customer?.recipient || ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>איש קשר</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="customer.contactPerson"
                                                value={formData.customer?.contactPerson || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>מספר טלפון</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="customer.phone"
                                                value={formData.customer?.phone || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>כתובת אימייל</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="customer.email"
                                                value={formData.customer?.email || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>כתובת הפעילות</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                value={formData.address || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>תאריך</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="eventDate"
                                                value={formData.eventDate || ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>שעה</Form.Label>
                                            <Form.Control
                                                type="time"
                                                name="eventTime"
                                                value={formData.eventTime || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>משך זמן (דקות)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="duration"
                                                value={formData.duration || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>סטטוס</Form.Label>
                                            <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                                <option value="scheduled">מתוכנן</option>
                                                <option value="confirmed">מאושר</option>
                                                <option value="completed">הושלם</option>
                                                <option value="cancelled">מבוטל</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>מחיר</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={formData.price || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>סכום ששולם</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="amountPaid"
                                                value={formData.amountPaid || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>סטטוס תשלום</Form.Label>
                                            <Form.Select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                                                <option value="unpaid">לא שולם</option>
                                                <option value="partial">שולם חלקית</option>
                                                <option value="paid">שולם</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mt-4">
                                            <Form.Check
                                                type="checkbox"
                                                label="הוצאה קבלה"
                                                name="receiptIssued"
                                                checked={formData.receiptIssued}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>כמות ילדים</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="childrenCount"
                                                value={formData.childrenCount || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={8}>
                                        <Form.Group>
                                            <Form.Label>גילאי הילדים</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="childrenAges"
                                                value={formData.childrenAges || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr />
                                <h6 className="mb-3">הגדרות תזכורות</h6>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Check
                                                type="checkbox"
                                                label="אפשר תזכורת במייל"
                                                name="reminder.enabled"
                                                checked={formData.reminder?.enabled}
                                                onChange={handleChange}
                                                disabled={formData.status === 'cancelled'}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>זמן התראה מראש (שעות)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="reminder.sendBeforeHours"
                                                value={formData.reminder?.sendBeforeHours || 24}
                                                onChange={handleChange}
                                                disabled={!formData.reminder?.enabled}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mt-4">
                                            <Form.Check
                                                type="checkbox"
                                                label="תזכורת נשלחה"
                                                name="reminder.sent"
                                                checked={formData.reminder?.sent}
                                                onChange={handleChange}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>הערות</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="notes"
                                        value={formData.notes || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>
                        </Tab>

                        <Tab eventKey="tricks" title="קסמים (בניית מופע)" disabled={!event?._id}>
                            <div className="pt-3">
                                {!event?._id && (
                                    <Alert variant="warning">יש לשמור את האירוע לפני הוספת קסמים.</Alert>
                                )}
                                {event?._id && (
                                    <>
                                        {/* Summaries Header */}
                                        <div className="d-flex justify-content-between mb-4 bg-light p-3 rounded">
                                            <div>
                                                <strong>סה"כ זמן מתוכנן:</strong>{" "}
                                                <Badge bg="info" className="ms-2 fs-6">{totalPlannedDuration} דק'</Badge>
                                            </div>
                                            <div>
                                                <strong>סה"כ זמן בפועל:</strong>{" "}
                                                <Badge bg="success" className="ms-2 fs-6">{totalActualDuration} דק'</Badge>
                                            </div>
                                        </div>

                                        {/* Add Trick Section */}
                                        <Row className="mb-4 align-items-end">
                                            <Col md={8}>
                                                <Form.Group>
                                                    <Form.Label>הוסף קסם לרשימה</Form.Label>
                                                    <Form.Select
                                                        value={selectedTrickToAdd}
                                                        onChange={(e) => setSelectedTrickToAdd(e.target.value)}
                                                    >
                                                        <option value="">בחר קסם...</option>
                                                        {allTricks.map(trick => (
                                                            <option key={trick._id} value={trick._id}>
                                                                {trick.title} ({trick.durationMinutes} דק') - רמה: {trick.level}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4} className="text-start">
                                                <Button
                                                    variant="primary"
                                                    disabled={!selectedTrickToAdd || loading}
                                                    onClick={handleAddTrick}
                                                >
                                                    הוסף לאירוע
                                                </Button>
                                            </Col>
                                        </Row>

                                        {/* Tricks Table */}
                                        <Table bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>סדר</th>
                                                    <th>שם קסם</th>
                                                    <th>זמן מתוכנן</th>
                                                    <th>זמן בפועל</th>
                                                    <th>בוצע?</th>
                                                    <th className="w-25">הערות לביצוע</th>
                                                    <th>פעולות</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {eventTricks.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="text-center">לא נוספו קסמים לאירוע זה.</td>
                                                    </tr>
                                                ) : (
                                                    eventTricks.map((item, index) => (
                                                        <tr
                                                            key={item._id}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, index)}
                                                            onDragOver={(e) => handleDragOver(e, index)}
                                                            onDrop={handleDrop}
                                                            onDragEnd={handleDragEnd}
                                                            style={{
                                                                cursor: 'grab',
                                                                opacity: draggedItemIndex === index ? 0.5 : 1,
                                                                backgroundColor: item.performed ? '#f0fff0' : 'white'
                                                            }}
                                                        >
                                                            <td className="align-middle text-center">
                                                                <span style={{ cursor: 'grab', fontSize: '1.2rem', color: '#888' }} title="גרור כדי לשנות סדר">
                                                                    ☰
                                                                </span>
                                                            </td>
                                                            <td className="align-middle">
                                                                <strong>{item.trickId?.title || 'קסם שנמחק'}</strong>
                                                            </td>
                                                            <td className="align-middle">
                                                                {item.trickId?.durationMinutes || 0}
                                                            </td>
                                                            <td className="align-middle">
                                                                <Form.Control
                                                                    type="number"
                                                                    size="sm"
                                                                    value={item.actualDurationMinutes || ''}
                                                                    onChange={(e) => handleUpdateEventTrick(item._id, 'actualDurationMinutes', Number(e.target.value))}
                                                                    style={{ width: '70px' }}
                                                                />
                                                            </td>
                                                            <td className="align-middle text-center">
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    checked={item.performed}
                                                                    onChange={(e) => handleUpdateEventTrick(item._id, 'performed', e.target.checked)}
                                                                />
                                                            </td>
                                                            <td className="align-middle">
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={1}
                                                                    size="sm"
                                                                    value={item.notes || ''}
                                                                    placeholder="הערות אירוע..."
                                                                    onChange={(e) => handleUpdateEventTrick(item._id, 'notes', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="align-middle text-center">
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveTrick(item._id)}
                                                                >
                                                                    הסר
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <div>
                        {event && (
                            <Button variant="danger" onClick={handleDelete} disabled={loading} className="me-2">
                                מחק
                            </Button>
                        )}
                        {formData.quoteId && (
                            <Button variant="info" onClick={handleViewQuote} disabled={loading} style={{ marginRight: '10px' }}>
                                צפה בהצעת המחיר
                            </Button>
                        )}
                    </div>
                    <div>
                        <Button variant="secondary" onClick={onHide} className="me-2 text-white">
                            סגור
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                            {loading ? 'שומר משימות ניהוליות...' : 'שמור אירוע'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EventModal;
