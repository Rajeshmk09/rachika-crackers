import AboutImg1 from '../assets/websitelogo.png';
import AboutImg2 from '../assets/about_img_2.jpeg';
import AboutImg3 from '../assets/aboutusbanner.png';
import AboutImg4 from '../assets/about_img_4.png';
import AboutImg5 from '../assets/about_img_5.webp';
import AboutImg6 from '../assets/about_img_6.png';
import AboutImg7 from '../assets/about_img_7.png';
import AboutImg8 from '../assets/about_img_8.png';
import AboutImg9 from '../assets/about_img_9.png';
import React from 'react';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';

const About = () => {
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
      
	

<img src={AboutImg3} className="img-fluid w-100" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />

<div className="container pad wow fadeInLeft" data-wow-duration="1.5s" data-wow-delay=".2s">
    <div className="row">
        <div className="col-lg-6 col-md-6 col-12">
            <h1 className="acme clr bannerhead1 pb-4">About SETHU PYRO PARK RACHIKA CRACKERS - Online Crackers Shopping</h1>
            <p className="josefin">SETHU PYRO PARK RACHIKA CRACKERS shop for wholesale, retail and online sales in Sivakasi has a strong base in supplying, crackers, fancy / pyrotech items 
				and gift boxes for whole Tamilnadu throughout the year for all festivals, functions and celebrations.</p>
            <p className="josefin">This is an outcome of the experience and knowledge we share in the field of selling crackers. We are a wholesale trader of Multi brand fire crackers. 
				We have our own exclusive showroom in Sivakasi. </p>    
			<p className="josefin">One can buy crackers from us round the year. Buying quality crackers during all season we came up with the solution to buy crackers online.</p>	  
			<h1 className="acme clr bannerhead2 pt-2">Our Speciality</h1>
			<p className="josefin">Firecrackers, 1000, 5000, 10000 walas, Rockets &amp; Missiles, Fountains &amp; Cones, Roman Candles, Sparklers, Novelties &amp; Aerials display, 
				Parachutes, Smoke &amp; Snakes, Chakkars, Lakshmi, Kuruvi Crackers, Power ropes, and more…</p>	
		</div>
        <div className="col-lg-6 col-md-6 col-12 align-self-center wow fadeInRight" data-wow-duration="1.5s" data-wow-delay=".2s">
            <img src={AboutImg4} className="img-fluid w-100" alt="SETHU PYRO PARK RACHIKA CRACKERS Shop" title="SETHU PYRO PARK RACHIKA CRACKERS Shop" />
        </div>
    </div>
</div>
<div className="parallax1">
	<div className="container aboutpad">
		<div className="row">
			<div className="quality text-white">
				<div className="row">
					<div className="col-md-4 py-4 text-center">
						<i className="bi bi-eye abticnfnt pb-2"></i>
						<h4 className="acme pb-2">Our Vision</h4>
						<p className="josefin">To be the top seller of fireworks in the market by providing all branded fireworks that satisfies our customers in all manners. </p>
					</div>
					<div className="col-md-4 py-4 text-center">
						<i className="bi bi-check-square abticnfnt pb-2"></i>
						<h4 className="acme pb-2">Our Mission</h4>
						<p className="josefin">To provide the best branded crackers to our customers to enjoy their celebrations in a safe and colorful way.</p>
					</div>
					<div className="col-md-4 py-4 text-center">
						<i className="bi bi-globe abticnfnt pb-2"></i>
						<h4 className="acme pb-2">Our Quality</h4>
						<p className="josefin">Quality is very important for us and we never compromise with quality. Since we deal with a product that demands safety.</p>
					</div>
				</div>
			</div>
		</div>
	</div>	
</div>

					<noscript><iframe src="https://www.googletagmanager.com/ns.html" height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe></noscript>



    </>
  );
};

export default About;
