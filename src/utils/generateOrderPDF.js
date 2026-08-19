/**
 * generateOrderPDF
 * Renders the order details into an off-screen HTML element using the browser
 * (which natively supports Tamil / any Unicode font via the Noto Serif Tamil
 * Google Font), captures it with html2canvas, and then embeds the canvas image
 * into a jsPDF document.  This approach fully supports Tamil characters.
 */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const INR = (n) => `Rs. ${parseFloat(n).toLocaleString('en-IN')}`;

export async function generateOrderPDF({ orderForm, cartItems, cartTotalPrice }) {
  // ── 1. Build the HTML template ─────────────────────────────────────────────
  const rows = cartItems.map(({ product, qty }, idx) => {
    const price = parseFloat(product.price || 0);
    const sub   = price * qty;
    const unit  = product.order_unit || product.quantity || product.unit || '—';
    const bg    = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    return `
      <tr style="background:${bg};">
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;">${idx + 1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;font-family:'Noto Serif Tamil',serif;">${product.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;text-align:center;">${unit}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;text-align:center;">${qty}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;text-align:right;">${INR(price)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;font-weight:700;text-align:right;">${INR(sub)}</td>
      </tr>`;
  }).join('');

  const addrLine = orderForm.address
    ? `<p style="margin:4px 0;font-size:11px;">Address: ${orderForm.address}</p>` : '';

  const html = `
    <div id="pdf-receipt" style="
      width:794px;
      background:#fff;
      font-family:'Noto Sans',Arial,sans-serif;
      padding:0;
      box-sizing:border-box;
    ">
      <!-- Load Tamil font -->
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil&family=Noto+Sans&display=swap" rel="stylesheet" />

      <!-- Header -->
      <div style="background:#ff7011;padding:18px 24px 14px;display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:1px;">SETHU PYRO PARK</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:3px;">Rachika Crackers</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px;color:#fff;font-weight:700;">+91 8867390680</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.85);margin-top:2px;">Order Enquiry</div>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:20px 24px;">

        <!-- Title -->
        <div style="font-size:15px;font-weight:800;color:#0f172a;border-bottom:2.5px solid #ff7011;padding-bottom:6px;margin-bottom:16px;">
          ORDER ENQUIRY DETAILS
        </div>

        <!-- Customer Box -->
        <div style="background:#f8fafc;border-radius:6px;padding:14px 16px;margin-bottom:18px;">
          <div style="font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.8px;margin-bottom:8px;">CUSTOMER DETAILS</div>
          <p style="margin:4px 0;font-size:12px;color:#0f172a;">Name:&nbsp;&nbsp;&nbsp; ${orderForm.name}</p>
          <p style="margin:4px 0;font-size:12px;color:#0f172a;">Phone:&nbsp;&nbsp; ${orderForm.phone}</p>
          <p style="margin:4px 0;font-size:12px;color:#0f172a;">Region:&nbsp; ${orderForm.isTamilNadu ? 'Tamil Nadu' : 'Other State'}</p>
          ${addrLine}
        </div>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <thead>
            <tr style="background:#0f172a;">
              <th style="padding:8px;font-size:11px;color:#fff;text-align:left;width:28px;">#</th>
              <th style="padding:8px;font-size:11px;color:#fff;text-align:left;">Product</th>
              <th style="padding:8px;font-size:11px;color:#fff;text-align:center;width:80px;">Unit</th>
              <th style="padding:8px;font-size:11px;color:#fff;text-align:center;width:50px;">Qty</th>
              <th style="padding:8px;font-size:11px;color:#fff;text-align:right;width:90px;">Price</th>
              <th style="padding:8px;font-size:11px;color:#fff;text-align:right;width:90px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <!-- Total -->
        <div style="display:flex;justify-content:flex-end;margin-bottom:20px;">
          <div style="background:#ff7011;border-radius:6px;padding:10px 20px;display:flex;gap:24px;align-items:center;">
            <span style="font-size:13px;font-weight:700;color:#fff;">Total Payable:</span>
            <span style="font-size:14px;font-weight:900;color:#fff;">${INR(cartTotalPrice)}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid #e2e8f0;padding-top:10px;text-align:right;">
          <span style="font-size:10px;color:#94a3b8;">Generated: ${new Date().toLocaleString('en-IN')}</span>
        </div>

      </div>
    </div>`;

  // ── 2. Mount the HTML off-screen ────────────────────────────────────────────
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
  container.innerHTML = html;
  document.body.appendChild(container);
  const el = container.querySelector('#pdf-receipt');

  // Wait a tick for fonts / layout
  await new Promise(r => setTimeout(r, 400));

  // ── 3. Capture with html2canvas ─────────────────────────────────────────────
  const canvas = await html2canvas(el, {
    scale: 2,           // high-res
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  document.body.removeChild(container);

  // ── 4. Insert canvas image into jsPDF ──────────────────────────────────────
  const imgData = canvas.toDataURL('image/png');
  const pdfW    = 210;  // A4 width in mm
  const pdfH    = Math.round((canvas.height / canvas.width) * pdfW);

  const doc = new jsPDF({ unit: 'mm', format: [pdfW, pdfH > 297 ? pdfH : 297] });
  doc.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);

  const cleanName  = (orderForm.name  || 'Customer').replace(/\s+/g, '_');
  const cleanPhone = (orderForm.phone || 'NoPhone').replace(/\s+/g, '_');
  doc.save(`${cleanName}_${cleanPhone}.pdf`);
}
