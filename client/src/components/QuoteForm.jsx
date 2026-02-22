import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, BlobProvider, Link, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { sendQuoteEmail } from '../api/quote'; // We'll create this soon

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
      src: 'fonts/NotoSansHebrew-Bold.ttf',
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
          <Text style={[ pdfStyles.text, pdfStyles.label ]}>:עבור</Text>
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
          <Text style={pdfStyles.text}>{data.duration} שעות</Text>
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
      
      <View style={{ ...pdfStyles.section, borderBottom: 'none' }}>
        <Text style={pdfStyles.footer}>:צור קשר</Text>
        <Text style={{ ...pdfStyles.footer }}>052-7668659</Text>
        <Link src={`mailto:${contactEmail}`} style={{ ...pdfStyles.footer }}>{contactEmail}</Link>
      </View>
    </Page>
  </Document>
);

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    contactPerson: '',
    phone: '',
    email: '',
    activityType: 'מופע אש', // Default
    date: format(new Date(), 'yyyy-MM-dd'), // Default to today
    duration: 1,
    price: 0,
    notes: '',
  });

  const [pdfBlob, setPdfBlob] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

  // Simple price calculation logic
  useEffect(() => {
    const calculatePrice = () => {
      let baseRate = 0;
      switch (formData.activityType) {
        case 'מופע אש':
          baseRate = 500;
          break;
        case "סדנת ג'אגלינג":
          baseRate = 300;
          break;
        case 'מופע קסמים':
          baseRate = 400;
          break;
        default:
          baseRate = 0;
      }
      return baseRate * formData.duration;
    };
    // Only update if the user hasn't manually overridden the price
    // For now, let's keep it simple and always recalculate.
    // A more advanced version would have a separate "manual price" flag.
    setFormData((prev) => ({ ...prev, price: calculatePrice() }));
  }, [formData.activityType, formData.duration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePdf = () => {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  };

  const handleSendEmail = async () => {
    if (!pdfBlob) {
      alert('Please generate the PDF preview first.');
      return;
    }

    setSendingEmail(true);
    setEmailStatus('שולח אימייל...');
    try {
      const base64Pdf = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]); // Get base64 content
        };
      });

      const response = await sendQuoteEmail({
        to: formData.email,
        subject: `הצעת מחיר עבור ${formData.recipient}`,
        text: `שלום ${formData.contactPerson},

מצורפת הצעת מחיר עבור האירוע שלכם.

בברכה,
פיירמנטש`,
        html: `<p>שלום ${formData.contactPerson},</p><p>מצורפת הצעת מחיר עבור האירוע שלכם.</p><p>בברכה,</p><p>פיירמג'יק</p>`,
        attachments: [{
          filename: `הצעת_מחיר_${formData.recipient}.pdf`,
          content: base64Pdf,
          encoding: 'base64',
          contentType: 'application/pdf',
        }],
      });
      setEmailStatus(response.message || 'אימייל נשלח בהצלחה!');
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailStatus('שליחת אימייל נכשלה.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div style={{ direction: 'rtl', textAlign: 'right', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>מערכת ניהול הצעות מחיר</h1>

      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h2>פרטי הצעת מחיר</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
            <select id="activityType" name="activityType" value={formData.activityType} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option value="מופע אש">מופע אש</option>
              <option value="סדנת ג'אגלינג">סדנת ג'אגלינג</option>
              <option value="מופע קסמים">מופע קסמים</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>תאריך:</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="duration" style={{ display: 'block', marginBottom: '5px' }}>משך הסדנה (שעות):</label>
            <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} min="0.5" step="0.5"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>מחיר (₪):</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f0f0f0' }} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label htmlFor="notes" style={{ display: 'block', marginBottom: '5px' }}>הערות:</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="4"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
          <button onClick={handleGeneratePdf} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            הצג תצוגה מקדימה של PDF
          </button>
          <BlobProvider document={<QuotePdfDocument data={formData} />}>
            {({ blob, url, loading, error }) => {
              console.log('blob', blob)
              console.log('loading', loading)
              console.log('error', error)
              if (!loading && blob) {
                setPdfBlob(blob);
              }
              return (
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
              );
            }}
          </BlobProvider>
        </div>
        {emailStatus && <p style={{ textAlign: 'center', marginTop: '10px', color: sendingEmail ? 'blue' : (emailStatus.includes('נכשלה') ? 'red' : 'green') }}>{emailStatus}</p>}
      </div>

      {showPdfPreview && pdfBlob && (
        <div style={{ marginTop: '30px', border: '1px solid #eee', height: '600px' }}>
          <h2>תצוגה מקדימה של PDF</h2>
          <iframe src={URL.createObjectURL(pdfBlob)} style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none' }} title="PDF Preview"></iframe>
        </div>
      )}
    </div>
  );
};

export default QuoteForm;
