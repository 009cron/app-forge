import { forwardRef } from 'react';

interface ThermalReceiptProps {
  order: any;
}

const ThermalReceipt = forwardRef<HTMLDivElement, ThermalReceiptProps>(({ order }, ref) => {
  if (!order) return null;

  const date = new Date(order.created_at);

  return (
    <div ref={ref} className="thermal-receipt" style={{
      width: '58mm',
      fontFamily: 'monospace',
      fontSize: '12px',
      padding: '10px',
      backgroundColor: 'white'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>SUDUT KOPI</h2>
        <p style={{ margin: '2px 0', fontSize: '10px' }}>Jl. Kopi No. 123</p>
        <p style={{ margin: '2px 0', fontSize: '10px' }}>Tel: (021) 1234-5678</p>
      </div>

      <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '5px 0', marginBottom: '10px' }}>
        <p style={{ margin: '2px 0', fontSize: '10px' }}>Order: {order.order_number}</p>
        <p style={{ margin: '2px 0', fontSize: '10px' }}>Date: {date.toLocaleDateString()}</p>
        <p style={{ margin: '2px 0', fontSize: '10px' }}>Time: {date.toLocaleTimeString()}</p>
        <p style={{ margin: '2px 0', fontSize: '10px' }}>Type: {order.order_type}</p>
      </div>

      <table style={{ width: '100%', fontSize: '10px', marginBottom: '10px' }}>
        <thead>
          <tr style={{ borderBottom: '1px dashed #000' }}>
            <th style={{ textAlign: 'left', padding: '3px 0' }}>Item</th>
            <th style={{ textAlign: 'center', padding: '3px 0' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '3px 0' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item: any, idx: number) => (
            <tr key={idx}>
              <td style={{ padding: '3px 0' }}>{item.name}</td>
              <td style={{ textAlign: 'center', padding: '3px 0' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '3px 0' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #000', paddingTop: '5px', fontSize: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span>Subtotal:</span>
          <span>${Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span>Tax (11%):</span>
          <span>${Number(order.tax).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0', fontWeight: 'bold', fontSize: '12px', borderTop: '1px solid #000', paddingTop: '3px' }}>
          <span>TOTAL:</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed #000', paddingTop: '5px', marginTop: '5px', fontSize: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span>Payment:</span>
          <span className="capitalize">{order.payment_method?.replace('_', ' ')}</span>
        </div>
        {order.amount_paid && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
              <span>Paid:</span>
              <span>${order.amount_paid.toFixed(2)}</span>
            </div>
            {order.change > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
                <span>Change:</span>
                <span>${order.change.toFixed(2)}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '10px' }}>
        <p style={{ margin: '5px 0' }}>Thank you for your order!</p>
        <p style={{ margin: '5px 0' }}>Please come again</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px', borderTop: '1px dashed #000', paddingTop: '5px' }}>
        <p style={{ margin: 0, fontSize: '8px' }}>Powered by Sudut Kopi POS</p>
      </div>
    </div>
  );
});

ThermalReceipt.displayName = 'ThermalReceipt';

export default ThermalReceipt;
