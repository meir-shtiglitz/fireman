import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, BlobProvider, Link, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { sendQuoteEmail, createQuote, updateQuote, getQuoteById } from '../api/quote';
import { getEvents } from '../api/event';
import { useParams, useNavigate } from 'react-router-dom';
import EventModal from './EventModal';

// Register a font that supports Hebrew and RTL
// You might need to host this font or use a local path if it's bundled
// For simplicity, let's assume 'Assistant' is available or use a basic fallback
// In a real app, you'd import a font file (e.g., from Google Fonts) and register it.
// Example: Font.register({ family: 'Assistant', src: '/fonts/Assistant-Regular.ttf' });
// For now, I'll use a basic approach. If issues arise, font embedding is the next step.
// Let's use a common system font that might support Hebrew for now to avoid complexity.
// However, react-pdf often requires explicit font registration for non-latin characters.
// For now, I'll use a placeholder and add a comment for proper font handling.
Font.register({
  family: 'Noto Sans Hebrew',
  fonts: [
    {
      src: '/fonts/NotoSansHebrew-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/NotoSansHebrew-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});

// Styles for the PDF
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Noto Sans Hebrew', // Use the registered Hebrew font
    direction: 'rtl', // Set global direction to RTL
    textAlign: 'right', // Align text to the right
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    borderBottom: '1px solid #eeeeee',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555555',
    borderBottom: '1px solid #cccccc',
    paddingBottom: 5,
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  wrapLogo: {
    borderBottom: '1px solid #ddd',
    marginBottom: 15,
    paddingBottom: 10
  },
  logo: {
    width: 50, alignSelf: 'center'
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: '12px',
    marginLeft: 5, // Margin to separate label from value in RTL
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
    color: '#777777',
    lineHeight: 1.5,
  },
  row: {
    flexDirection: 'row-reverse', // Align items to the right for RTL
    justifyContent: 'flex-start', // Align items to the right for RTL
    marginBottom: 5,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-end', // Align text to the right within columns
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: '-2px',
    textAlign: 'left', // Price value should be LTR
  }
});

const contactEmail = 'm.stigel@gmail.com'

// PDF Document Component
const QuotePdfDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.wrapLogo}>
        <Image
          src="/logo192.png"
          style={pdfStyles.logo}
        />
      </View>
      <Text style={pdfStyles.header}>פיירמנטש - אמן האשליות</Text>
      <View style={[pdfStyles.row, pdfStyles.center]}>
        <Text style={pdfStyles.header}>טופס הזמנה</Text>
        <Text style={pdfStyles.header}> / </Text>
        <Text style={pdfStyles.header}>הצעת מחיר</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subheader}>פרטי לקוח</Text>
        <View style={pdfStyles.row}>
          <Text style={[pdfStyles.text, pdfStyles.label]}>:עבור</Text>
          <Text style={pdfStyles.text}>{data.recipient}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:איש קשר</Text>
          <Text style={pdfStyles.text}>{data.contactPerson}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:טלפון</Text>
          <Text style={pdfStyles.text}>{data.phone}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:אימייל</Text>
          <Text style={pdfStyles.text}>{data.email}</Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subheader}>פרטי השירות</Text>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:סוג ההפעלה</Text>
          <Text style={pdfStyles.text}>{data.activityType}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:תאריך</Text>
          <Text style={pdfStyles.text}>{data.date ? format(new Date(data.date), 'dd/MM/yyyy') : 'לא נבחר'}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:משך הסדנה</Text>
          <Text style={pdfStyles.text}>{data.duration}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:הערות</Text>
          <Text style={pdfStyles.text}>{data.notes}</Text>
        </View>
      </View>

      <View style={{ ...pdfStyles.section, borderBottom: 'none' }}>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:מחיר</Text>
          <Text style={{ ...pdfStyles.text, ...pdfStyles.price }}>{data.price} ₪</Text>
        </View>
      </View>

      {data.customFields && data.customFields.length > 0 && (
        <View style={{ ...pdfStyles.section, borderBottom: 'none' }}>
          <Text style={pdfStyles.subheader}>מידע נוסף</Text>
          {data.customFields.map((field, idx) => (
            <View style={pdfStyles.row} key={idx}>
              <Text style={{ ...pdfStyles.text, ...pdfStyles.label }}>:{field.label}</Text>
              <Text style={pdfStyles.text}>{field.value}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ ...pdfStyles.section, borderBottom: 'none' }}>
        <Text style={pdfStyles.footer}>:צור קשר</Text>
        <Text style={{ ...pdfStyles.footer }}>052-7668659</Text>
        <Link src={`mailto:${contactEmail}`} style={{ ...pdfStyles.footer }}>{contactEmail}</Link>
      </View>
    </Page>
  </Document>
);

const QuoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipient: '',
    contactPerson: '',
    phone: '',
    email: '',
    activityType: 'מופע אש', // Default
    date: format(new Date(), 'yyyy-MM-dd'), // Default to today
    duration: '45 - 60 דקות',
    price: 0,
    notes: '',
    customFields: []
  });

  const [pdfBlob, setPdfBlob] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [savingQuote, setSavingQuote] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [customSendEmail, setCustomSendEmail] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [linkedEvent, setLinkedEvent] = useState(null);

  useEffect(() => {
    if (id) {
      const loadQuote = async () => {
        try {
          const data = await getQuoteById(id);
          setFormData({
            ...data.customer,
            ...data.service,
            date: data.service.date ? format(new Date(data.service.date), 'yyyy-MM-dd') : '',
            price: data.price,
            customFields: data.customFields || [],
            _id: data._id,
            quoteNumber: data.quoteNumber
          });

          // Check for linked event
          const events = await getEvents({ quoteId: id });
          // Note: getEvents might not support quoteId filter directly yet in the backend
          // Let's rely on finding it manually if needed, or update backend later
          // Assuming backend getEvents can filter by quoteId if passed, though we didn't add it explicitly
          // Let's filter client side for safety if backend returns all or ignores quoteId param if not implemented
          const filtered = events.filter(e => e.quoteId === id || e.quoteId?._id === id);
          if (filtered.length > 0) {
            setLinkedEvent(filtered[0]);
          }

        } catch (error) {
          console.error("Failed to load quote", error);
        }
      }
      loadQuote();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (index, field, value) => {
    const newFields = [...formData.customFields];
    newFields[index][field] = value;
    setFormData({ ...formData, customFields: newFields });
  };

  const addCustomField = () => {
    setFormData({ ...formData, customFields: [...formData.customFields, { label: '', value: '' }] });
  };

  const removeCustomField = (index) => {
    const newFields = [...formData.customFields];
    newFields.splice(index, 1);
    setFormData({ ...formData, customFields: newFields });
  };

  const handleGeneratePdf = () => {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  };

  const getCleanQuoteData = () => {
    return {
      ...(formData._id ? { _id: formData._id } : {}),
      customer: {
        recipient: formData.recipient,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email
      },
      service: {
        activityType: formData.activityType,
        date: formData.date,
        duration: formData.duration,
        notes: formData.notes
      },
      price: formData.price,
      customFields: formData.customFields
    };
  };

  const handleSaveQuote = async () => {
    setSavingQuote(true);
    setEmailStatus('שומר הצעת מחיר...');
    try {
      const payload = getCleanQuoteData();
      let res;
      if (formData._id) {
        res = await updateQuote(formData._id, payload);
      } else {
        res = await createQuote(payload);
      }
      setEmailStatus('הצעת מחיר נשמרה בהצלחה!');

      if (!linkedEvent && window.confirm("האם למלא גם אירוע למחולל הפעילויות (Calendar)?")) {
        setShowEventModal(true);
      }

      if (!formData._id && res._id) {
        navigate(`/quotes/${res._id}`); // Redirect to edit mode
      }
    } catch (error) {
      setEmailStatus('שגיאה בשמירת הצעת מחיר.');
      console.error(error);
    } finally {
      setSavingQuote(false);
    }
  };

  const handleSendEmail = async () => {
    if (!pdfBlob) {
      alert('Please generate the PDF preview first.');
      return;
    }

    const emailToSend = customSendEmail || formData.email;
    if (!emailToSend) {
      alert('אנא הזן כתובת אימייל לשליחה.');
      return;
    }

    setSendingEmail(true);
    setEmailStatus(`שולח אימייל ל-${emailToSend}...`);
    try {
      const base64Pdf = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]); // Get base64 content
        };
      });

      const response = await sendQuoteEmail({
        to: emailToSend,
        subject: `הצעת מחיר עבור ${formData.recipient}`,
        text: `שלום ${formData.contactPerson},

מצורפת הצעת מחיר עבור האירוע שלכם.

בברכה,
פיירמנטש`,
        html: `<p>שלום ${formData.contactPerson},</p><p>מצורפת הצעת מחיר עבור האירוע שלכם.</p><p>בברכה,</p><p>פיירמנטש</p>`,
        attachments: [{
          filename: `הצעת_מחיר_${formData.recipient}.pdf`,
          content: base64Pdf,
          encoding: 'base64',
          contentType: 'application/pdf',
        }],
        quoteData: getCleanQuoteData() // Sends quote data to be saved on backend via email route 
      });
      setEmailStatus(response.message || 'אימייל נשלח בהצלחה!');

      if (!linkedEvent && window.confirm("האם למלא גם אירוע למחולל הפעילויות (Calendar)?")) {
        setShowEventModal(true);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailStatus('שליחת אימייל נכשלה.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div style={{ direction: 'rtl', textAlign: 'right', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button onClick={() => navigate('/quotes')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#007bff' }} title="חזור לרשימה">
          &rarr;
        </button>
        <h1 style={{ margin: 0 }}>מערכת ניהול הצעות מחיר</h1>
      </div>

      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h2>פרטי הצעת מחיר</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <label htmlFor="recipient" style={{ display: 'block', marginBottom: '5px' }}>עבור:</label>
            <input type="text" id="recipient" name="recipient" value={formData.recipient} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="contactPerson" style={{ display: 'block', marginBottom: '5px' }}>איש קשר:</label>
            <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>טלפון:</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>אימייל:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="activityType" style={{ display: 'block', marginBottom: '5px' }}>סוג ההפעלה:</label>
            <select id="activityType" name="activityType"
              value={["מופע קסמים", "הפעלת בועות סבון", "מופע אש"].includes(formData.activityType) ? formData.activityType : 'other'}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  handleChange({ target: { name: 'activityType', value: '' } });
                } else {
                  handleChange(e);
                }
              }}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: ["מופע קסמים", "הפעלת בועות סבון", "מופע אש"].includes(formData.activityType) ? '0' : '10px' }}>
              <option value="מופע קסמים">מופע קסמים</option>
              <option value="הפעלת בועות סבון">הפעלת בועות סבון</option>
              <option value="מופע אש">מופע אש</option>
              <option value="other">טקסט חופשי (אחר)</option>
            </select>
            {!["מופע קסמים", "הפעלת בועות סבון", "מופע אש"].includes(formData.activityType) && (
              <input type="text" name="activityType" value={formData.activityType} onChange={handleChange} placeholder="הקלד סוג הפעלה..."
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            )}
          </div>
          <div>
            <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>תאריך:</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="duration" style={{ display: 'block', marginBottom: '5px' }}>משך הסדנה:</label>
            <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} min="0.5" step="0.5"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>מחיר (₪):</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f0f0f0' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="notes" style={{ display: 'block', marginBottom: '5px' }}>הערות:</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="4"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}></textarea>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '15px' }}>
            <h3>שדות מותאמים אישית</h3>
            {formData.customFields.map((field, idx) => (
              <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input type="text" placeholder="שם השדה (לדוגמה: הערה למפיק)" value={field.label} onChange={(e) => handleCustomFieldChange(idx, 'label', e.target.value)} style={{ flex: '1 1 150px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <input type="text" placeholder="ערך" value={field.value} onChange={(e) => handleCustomFieldChange(idx, 'value', e.target.value)} style={{ flex: '2 1 200px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <button type="button" onClick={() => removeCustomField(idx)} style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
              </div>
            ))}
            <button type="button" onClick={addCustomField} style={{ padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              + הוסף שדה
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={handleSaveQuote} disabled={savingQuote} style={{ padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: '1 1 200px' }}>
            {savingQuote ? 'שומר...' : (formData._id ? 'עדכן הצעת מחיר' : 'שמור הצעת מחיר')}
          </button>
          <button onClick={handleGeneratePdf} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: '1 1 200px' }}>
            הצג תצוגה מקדימה של PDF
          </button>
          <BlobProvider document={<QuotePdfDocument data={formData} />}>
            {({ blob, url, loading, error }) => {
              if (!loading && blob) {
                setPdfBlob(blob);
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1 1 250px' }}>
                  <input type="email" placeholder="אימייל לשליחה (ריק = לקוח)" value={customSendEmail} onChange={(e) => setCustomSendEmail(e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'right', boxSizing: 'border-box', width: '100%' }} />
                  <button
                    onClick={handleSendEmail}
                    disabled={!blob || sendingEmail}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: blob && !sendingEmail ? '#28a745' : '#cccccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: blob && !sendingEmail ? 'pointer' : 'not-allowed'
                    }}>
                    {sendingEmail ? 'שולח...' : 'שלח PDF ללקוח'}
                  </button>
                </div>
              );
            }}
          </BlobProvider>
        </div>
        {emailStatus && <p style={{ textAlign: 'center', marginTop: '10px', color: sendingEmail ? 'blue' : (emailStatus.includes('נכשלה') ? 'red' : 'green') }}>{emailStatus}</p>}
        {linkedEvent && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button
              onClick={() => setShowEventModal(true)}
              style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              צפה באירוע מקושר ביומן
            </button>
          </div>
        )}
      </div>

      {showPdfPreview && pdfBlob && (
        <div style={{ marginTop: '30px', border: '1px solid #eee', height: '600px' }}>
          <h2>תצוגה מקדימה של PDF</h2>
          <iframe src={URL.createObjectURL(pdfBlob)} style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none' }} title="PDF Preview"></iframe>
        </div>
      )}

      {showEventModal && (
        <EventModal
          show={showEventModal}
          onHide={() => setShowEventModal(false)}
          event={linkedEvent || { // Pre-fill with quote data
            customer: {
              recipient: formData.recipient,
              contactPerson: formData.contactPerson,
              phone: formData.phone,
              email: formData.email
            },
            activityType: formData.activityType,
            eventDate: formData.date ? new Date(formData.date).toISOString().split('T')[0] : '', // format nicely
            duration: parseFloat(formData.duration) || 60,
            price: formData.price,
            notes: formData.notes,
            quoteId: formData._id || id  // Link them!
          }}
          onSave={() => {
            setShowEventModal(false);
            // fetch events again to update linkedEvent state if needed?
            // Window reload or simple state update
            getEvents().then(events => {
              const filtered = events.filter(e => e.quoteId === (formData._id || id) || e.quoteId?._id === (formData._id || id));
              if (filtered.length > 0) setLinkedEvent(filtered[0]);
            });
          }}
        />
      )}
    </div>
  );
};

export default QuoteForm;
