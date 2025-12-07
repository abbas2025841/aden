import React, { useState } from 'react';

export default function OutageTrackerSimple() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  
  const districts = [
    'كريتر', 'المعلا', 'التواهي', 'المنصورة', 'الشيخ عثمان', 
    'خور مكسر', 'دار سعد', 'البريقة', 'صيرة'
  ];

  const mockData = [
    { district: 'كريتر', status: 'لاصيه', count: 3 },
    { district: 'المعلا', status: 'طافيه', count: 5 },
    { district: 'التواهي', status: 'جزئية', count: 2 },
    { district: 'المنصورة', status: 'لاصيه', count: 1 },
    { district: 'خور مكسر', status: 'طافيه', count: 4 },
    { district: 'الشيخ عثمان', status: 'لاصيه', count: 2 },
    { district: 'دار سعد', status: 'غير معروف', count: 0 },
    { district: 'البريقة', status: 'لاصيه', count: 1 },
    { district: 'صيرة', status: 'طافيه', count: 3 }
  ];

  const filteredData = selectedDistrict 
    ? mockData.filter(item => item.district === selectedDistrict)
    : mockData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'لاصيه': return 'background: #dcfce7; color: #166534;';
      case 'طافيه': return 'background: #fef2f2; color: #dc2626;';
      case 'جزئية': return 'background: #fef3c7; color: #d97706;';
      default: return 'background: #f3f4f6; color: #6b7280;';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#1e40af', 
          margin: '0 0 10px 0',
          fontSize: '24px'
        }}>
          🔍 معرفة انقطاعات الكهرباء في منطقتك
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          تتبع حالة الكهرباء في مديريات عدن
        </p>
      </div>

      {/* Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        <div style={{ 
          background: '#dcfce7', 
          padding: '20px', 
          borderRadius: '12px', 
          textAlign: 'center',
          border: '2px solid #22c55e'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>
            {mockData.filter(d => d.status === 'لاصيه').length}
          </div>
          <div style={{ fontSize: '14px', color: '#166534' }}>لاصيه</div>
        </div>
        
        <div style={{ 
          background: '#fef2f2', 
          padding: '20px', 
          borderRadius: '12px', 
          textAlign: 'center',
          border: '2px solid #ef4444'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
            {mockData.filter(d => d.status === 'طافيه').length}
          </div>
          <div style={{ fontSize: '14px', color: '#dc2626' }}>طافيه</div>
        </div>
      </div>

      {/* Report Form */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1e40af' }}>
          📝 إبلاغ عن حالة الكهرباء
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            المديرية:
          </label>
          <select 
            value={selectedDistrict} 
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="">جميع المديريات</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => alert('تم إرسال البلاغ بنجاح!')}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          إرسال بلاغ
        </button>
      </div>

      {/* Districts Status */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1e40af' }}>
          🏘️ حالة المديريات
        </h3>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          {filteredData.map((item, index) => (
            <div 
              key={index}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {item.district}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  آخر تحديث: منذ {Math.floor(Math.random() * 60)} دقيقة
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div 
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '14px',
                    fontWeight: 'bold',
                    ...(getStatusColor(item.status) as any)
                  }}
                >
                  {item.status}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {item.count} تأكيد
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        color: '#6b7280',
        fontSize: '14px'
      }}>
        آخر تحديث: {new Date().toLocaleString('ar-SA')}
      </div>
    </div>
  );
}
