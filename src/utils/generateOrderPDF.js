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
  const rows = cartItems.map(({ product, qty }, idx) => {
    const price = parseFloat(product.price || 0);
    const sub   = price * qty;
    const unit  = product.order_unit || product.quantity || product.unit || '—';
    const bg    = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    return `
      <tr style="background:${bg};">
        <td style="padding:12px 14px;border-bottom:1.5px solid #cbd5e1;font-size:16px;color:#0f172a;text-align:center;font-weight:700;">${idx + 1}</td>
        <td style="padding:12px 14px;border-bottom:1.5px solid #cbd5e1;font-size:16px;color:#0f172a;font-family:'Noto Serif Tamil',sans-serif;font-weight:700;line-height:1.4;">${product.name}</td>
        <td style="padding:12px 14px;border-bottom:1.5px solid #cbd5e1;font-size:16px;color:#0f172a;text-align:center;font-weight:600;">${unit}</td>
        <td style="padding:12px 14px;border-bottom:1.5px solid #cbd5e1;font-size:16px;color:#0f172a;text-align:center;font-weight:800;">${qty}</td>
        <td style="padding:12px 14px;border-bottom:1.5px solid #cbd5e1;font-size:16px;color:#0f172a;text-align:right;font-weight:600;">${INR(price)}</td>
        <td style="padding:12px 14px;border-bottom:1.5px solid #cbd5e1;font-size:16px;color:#0f172a;font-weight:800;text-align:right;">${INR(sub)}</td>
      </tr>`;
  }).join('');

  const addrLine = orderForm.address
    ? `<p style="margin:8px 0 0 0;font-size:16px;color:#1e293b;"><strong>Address:</strong> ${orderForm.address}</p>` : '';

  const html = `
    <div id="pdf-receipt" style="
      width:900px;
      background:#fff;
      font-family:'Noto Sans',Arial,sans-serif;
      padding:0;
      box-sizing:border-box;
    ">
      <!-- Load Tamil font -->
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@400;600;700;800&family=Noto+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <!-- Header -->
      <div style="background:#ff7011;padding:28px 36px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:30px;font-weight:900;color:#fff;letter-spacing:1px;">SETHU PYRO PARK</div>
          <div style="font-size:18px;color:rgba(255,255,255,0.95);margin-top:4px;font-weight:700;">Rachika Crackers</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:20px;color:#fff;font-weight:900;">+91 8867390680</div>
          <div style="font-size:15px;color:rgba(255,255,255,0.95);margin-top:4px;font-weight:700;">Order Enquiry Sheet</div>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:32px 36px;">

        <!-- Title -->
        <div style="font-size:22px;font-weight:900;color:#0f172a;border-bottom:3.5px solid #ff7011;padding-bottom:10px;margin-bottom:24px;letter-spacing:0.5px;">
          ORDER ENQUIRY DETAILS
        </div>

        <!-- Customer Box -->
        <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;padding:22px 24px;margin-bottom:28px;">
          <div style="font-size:14px;font-weight:900;color:#475569;letter-spacing:1.2px;margin-bottom:12px;text-transform:uppercase;">CUSTOMER INFORMATION</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 28px;font-size:16px;color:#0f172a;">
            <p style="margin:2px 0;"><strong>Name:</strong> ${orderForm.name || '—'}</p>
            <p style="margin:2px 0;"><strong>Phone:</strong> ${orderForm.phone || '—'}</p>
            <p style="margin:2px 0;"><strong>Region:</strong> ${orderForm.isTamilNadu ? 'Tamil Nadu' : 'Other State'}</p>
            <p style="margin:2px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
          ${addrLine}
        </div>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          <thead>
            <tr style="background:#0f172a;">
              <th style="padding:14px;font-size:15px;color:#fff;text-align:center;width:40px;font-weight:800;">#</th>
              <th style="padding:14px;font-size:15px;color:#fff;text-align:left;font-weight:800;">Product Name</th>
              <th style="padding:14px;font-size:15px;color:#fff;text-align:center;width:110px;font-weight:800;">Unit</th>
              <th style="padding:14px;font-size:15px;color:#fff;text-align:center;width:70px;font-weight:800;">Qty</th>
              <th style="padding:14px;font-size:15px;color:#fff;text-align:right;width:130px;font-weight:800;">Price</th>
              <th style="padding:14px;font-size:15px;color:#fff;text-align:right;width:140px;font-weight:800;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <!-- Total -->
        <div style="display:flex;justify-content:flex-end;margin-bottom:28px;">
          <div style="background:#ff7011;border-radius:10px;padding:16px 32px;display:flex;gap:36px;align-items:center;box-shadow:0 4px 14px rgba(255,112,17,0.25);">
            <span style="font-size:19px;font-weight:800;color:#fff;">Total Payable:</span>
            <span style="font-size:22px;font-weight:900;color:#fff;">${INR(cartTotalPrice)}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top:2px solid #cbd5e1;padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:14px;color:#475569;font-weight:700;">Sethu Pyro Park - Rachika Crackers</span>
          <span style="font-size:13px;color:#64748b;font-weight:600;">Generated: ${new Date().toLocaleString('en-IN')}</span>
        </div>

      </div>
    </div>`;

  // ── 2. Mount the HTML off-screen ────────────────────────────────────────────
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
  container.innerHTML = html;
  document.body.appendChild(container);
  const el = container.querySelector('#pdf-receipt');

  // Wait a tick for fonts / layout render
  await new Promise(r => setTimeout(r, 450));

  // ── 3. Capture with html2canvas ─────────────────────────────────────────────
  const canvas = await html2canvas(el, {
    scale: 2,           // high resolution capture
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  document.body.removeChild(container);

  // ── 4. Slice Canvas into multi-page A4 PDF ────────────────────────────────
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF('p', 'mm', 'a4');

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Append remaining pages if content height exceeds single A4 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const cleanName  = (orderForm.name  || 'Customer').replace(/\s+/g, '_');
  const cleanPhone = (orderForm.phone || 'NoPhone').replace(/\s+/g, '_');
  pdf.save(`${cleanName}_${cleanPhone}.pdf`);
}
