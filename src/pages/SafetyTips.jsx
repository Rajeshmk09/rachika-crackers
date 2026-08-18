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
			<li className="pt-4" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}>&#10003;</span>
				<div>
					<h1 className="acme heading4">Instructions</h1>
					<p className="josefin">Display fireworks as per the instructions mentioned on the pack.</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}>&#10003;</span>
				<div>
					<h1 className="acme heading4">Outdoor</h1>
					<p className="josefin">Use fireworks only outdoor</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}>&#10003;</span>
				<div>
					<h1 className="acme heading4">Branded Fireworks</h1>
					<p className="josefin">Buy fireworks from authorized / reputed manufacturers only.</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}>&#10003;</span>
				<div>
					<h1 className="acme heading4">Distance</h1>
					<p className="josefin">Light only one firework at a time, by one person. Others should watch from a safe distance.</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}>&#10003;</span>
				<div>
					<h1 className="acme heading4">Supervision</h1>
					<p className="josefin">Always have adult supervision</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}>&#10003;</span>
				<div>
					<h1 className="acme heading4">Water</h1>
					<p className="josefin">Keep two buckets of water handy. In the event of fire or any mishap.</p>
				</div>
			</li>
		</div>
		<div className="col-lg-6 col-md-12 col-12">
			<h1 className="block-head acme font">Don'ts</h1>
			<li className="pt-4" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}>&#10005;</span>
				<div>
					<h1 className="acme heading4">Don't make tricks</h1>
					<p className="josefin">Never make your own fireworks.</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}>&#10005;</span>
				<div>
					<h1 className="acme heading4">Don't relight</h1>
					<p className="josefin">Never try to re-light or pick up fireworks that have not ignited fully.</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}>&#10005;</span>
				<div>
					<h1 className="acme heading4">Don't carry it</h1>
					<p className="josefin">Never carry fireworks in your pockets</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}>&#10005;</span>
				<div>
					<h1 className="acme heading4">Don't Touch it</h1>
					<p className="josefin">After fireworks display never pick up fireworks that may be left over, they still may be active.</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}>&#10005;</span>
				<div>
					<h1 className="acme heading4">Do not use Glass / Metal</h1>
					<p className="josefin">Never shoot fireworks in a metal or glass containers.</p>
				</div>
			</li>
			<li className="pt-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', listStyle: 'none' }}>
				<span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}>&#10005;</span>
				<div>
					<h1 className="acme heading4">Don't wear loose clothes</h1>
					<p className="josefin">Do not wear loose clothing while using fireworks.</p>
				</div>
			</li>
		</div>
	</div>
</div>

					<noscript><iframe src="https://www.googletagmanager.com/ns.html" height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe></noscript>



    </>
  );
};

export default SafetyTips;
