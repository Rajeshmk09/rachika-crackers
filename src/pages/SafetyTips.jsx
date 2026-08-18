import SafetyTipsImg1 from '../assets/websitelogo.png';
import SafetyTipsImg2 from '../assets/safetytips_img_2.jpeg';
import SafetyTipsImg3 from '../assets/safetytips_img_3.webp';
import SafetyTipsImg4 from '../assets/safetytips_img_4.png';
import SafetyTipsImg5 from '../assets/safetytips_img_5.png';
import SafetyTipsImg6 from '../assets/safetytips_img_6.png';
import SafetyTipsImg7 from '../assets/safetytips_img_7.png';
import React from 'react';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';

const SafetyTips = () => {
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
      
	

<div className="safetytipsbg">
	<div className="container pad">
		<div className="row">
			<div className="col-lg-12 col-md-12 col-12 py-5">
				<h1 className="acme text-center text-white">Safety Tips</h1>
			</div>
		</div>
	</div>
</div>
<div className="container pad">
	<div className="row">
		<div className="col-lg-12 col-md-12 col-12 pb-lg-5 pb-3">
			<h1 className="acme clr">SETHU PYRO PARK RACHIKA CRACKERS</h1>
			<p className="josefin">There are certain Do's &amp; Don’ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to 
				follow the precautions while bursting crackers. A little negligence, ignorance and carelessness can cause a fatal injury.</p>
		</div>
		<div className="col-lg-6 col-md-12 col-12">
			<h1 className="block-head acme font">Do's</h1>
			<li className="pt-4"><p><i className="bi bi-check icnclr1"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Instructions</h1>
					<p className="josefin">Display fireworks as per the instructions mentioned on the pack.</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-check icnclr1"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Outdoor</h1>
					<p className="josefin">Use fireworks only outdoor</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-check icnclr1"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Branded Fireworks</h1>
					<p className="josefin">Buy fireworks from authorized / reputed manufacturers only.</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-check icnclr1"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Distance</h1>
					<p className="josefin">Light only one firework at a time, by one person. Others should watch from a safe distance.</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-check icnclr1"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Supervision</h1>
					<p className="josefin">Always have adult supervision</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-check icnclr1"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Water</h1>
					<p className="josefin">Keep two buckets of water handy. In the event of fire or any mishap.</p>
				</div>
			</li>
		</div>
		<div className="col-lg-6 col-md-12 col-12">
			<h1 className="block-head acme font">Don'ts</h1>
			<li className="pt-4"><p><i className="bi bi-x icnclr2"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Don't make tricks</h1>
					<p className="josefin">Never make your own fireworks.</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-x icnclr2"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Don't relight</h1>
					<p className="josefin">Never try to re-light or pick up fireworks that have not ignited fully.</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-x icnclr2"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Don't carry it</h1>
					<p className="josefin">Never carry fireworks in your pockets</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-x icnclr2"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Don't Touch it</h1>
					<p className="josefin">After fireworks display never pick up fireworks that may be left over, they still may be active.</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-x icnclr2"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Do not use Glass / Metal</h1>
					<p className="josefin">Never shoot fireworks in a metal or glass containers.</p>
				</div>
			</li>
			<li className="pt-3"><p><i className="bi bi-x icnclr2"></i></p>
				<div className="text4">
					<h1 className="acme heading4">Don't wear loose clothes</h1>
					<p className="josefin">Do not wear loose clothing while using fireworks.</p>
				</div>
			</li>
		</div>
	</div>
</div>
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
					<a href="." className="josefin">Safetytips</a>
					<a href="/contact" className="josefin">Contact us</a>
				</div>
			</div>
            <div className="col-lg-4 col-md-6 col-12 text-center align-self-center">
                <a href="/">
                    <img src={SafetyTipsImg3} className="img-fluid w-100 mx-auto d-block" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
                </a>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
                <div className="acme heading4 pb-3 clr">Our Location</div>
                <li className="josefin pb-2"><p><i className="bi bi-send-fill clr"></i>  </p>
					<div className="text1 smallfnt">
						9/296/1, Sri Anjaneya Nagar, Anupankulam,<br />Sivakasi - 626 189 
					</div>
				</li>
				<div className="acme py-2 heading5 clr">For Order</div>
									<li className="josefin pb-2"><p><i className="bi bi-phone clr"></i>   </p>
						<div className="text1 smallfnt">
							<a href="tel:+918867390680" style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}>(+91) 8867390680</a>
						</div>
					</li>
																							<li className="josefin pb-3"><p><i className="bi bi-envelope clr"></i>   </p>
							<div className="text1 smallfnt">
								<a href="cdn-cgi/l/email-protection.html" className="__cf_email__" data-cfemail="51222130233a22253023322330323a34232211363c30383d7f323e3c">[email&nbsp;protected]</a>							</div>
						</li>
									
            </div>
			<div className="col-12 my-3">&nbsp;</div>
						<div className="col-lg-12 text-center pt-4">
				<p className="smallfnt josefin pb-3">As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call. Please add and submit your enquiries and enjoy your Diwali with SETHU PYRO PARK RACHIKA CRACKERS. Our License No.----. SETHU PYRO PARK RACHIKA CRACKERS as a company following 100% legal &amp; statutory compliances and all our shops, go-downs are maintained as per the explosive acts. We send the parcels through registered and legal transport service providers as like every other major companies in Sivakasi is doing so.</p>	
			</div>
					{/* ... (end of existing code) ... */}</div>
    </div>
</div>

					<div className="fixed point w0">
				<a href="https://api.whatsapp.com/send">
					<img src={SafetyTipsImg4} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
				</a>
			</div>
							<div className="fixed point1 w0 d-none d-lg-block">
				<span className="time-of-year">
					<img src={SafetyTipsImg5} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
					<div className="tooltip text-white text-center"> For More Details Call <br /> 
						<i className="bi bi-phone"></i> +91 8867390680 					</div>
				</span>
			</div>
							<div className="fixed point1 w0 d-lg-none">
				<a href="tel:+918867390680">
					<img src={SafetyTipsImg6} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
				</a>
			</div>
				<div className="fixed point2">
			<a href={pricelistUrl || "/products"} onClick={handleDownloadPricelist} target="_blank" rel="noopener noreferrer">
				<img src={SafetyTipsImg7} className="priceicn2 float-right blink" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
			</a>
		</div>
	


<noscript><iframe src="https://www.googletagmanager.com/ns.html" height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe></noscript>



    </>
  );
};

export default SafetyTips;
