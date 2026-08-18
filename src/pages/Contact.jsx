import ContactImg1 from '../assets/websitelogo.png';
import ContactImg2 from '../assets/contact_img_2.jpeg';
import ContactImg3 from '../assets/contact_img_3.jpeg';
import ContactImg4 from '../assets/contact_img_4.png';
import ContactImg5 from '../assets/contact_img_5.png';
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
                    <p className="pt-3 smallfnt josefin" itemprop="streetAddress"> 1/235/1 SIVAGANAPURAM, Sivagnanapuram,<br />Virudhunagar - 626 002</p>
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
<iframe src="https://maps.google.com/maps?q=1/235/1+Sivaganapuram+Sivagnanapuram+Virudhunagar+626002&output=embed" width="100%" height="450" style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>



    <noscript><iframe src="https://www.googletagmanager.com/ns.html" height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe></noscript>



    </>
  );
};

export default Contact;
