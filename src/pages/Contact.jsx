import ContactImg1 from '../assets/websitelogo.png';
import ContactImg2 from '../assets/contact_img_2.jpeg';
import ContactImg3 from '../assets/contact_img_3.jpeg';
import ContactImg4 from '../assets/contact_img_4.png';
import ContactImg5 from '../assets/contact_img_5.png';
import ContactImg6 from '../assets/contact_img_6.png';
import ContactImg7 from '../assets/contact_img_7.png';
import React from 'react';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';

const Contact = () => {
  const { pricelistUrl } = useShop();

  const handleDownloadPricelist = (e) => {
    if (pricelistUrl && pricelistUrl.startsWith('data:')) {
      e.preventDefault();
      try {
        const parts = pricelistUrl.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
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
        console.error('Error generating PDF download:', err);
        window.open(pricelistUrl, '_blank');
      }
    }
  };
  return (
    <>
      
	

<img src={ContactImg3} className="img-fluid w-100" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />

<div className="container pad" itemscope="" itemtype="http://schema.org/LocalBusiness">
    <div className="row">
		<div className="col-lg-12 col-md-12 col-12">
			<h1 className="acme text-center bannerhead1 pb-lg-4 pb-2">Contact Now</h1>
		</div>
        <div className="col-lg-4 col-md-4 col-12">
            <div className="mb-4">
                <div className="contact-box-content" itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                    <div className="acme heading4"><i className="bi bi-globe icnfnt"></i> Address</div>
                    <p className="pt-3 smallfnt josefin" itemprop="streetAddress"> 9/296/1, Sri Anjaneya Nagar, Anupankulam,<br />Sivakasi - 626 189 </p>
                </div>
            </div>
        </div>
        <div className="col-lg-4 col-md-4 col-12">
            <div className="mb-4">
                <div className="contact-box-content">
                    <div className="acme heading4"><i className="bi bi-phone icnfnt"></i> Mobile</div>
                                                <div className="pt-3 smallfnt josefin" itemprop="telephone">
                                                    <a href="tel:+918867390680" style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}>+91 8867390680</a>
                                                </div>
                        					                                    </div>
            </div>
        </div>
        <div className="col-lg-4 col-md-4 col-12">
            <div className="mb-4">
                <div className="contact-box-content">
                                                <div className="acme heading4"><i className="bi bi-envelope icnfnt"></i> Email</div>
                            <p className="pt-3 smallfnt josefin" itemprop="email"><a href="cdn-cgi/l/email-protection.html" className="__cf_email__" data-cfemail="63101302110810170211001102000806111023040e020a0f4d000c0e">[email&nbsp;protected]</a></p>
                         
                    
                </div>
            </div>
        </div>
    </div>
</div>  
<iframe src="https://www.google.com/maps/embed" width="100%" height="400" style={{border: 0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>



    <div className="fixed point w0">
        <a href="https://api.whatsapp.com/send">
            <img src={ContactImg4} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
        </a>
    </div>
    <div className="fixed point1 w0 d-none d-lg-block">
        <span className="time-of-year">
            <img src={ContactImg5} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
            <div className="tooltip text-white text-center"> For More Details Call <br /> 
                <i className="bi bi-phone"></i> +91 8867390680             </div>
        </span>
    </div>
    <div className="fixed point1 w0 d-lg-none">
        <a href="tel:+918867390680">
            <img src={ContactImg6} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
        </a>
    </div>
<div className="fixed point2">
    <a href={pricelistUrl || "/products"} onClick={handleDownloadPricelist} target="_blank" rel="noopener noreferrer">
        <img src={ContactImg7} className="priceicn2 float-right blink" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
    </a>
</div>

<noscript><iframe src="https://www.googletagmanager.com/ns.html" height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe></noscript>



    </>
  );
};

export default Contact;
