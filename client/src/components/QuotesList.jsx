import React, { useState, useEffect } from 'react';
import { getQuotes, deleteQuote, duplicateQuote } from '../api/quote';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const QuotesList = () => {
    const [quotes, setQuotes] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleSort = (field) => {
        if (sortBy === field) {
            setOrder(order === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setOrder('desc');
        }
    };

    const renderSortIcon = (field) => {
        if (sortBy !== field) return <span style={{ color: '#ccc', marginRight: '5px' }}>↕</span>;
        return order === 'desc' ? <span style={{ marginRight: '5px' }}>↓</span> : <span style={{ marginRight: '5px' }}>↑</span>;
    };

    const thStyle = { padding: '12px', textAlign: 'right', cursor: 'pointer', userSelect: 'none' };

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const data = await getQuotes(search, sortBy, order);
            setQuotes(data);
        } catch (error) {
            console.error('Failed to fetch quotes', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, [search, sortBy, order]);

    const handleDelete = async (id) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק הצעת מחיר זו?')) {
            try {
                await deleteQuote(id);
                fetchQuotes(); // Refresh list
            } catch (error) {
                console.error('Failed to delete quote', error);
            }
        }
    };

    const handleDuplicate = async (id) => {
        try {
            const newQuote = await duplicateQuote(id);
            navigate(`/quotes/${newQuote._id}`); // Navigate to edit the new quote
        } catch (error) {
            console.error('Failed to duplicate quote', error);
            alert('שגיאה בשכפול הצעת מחיר');
        }
    };

    return (
        <div style={{ direction: 'rtl', textAlign: 'right', maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>רשימת הצעות מחיר</h1>
                <Link to="/quotes/new" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                    הצעת מחיר חדשה +
                </Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>חיפוש:</label>
                    <input
                        type="text"
                        placeholder="שם לקוח / אימייל / מס' הצעה..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>
            </div>

            {loading ? (
                <p>טוען...</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                                <th style={thStyle} onClick={() => handleSort('quoteNumber')}>מס' {renderSortIcon('quoteNumber')}</th>
                                <th style={thStyle} onClick={() => handleSort('customer.recipient')}>לכבוד {renderSortIcon('customer.recipient')}</th>
                                <th style={thStyle} onClick={() => handleSort('customer.contactPerson')}>איש קשר {renderSortIcon('customer.contactPerson')}</th>
                                <th style={thStyle} onClick={() => handleSort('service.activityType')}>פעילות {renderSortIcon('service.activityType')}</th>
                                <th style={thStyle} onClick={() => handleSort('service.date')}>תאריך פעילות {renderSortIcon('service.date')}</th>
                                <th style={thStyle} onClick={() => handleSort('price')}>מחיר {renderSortIcon('price')}</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((quote) => (
                                <tr key={quote._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px' }}>{quote.quoteNumber}</td>
                                    <td style={{ padding: '12px' }}>{quote.customer?.recipient}</td>
                                    <td style={{ padding: '12px' }}>{quote.customer?.contactPerson}</td>
                                    <td style={{ padding: '12px' }}>{quote.service?.activityType}</td>
                                    <td style={{ padding: '12px' }}>
                                        {quote.service?.date ? format(new Date(quote.service.date), 'dd/MM/yyyy') : '-'}
                                    </td>
                                    <td style={{ padding: '12px' }}>{quote.price} ₪</td>
                                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                        <Link to={`/quotes/${quote._id}`} style={{ padding: '5px 10px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '3px', fontSize: '12px' }}>ערוך</Link>
                                        <button onClick={() => handleDuplicate(quote._id)} style={{ padding: '5px 10px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>שכפל</button>
                                        <button onClick={() => handleDelete(quote._id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>מחק</button>
                                    </td>
                                </tr>
                            ))}
                            {quotes.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>לא נמצאו הצעות מחיר</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QuotesList;
