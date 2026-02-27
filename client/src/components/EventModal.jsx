import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { createEvent, updateEvent, deleteEvent } from '../api/event';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

const EventModal = ({ show, onHide, event, selectedDate, onSave }) => {
    const navigate = useNavigate();
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
    }, [event]);

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
            if (!dataToSubmit.quoteId) delete dataToSubmit.quoteId; // Remove empty string

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

    return (
        <Modal show={show} onHide={onHide} size="lg" style={{ direction: 'rtl', textAlign: 'right' }}>
            <Modal.Header closeButton style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                <Modal.Title>{event ? 'ערוך אירוע' : 'צור אירוע'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {error && <Alert variant="danger">{error}</Alert>}

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
                                    disabled // This is usually read-only or managed by the system
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
                            ביטול
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                            {loading ? 'שומר...' : 'שמור'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EventModal;
