import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { createTrick, updateTrick, deleteTrick } from '../api/trick';

const TrickModal = ({ show, onHide, trick, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        props: '',
        durationMinutes: '',
        level: 'mixed',
        status: 'idea',
        energyLevel: '',
        tags: '',
        notes: '',
        isActive: true
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (trick) {
            setFormData({
                ...trick,
                props: trick.props ? trick.props.join(', ') : '',
                tags: trick.tags ? trick.tags.join(', ') : ''
            });
        }
    }, [trick]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const dataToSubmit = { ...formData };
            // Convert comma-separated strings back to arrays
            dataToSubmit.props = dataToSubmit.props.split(',').map(s => s.trim()).filter(s => s);
            dataToSubmit.tags = dataToSubmit.tags.split(',').map(s => s.trim()).filter(s => s);

            if (trick?._id) {
                await updateTrick(trick._id, dataToSubmit);
            } else {
                await createTrick(dataToSubmit);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error saving trick');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק קסם זה?')) {
            try {
                setLoading(true);
                const res = await deleteTrick(trick._id);
                if (res.isSoftDeleted) {
                    alert(res.message); // Inform the user it was only soft-deleted
                }
                onSave();
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'שגיאה במחיקת קסם');
                setLoading(false);
            }
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" style={{ direction: 'rtl', textAlign: 'right' }}>
            <Modal.Header closeButton style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                <Modal.Title>{trick ? 'ערוך קסם' : 'צור קסם חדש'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Row className="mb-3">
                        <Col md={8}>
                            <Form.Group>
                                <Form.Label>כותרת (שם הקסם)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mt-4">
                                <Form.Check
                                    type="checkbox"
                                    label="קסם פעיל"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>קהל יעד (רמה)</Form.Label>
                                <Form.Select name="level" value={formData.level} onChange={handleChange}>
                                    <option value="adults">מבוגרים</option>
                                    <option value="kids">ילדים</option>
                                    <option value="kindergarten">גנים / פעוטות</option>
                                    <option value="mixed">מעורב</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>סטטוס הקסם</Form.Label>
                                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="ready">מוכן</option>
                                    <option value="planning">בתכנון</option>
                                    <option value="building">בבנייה</option>
                                    <option value="idea">רעיון</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>זמן (דקות)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="durationMinutes"
                                    value={formData.durationMinutes}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>רמת אנרגיה</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="5"
                                    name="energyLevel"
                                    value={formData.energyLevel}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>תיאור</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>אביזרי במה (מופרד בפסיקים)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="props"
                                    value={formData.props}
                                    onChange={handleChange}
                                    placeholder="כובע, שרביט, קלפים..."
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>תגיות (מופרד בפסיקים)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="אש, קלוז-אפ, סטנדאפ..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>הערות אישיות לביצוע</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <div>
                        {trick && (
                            <Button variant="danger" onClick={handleDelete} disabled={loading} className="me-2">
                                מחק
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

export default TrickModal;
