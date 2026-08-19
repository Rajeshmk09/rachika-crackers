import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

import LogoImg from '../assets/websitelogo.png';
import WhatsappImg from '../assets/home_img_36.png';
import PricelistImg from '../assets/home_img_39.png';

export default function SiteFooter() {
  const location = useLocation();
  const { pricelistUrl } = useShop();

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const handleDownloadPricelist = (e) => {
    if (pricelistUrl && pricelistUrl.startsWith('data:')) {
      e.preventDefault();
      try {
        const parts = pricelistUrl.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const uInt8Array = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; ++i) uInt8Array[i] = raw.charCodeAt(i);
        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Sethu_Pyro_Park_Pricelist.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } catch (err) {
        window.open(pricelistUrl, '_blank');
      }
    }
  };

  return (
    <>
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12">
              <div className="acme heading4 pb-3 clr">Our Profile</div>
              <p className="josefin">We "SETHU PYRO PARK RACHIKA CRACKERS" acknowledged as the renowned super stockist &amp; wholesale supplier of an exclusive range of firecrackers. </p>
              <div className="acme heading4 pb-3 clr">Quick Links</div>
              <div className="tagcloud">
                <a href="/" className="josefin">Home</a>
                <a href="/about" className="josefin">About SETHU PYRO PARK RACHIKA CRACKERS</a>
                <a href="/products" className="josefin">Quick Purchase</a>
                <a href="/safetytips" className="josefin">Safetytips</a>
                <a href="/contact" className="josefin">Contact us</a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-12 text-center align-self-center">
              <a href="/">
                <img src={LogoImg} className="img-fluid w-100 mx-auto d-block" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
              </a>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <div className="acme heading4 pb-3 clr">Our Location</div>
              <li className="josefin pb-2" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <i className="bi bi-send-fill clr" style={{ marginTop: '2px' }}></i>
                <span className="smallfnt">
                  1/235/1 SIVAGANAPURAM, Sivagnanapuram,<br />Virudhunagar - 626 002
                </span>
              </li>
              <div className="acme py-2 heading5 clr">For Order</div>
              <li className="josefin pb-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-phone clr"></i>
                <span className="smallfnt">
                  <a href="tel:+918867390680" style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}>(+91) 8867390680</a>
                </span>
              </li>
              <li className="josefin pb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-envelope clr"></i>
                <span className="smallfnt">sethupyropark@gmail.com</span>
              </li>
            </div>
            <div className="col-12 my-3">&nbsp;</div>
            <div className="col-lg-12 text-center pt-4">
              <p className="smallfnt josefin pb-3">As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call. Please add and submit your enquiries and enjoy your Diwali with SETHU PYRO PARK RACHIKA CRACKERS. Our License No.----. SETHU PYRO PARK RACHIKA CRACKERS as a company following 100% legal &amp; statutory compliances and all our shops, go-downs are maintained as per the explosive acts. We send the parcels through registered and legal transport service providers as like every other major companies in Sivakasi is doing so.</p>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <div className="fixed point w0">
        <a href="https://api.whatsapp.com/send">
          <img src={WhatsappImg} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
        </a>
      </div>

      {/* Pricelist floating button */}
      <div className="fixed point2">
        <Link to="/products">
          <img src={PricelistImg} className="priceicn2 float-right blink" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
        </Link>
      </div>
    </>
  );
}
