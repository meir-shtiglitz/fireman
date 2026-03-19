import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Spinner, Form } from 'react-bootstrap';
import { getTricks } from '../api/trick';
import TrickModal from './TrickModal';

const TricksList = () => {
    const [tricks, setTricks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrick, setSelectedTrick] = useState(null);

    // Filters
    const [levelFilter, setLevelFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState('true');

    useEffect(() => {
        fetchTricks();
    }, [levelFilter, statusFilter, activeFilter]);

    const fetchTricks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (levelFilter) params.level = levelFilter;
            if (statusFilter) params.status = statusFilter;
            if (activeFilter !== '') params.isActive = activeFilter;

            const fetchedTricks = await getTricks(params);
            setTricks(fetchedTricks);
        } catch (error) {
            console.error('Failed to fetch tricks', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedTrick(null);
        setShowModal(true);
    };

    const handleEdit = (trick) => {
        setSelectedTrick(trick);
        setShowModal(true);
    };

    const translateLevel = (level) => {
        const map = {
            adults: 'מבוגרים',
            kids: 'ילדים',
            kindergarten: 'גנים / פעוטות',
            mixed: 'מעורב'
        };
        return map[level] || level;
    };

    const translateStatus = (status) => {
        const map = {
            ready: 'מוכן',
            planning: 'בתכנון',
            building: 'בבנייה',
            idea: 'רעיון בלבד'
        };
        return map[status] || status;
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'ready': return 'success';
            case 'planning': return 'warning';
            case 'building': return 'info';
            case 'idea': return 'secondary';
            default: return 'primary';
        }
    };

    return (
        <Container fluid className="mt-4" style={{ direction: 'rtl', textAlign: 'right' }}>
            <Row className="mb-4 align-items-center">
                <Col md={3}>
                    <h2>ניהול קסמים</h2>
                </Col>
                <Col md={2}>
                    <Form.Select value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
                        <option value="">כל הקסמים</option>
                        <option value="true">פעילים בלבד</option>
                        <option value="false">לא פעילים (בארכיון)</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
                        <option value="">כל הקהלים</option>
                        <option value="adults">מבוגרים</option>
                        <option value="kids">ילדים</option>
                        <option value="kindergarten">גנים</option>
                        <option value="mixed">מעורב</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">כל הסטטוסים</option>
                        <option value="ready">מוכן</option>
                        <option value="planning">בתכנון</option>
                        <option value="building">בבנייה</option>
                        <option value="idea">רעיון</option>
                    </Form.Select>
                </Col>
                <Col md={3} className="text-start">
                    <Button variant="primary" onClick={handleCreate}>+ הוסף קסם חדש</Button>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5"><Spinner animation="border" /></div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>כותרת</th>
                            <th>קהל יעד</th>
                            <th>משך הזמן (דקות)</th>
                            <th>רמת אנרגיה (1-5)</th>
                            <th>סטטוס</th>
                            <th>פעיל</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tricks.length > 0 ? tricks.map(trick => (
                            <tr key={trick._id} style={{ opacity: trick.isActive ? 1 : 0.6 }}>
                                <td>{trick.title}</td>
                                <td>{translateLevel(trick.level)}</td>
                                <td>{trick.durationMinutes}</td>
                                <td>{trick.energyLevel}</td>
                                <td>
                                    <Badge bg={getStatusVariant(trick.status)}>
                                        {translateStatus(trick.status)}
                                    </Badge>
                                </td>
                                <td>{trick.isActive ? 'כן' : 'לא'}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(trick)}>
                                        ערוך
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center">לא נמצאו קסמים</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {showModal && (
                <TrickModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    trick={selectedTrick}
                    onSave={() => {
                        setShowModal(false);
                        fetchTricks();
                    }}
                />
            )}
        </Container>
    );
};

export default TricksList;
