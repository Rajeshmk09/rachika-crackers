import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';
import TopMarquee from '../components/TopMarquee';
import HomeImg1 from '../assets/websitelogo.png';
import HomeImg2 from '../assets/home_img_2.jpeg';
import HomeImg3 from '../assets/home_img_3.webp';
import HomeImg4 from '../assets/home_img_4.webp';
import HomeImg5 from '../assets/home_img_5.webp';
import HomeImg6 from '../assets/home_img_6.webp';
import HomeImg7 from '../assets/home_img_7.webp';
import HomeImg8 from '../assets/home_img_8.png';
import HomeImg9 from '../assets/home_img_9.png';
import HomeImg10 from '../assets/home_img_10.png';
import HomeImg11 from '../assets/home_img_11.png';
import HomeImg12 from '../assets/home_img_12.webp';
import HomeImg13 from '../assets/home_img_13.png';
import HomeImg14 from '../assets/home_img_14.png';
import HomeImg15 from '../assets/home_img_15.webp';
import HomeImg16 from '../assets/home_img_16.webp';
import HomeImg17 from '../assets/home_img_17.webp';
import HomeImg18 from '../assets/home_img_18.webp';
import HomeImg19 from '../assets/home_img_19.webp';
import HomeImg20 from '../assets/home_img_20.png';
import HomeImg21 from '../assets/home_img_21.png';
import HomeImg22 from '../assets/home_img_22.png';
import HomeImg23 from '../assets/home_img_23.png';
import HomeImg24 from '../assets/home_img_24.png';
import HomeImg25 from '../assets/home_img_25.png';
import HomeImg26 from '../assets/home_img_26.png';
import HomeImg27 from '../assets/home_img_27.png';
import HomeImg28 from '../assets/home_img_28.png';
import HomeImg29 from '../assets/home_img_29.png';
import HomeImg30 from '../assets/home_img_30.png';
import HomeImg31 from '../assets/home_img_31.png';
import HomeImg32 from '../assets/home_img_32.png';
import HomeImg33 from '../assets/home_img_33.png';
import HomeImg34 from '../assets/home_img_34.webp';
import HomeImg36 from '../assets/home_img_36.png';
import HomeImg37 from '../assets/home_img_37.png';
import HomeImg38 from '../assets/home_img_38.png';
import HomeImg39 from '../assets/home_img_39.png';
import ProductCard from '../components/ProductCard';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';



// Fetch hero banners (with fallback to products table)
const fetchHeroBannersQuery = async () => {
	const headers = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` };
	let res = await fetch(`${SUPABASE_URL}/rest/v1/hero_banners?order=created_at.asc`, { headers });
	if (res.ok) {
		const data = await res.json();
		if (data && data.length > 0) return data;
	}
	// Fallback to products table
	res = await fetch(`${SUPABASE_URL}/rest/v1/products?category=eq.__HERO_BANNER__&order=created_at.asc`, { headers });
	if (res.ok) {
		const data = await res.json();
		if (data && data.length > 0) return data;
	}
	return [];
};

// Fetch featured products
const fetchFeaturedProductsQuery = async () => {
	const headers = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` };
	const response = await fetch(`${SUPABASE_URL}/rest/v1/products?is_active=neq.false&limit=8&order=product_code.asc`, { headers });
	if (!response.ok) return [];
	const data = await response.json();
	const cleanData = (data || []).filter(p => !p.category || !p.category.startsWith('__'));
	return cleanData.map(p => {
		let fallbackImg = HomeImg15;
		const cat = (p.category || '').toLowerCase();
		if (cat.includes('pot')) fallbackImg = HomeImg16;
		else if (cat.includes('sparkler') || cat.includes('star')) fallbackImg = HomeImg17;
		else if (cat.includes('sound') || cat.includes('bomb')) fallbackImg = HomeImg18;
		else if (cat.includes('fountain') || cat.includes('peacock')) fallbackImg = HomeImg19;
		return { ...p, image_url: p.image_url || fallbackImg, original_price: p.mrp || p.original_price || p.price };
	});
};

const Home = () => {
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
	// useQuery: isLoading=true ONLY on the very first fetch. On back navigation, cachedData shows instantly.
	const {
		data: dynamicHeroBanners = [],
		isLoading: heroLoading,
	} = useQuery({
		queryKey: ['hero-banners'],
		queryFn: fetchHeroBannersQuery,
	});

	const {
		data: featuredProductsList = [],
		isLoading: featuredLoading,
	} = useQuery({
		queryKey: ['featured-products'],
		queryFn: fetchFeaturedProductsQuery,
	});

	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const [minTN, setMinTN] = useState(3000);
	const [minOther, setMinOther] = useState(6000);

	useEffect(() => {
		// 1. Try local storage cache
		try {
			const cached = localStorage.getItem('sethupyropark_site_settings');
			if (cached) {
				const s = JSON.parse(cached);
				if (s.min_order_tn != null) setMinTN(parseFloat(s.min_order_tn) || 0);
				if (s.min_order_other != null) setMinOther(parseFloat(s.min_order_other) || 0);
			}
		} catch (e) { }

		// 2. Fetch fresh from DB
		const loadSettings = async () => {
			try {
				const headers = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` };
				const res = await fetch(`${SUPABASE_URL}/rest/v1/products?category=eq.__SITE_SETTINGS__&limit=1`, { headers });
				if (res.ok) {
					const data = await res.json();
					if (data && data.length > 0) {
						const s = JSON.parse(data[0].description || '{}');
						if (s.min_order_tn != null) setMinTN(parseFloat(s.min_order_tn) || 0);
						if (s.min_order_other != null) setMinOther(parseFloat(s.min_order_other) || 0);
						try { localStorage.setItem('sethupyropark_site_settings', JSON.stringify(s)); } catch (e) { }
					}
				}
			} catch (err) { }
		};
		loadSettings();
	}, []);

	// Auto-scroll hero banner slides every 3 seconds (3000ms)
	useEffect(() => {
		if (!dynamicHeroBanners || dynamicHeroBanners.length <= 1) return;
		const timer = setInterval(() => {
			setActiveSlideIndex((prev) => (prev + 1) % dynamicHeroBanners.length);
		}, 3000);

		return () => clearInterval(timer);
	}, [dynamicHeroBanners]);

	const handleNextSlide = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveSlideIndex((prev) => (prev + 1) % dynamicHeroBanners.length);
	};

	const handlePrevSlide = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveSlideIndex((prev) => (prev - 1 + dynamicHeroBanners.length) % dynamicHeroBanners.length);
	};

	const handleIndicatorClick = (e, idx) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveSlideIndex(idx);
	};

	return (
		<>
			{/* Dynamic Hero Banners Carousel with Skeleton Loader */}
			{heroLoading ? (
				<div
					style={{
						width: '100%',
						height: '420px',
						maxHeight: '550px',
						backgroundColor: '#e2e8f0',
						position: 'relative',
						overflow: 'hidden'
					}}
				>
					<style>{`
						@keyframes heroShimmer {
							0% { transform: translateX(-100%); }
							100% { transform: translateX(100%); }
						}
					`}</style>
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
							animation: 'heroShimmer 1.5s infinite'
						}}
					/>
				</div>
			) : dynamicHeroBanners.length > 0 ? (
				<div id="dynamicHeroCarousel" className="carousel slide position-relative overflow-hidden">
					<ol className="carousel-indicators" style={{ margin: '0 0 15px 0', zIndex: 5 }}>
						{dynamicHeroBanners.map((_, idx) => (
							<li
								key={idx}
								onClick={(e) => handleIndicatorClick(e, idx)}
								className={idx === activeSlideIndex ? "active" : ""}
								style={{ cursor: 'pointer', width: idx === activeSlideIndex ? '30px' : '10px', height: '10px', borderRadius: '5px', transition: 'all 0.3s ease' }}
							></li>
						))}
					</ol>
					<div className="carousel-inner">
						{dynamicHeroBanners.map((b, idx) => (
							<div
								key={b.id || idx}
								className={`carousel-item ${idx === activeSlideIndex ? 'active' : ''}`}
								style={{
									display: idx === activeSlideIndex ? 'block' : 'none',
									transition: 'opacity 0.6s ease-in-out'
								}}
							>
								<Link to={b.description || b.target_url || '/products'}>
									<img
										src={b.image_url}
										alt={b.name || b.title || 'Hero Banner'}
										className="img-fluid w-100 d-block"
										style={{ cursor: 'pointer', maxHeight: '550px', objectFit: 'cover' }}
									/>
								</Link>
							</div>
						))}
					</div>
					{dynamicHeroBanners.length > 1 && (
						<>
							<button
								type="button"
								onClick={handlePrevSlide}
								style={{
									position: 'absolute',
									top: '50%',
									left: '14px',
									transform: 'translateY(-50%)',
									zIndex: 10,
									border: 'none',
									background: 'rgba(0,0,0,0.45)',
									borderRadius: '50%',
									width: '44px',
									height: '44px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
									transition: 'background 0.2s ease'
								}}
								onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
								onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
									<polyline points="15 18 9 12 15 6" />
								</svg>
							</button>
							<button
								type="button"
								onClick={handleNextSlide}
								style={{
									position: 'absolute',
									top: '50%',
									right: '14px',
									transform: 'translateY(-50%)',
									zIndex: 10,
									border: 'none',
									background: 'rgba(0,0,0,0.45)',
									borderRadius: '50%',
									width: '44px',
									height: '44px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
									transition: 'background 0.2s ease'
								}}
								onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
								onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
									<polyline points="9 18 15 12 9 6" />
								</svg>
							</button>
						</>
					)}
				</div>
			) : null}








			<form name="order_form" method="POST" className="new_arrivals_purchase_form" action="#/products">
				<input type="hidden" name="selected_product_id" value="" />
			</form>

			<div className="fireworks-example">
				<canvas width="1349" height="80"></canvas>
				<canvas width="1084" height="827"></canvas></div>

			<div className="container pt-5">
				<div className="row">
					<div className="col-lg-3 col-md-6 col-12">
						<div className="box-border">
							<div className="d-flex">
								<div className="hicon">
									<img src={HomeImg8} className="img-fluid w-75" alt="Icon" title="Icon" />
								</div>
								<div className="icon-info align-self-center">
									<div className="top-bx-txt acme clr-red"> MINIMUM ORDER VALUE </div>
									<div className="josefin smallfnt"><i className="bi bi-currency-rupee"></i> {minTN.toLocaleString('en-IN')} Rs </div>
								</div>
							</div>

						</div>
					</div>
					<div className="col-lg-3 col-md-6 col-12">
						<div className="box-border">
							<div className="d-flex">
								<div className="hicon">
									<img src={HomeImg9} className="img-fluid w-75" alt="Icon" title="Icon" />
								</div>
								<div className="icon-info align-self-center">
									<div className="top-bx-txt acme clr-red">SAFE TO USE</div>
									<div className="josefin smallfnt">Crackers are safe to use</div>
								</div>
							</div>

						</div>
					</div>
					<div className="col-lg-3 col-md-6 col-12">
						<div className="box-border">
							<div className="d-flex">
								<div className="hicon mr-2">
									<img src={HomeImg10} className="img-fluid w-75" alt="Icon" title="Icon" />
								</div>
								<div className="icon-info align-self-center">
									<div className="top-bx-txt acme clr-red">OTHER STATES</div>
									<div className="josefin smallfnt">Minimum Order <i className="bi bi-currency-rupee"></i> {minOther.toLocaleString('en-IN')} </div>
								</div>
							</div>

						</div>
					</div>
					<div className="col-lg-3 col-md-6 col-12">
						<div className="box-border">
							<div className="d-flex">
								<div className="hicon mr-2">
									<img src={HomeImg11} className="img-fluid w-75" alt="Icon" title="Icon" />
								</div>
								<div className="icon-info align-self-center">
									<div className="top-bx-txt acme clr-red"> QUALITY ASSURED </div>
									<div className="josefin smallfnt"> Assured Quality Packing </div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>

			<div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px' }}>
				<div className="row justify-content-center mb-4">
					<div className="col-lg-8 text-center">
						<h2 className="acme clr bannerhead1" style={{ color: '#0a539f' }}>Featured Products</h2>
						<p className="josefin text-muted" style={{ fontSize: '1.1rem' }}>Check out our top-selling crackers at Sivakasi wholesale prices with amazing discounts!</p>
					</div>
				</div>
				<div className="row">
					{featuredLoading ? (
						Array.from({ length: 8 }).map((_, idx) => (
							<div key={idx} className="col-lg-3 col-md-6 col-12 mb-4">
								<div className="card h-100 shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
									<div className="p-3 text-center" style={{ backgroundColor: '#f5f5f7', borderRadius: '16px', margin: '8px 8px 0 8px' }}>
										<div className="skeleton-pulse" style={{ height: '220px', borderRadius: '12px', backgroundColor: '#e2e8f0' }} />
									</div>
									<div className="card-body d-flex flex-column p-3">
										<div className="skeleton-pulse mb-2" style={{ width: '40%', height: '14px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
										<div className="skeleton-pulse mb-2" style={{ width: '85%', height: '20px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
										<div className="skeleton-pulse mb-3" style={{ width: '30%', height: '12px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
										<div className="mt-auto d-flex align-items-center justify-content-between">
											<div className="skeleton-pulse" style={{ width: '45%', height: '26px', borderRadius: '6px', backgroundColor: '#e2e8f0' }} />
											<div className="skeleton-pulse" style={{ width: '110px', height: '38px', borderRadius: '20px', backgroundColor: '#e2e8f0' }} />
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						featuredProductsList.map(product => (
							<div key={product.id} className="col-lg-3 col-md-6 col-12 mb-4">
								<ProductCard product={product} />
							</div>
						))
					)}
				</div>

				{/* View All Products Button */}
				<div className="text-center mt-4 pt-2">
					<Link
						to="/products"
						className="btn btn-warning btn-lg font-weight-bold acme rounded-pill text-white px-5 py-3 shadow-sm"
						style={{ backgroundColor: '#ff7011', border: 'none', fontSize: '1.1rem', letterSpacing: '0.5px' }}
					>
						View All Products →
					</Link>
				</div>
			</div>

			<div className="container py-5">
				<div className="row">
					<div className="col-lg-6 col-md-12 col-12 align-self-center d-md-none d-lg-block">
						<img src={HomeImg12} className="img-fluid" alt="festival crackers shop" title="festival crackers shop" />
					</div>
					<div className="col-lg-6 col-md-12 col-12">
						<div className="row justify-content-center">
							<div className="col-lg-12">
								<h1 className="acme clr1">SETHU PYRO PARK RACHIKA CRACKERS</h1>
								<div className="heading5  acme mt-1">We’re providing the best quality crackers in town.</div>
								<div className="title title-border"></div>
								<p className="josefin">Discover an extensive selection of firecrackers to illuminate your celebrations with dazzling displays.</p>
							</div>
							<div className="col-lg-6 col-md-4 col-12 my-3">
								<div className="count-box">
									<ul id="counter" className="fullpad raleway">
										<i className="bi bi-heart-fill	 text-white heading2"></i>
										<li>
											<span className="count percent counttext acme" data-count="2014">2014</span>
										</li>
										<p className="acme josefin txt-danger">SINCE</p>
									</ul>
								</div>
							</div>
							<div className="col-lg-6 col-md-4 col-12 my-3">
								<div className="count-box">
									<ul id="counter" className="fullpad raleway">
										<i className="bi bi-person-fill text-white heading2"></i>
										<li>
											<span className="count percent counttext acme" data-count="500">500</span>
											<span className="bannerhead acme">+</span>
										</li>
										<p className="acme josefin txt-danger">HAPPY CLIENTS</p>
									</ul>
								</div>
							</div>
							<div className="col-lg-6 col-md-4 col-12 my-3">
								<div className="count-box">
									<ul id="counter" className="fullpad raleway">
										<i className="bi bi-person-fill text-white heading2"></i>
										<li>
											<span className="count percent counttext acme" data-count="100">100</span>
											<span className="bannerhead acme">%</span>
										</li>
										<p className="acme josefin txt-danger">SATISFACTION</p>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>




			<div className="container pad">
				<div className="row">
					<div className="col-lg-2 col-md-2 col-12">
						<div className="product-shape">
							<div className="shape1">
								<img src={HomeImg13} className="img-fluid" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
							</div>
						</div>
					</div>
					<div className="col-lg-8 col-md-8 col-12 text-center">
						<h1 className="acme clr bannerhead1 pb-3 wow animated" data-wow-duration="1.5s" data-wow-delay=".7s" style={{ visibility: 'visible', animationDuration: '1.5s', animationDelay: '0.7s' }}>Our Best &amp; Trending Products</h1>
						<p className="josefin">With over 200 varieties of crackers developed and marketed every year, we are among the most sought brands in the Sivakasi region and around the country.
							Our products are known for their safety and we take great efforts to ensure that all our orders are delivered in a standard time frame with an economical pricing.</p>
					</div>
					<div className="col-lg-2 col-md-2 col-12">
						<div className="product-shape">
							<div className="shape3">
								<img src={HomeImg14} className="w-75 img-fluid" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
							</div>
						</div>
					</div>
					<div className="col-lg-4 col-md-6 secpad text-center">
						<div className="image-feature img-bottom">
							<figure className="wp-caption box-bg">
								<a href="/products">
									<img className="img-fluid" src={HomeImg15} alt="buy online crackers" title="buy online crackers" />
								</a>
								<figcaption className="widget-image-caption wp-caption-text">
									<strong className="acme">Chakkars</strong><br />
									<div className="pb-2 josefin">Chakkar Big, Special, Asoka...</div>
									<div className="cat-btn josefin fw-600">Shop Now</div>
								</figcaption>
							</figure>
						</div>
					</div>
					<div className="col-lg-4 col-md-6 secpad text-center">
						<div className="image-feature">
							<figure className="wp-caption box-bg">
								<a href="/products">
									<img className="img-fluid" src={HomeImg16} alt="crackers collection 2025" title="crackers collection 2025" />
								</a>
								<figcaption className="widget-image-caption wp-caption-text">
									<strong className="acme">Flower Pots</strong><br />
									<div className="pb-2 josefin">Colour pots small, Big, Special...</div>
									<div className="cat-btn josefin fw-600">Shop Now</div>
								</figcaption>
							</figure>
						</div>
					</div>
					<div className="col-lg-4 col-md-6 secpad text-center">
						<div className="image-feature">
							<figure className="wp-caption box-bg">
								<a href="/products">
									<img className="img-fluid" src={HomeImg17} alt="online crackers sale" title="online crackers sale" />
								</a>
								<figcaption className="widget-image-caption wp-caption-text">
									<strong className="acme">Sparklers</strong><br />
									<div className="pb-2 josefin">Red, Green, Electric....</div>
									<div className="cat-btn josefin fw-600">Shop Now</div>
								</figcaption>
							</figure>
						</div>
					</div>
					<div className="col-lg-6 col-md-6 secpad text-center">
						<div className="image-feature">
							<figure className="wp-caption box-bg">
								<a href="/products">
									<img src={HomeImg18} className="img-fluid w-100" alt="biggest diwali sale" title="biggest diwali sale" />
								</a>
								<figcaption className="widget-image-caption wp-caption-text">
									<strong className="acme">Single Sound</strong><br />
									<div className="pb-2 josefin">Kuruvi, Lakshmi, Spider...</div>
									<div className="cat-btn josefin fw-600">Shop Now</div>
								</figcaption>
							</figure>
						</div>
					</div>
					<div className="col-lg-6 col-md-6 secpad text-center">
						<div className="image-feature">
							<figure className="wp-caption box-bg">
								<a href="/products">
									<img src={HomeImg19} className="img-fluid w-100" alt="diwali shopping" title="diwali shopping" />
								</a>
								<figcaption className="widget-image-caption wp-caption-text">
									<strong className="acme">Gift Boxes</strong><br />
									<div className="pb-2 josefin">Special, Deluxe, Grand....</div>
									<div className="cat-btn josefin fw-600">Shop Now</div>
								</figcaption>
							</figure>
						</div>
					</div>
				</div>
			</div>


			<div className="homeparallax">
				<div className="container py-5">
					<div className="row">
						<div className="col-lg-12 text-center wow zoomIn" data-wow-duration="1.5s" data-wow-delay=".3s" style={{ visibility: 'visible', animationDuration: '1.5s', animationDelay: '0.3s', animationName: 'zoomIn' }}>
							<div className="arial text-white heading1 fnt21">We are one of the leading sellers <br /> of Sivakasi Firecrackers</div>
							<p className="helvetica text-white">We are available On 24 x 7 Support. Order and let's Purchase</p>
							<div className="mt-4">
								<a href="/contact" className="btn1 arial">Contact Now</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="top-bg2">
				<div className="container py-5">
					<div className="row">
						<div className="col-md-7 text-center">
							<h1 className="acme text-white">Our Pricelist </h1>
							<p className="pt-2 text-white josefin pb-3">We offer the best quality products at best price. Make celebrations more memorable with superior quality of our crackers all over India </p>
						</div>
						<div className="col-md-5 text-center align-self-center">
							<a href="/products" className="font-weight-bold btn-effect1"> Check Now </a>
						</div>
					</div>
				</div>
			</div>
			<div className="about-area">
				<div className="container py-5">
					<div className="row">
						<div className="col-lg-4 col-md-6 col-12 pt-4 align-self-center mt-3 text-center">
							<div className="acme pb-3 clr1 heading1">Why Choose Us?</div>
							<p className="josefin pb-3">Whether you're marking a festival, a special occasion, or simply embracing the joy of life, our curated collection ensures that your moments shine the brightest.</p>
						</div>
						<div className="col-lg-5 col-md-6 col-12 ml-lg-5 pt-4">
							<div className="about-blog">
								<div className="single-offers d-flex mb-20 shadow wow zoomInLeft" style={{ visibility: 'visible', animationName: 'zoomInLeft' }}>
									<div className="icon pr-2">
										<i className="bi bi-puzzle boxicn"></i>
									</div>
									<div className="offers-cap">
										<div className="heading6 clr1 acme">Superior Quality</div>
										<p className="josefin"> Fine Quality Products &amp; innovation are the key behind our success </p>
									</div>
								</div>
								<div className="single-offers d-flex mb-20 shadow wow zoomInRight" style={{ visibility: 'visible', animationName: 'zoomInRight' }}>
									<div className="icon pr-2">
										<i className="bi bi-magic boxicn"></i>
									</div>
									<div className="offers-cap">
										<div className="heading6 clr1 acme">Safe to Use </div>
										<p className="josefin">Crackers we offer are safe &amp; are made from fine quality raw materials</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="about-shape d-none d-md-none d-lg-block">
						<img src={HomeImg34} className="img-fluid w-75" alt="Crackers" title="Crackers" />
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
								<a href="/safetytips" className="josefin">Safetytips</a>
								<a href="/contact" className="josefin">Contact us</a>
							</div>
						</div>
						<div className="col-lg-4 col-md-6 col-12 text-center align-self-center">
							<a href="/">
								<img src={HomeImg1} className="img-fluid w-100 mx-auto d-block" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
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
									sethupyropark@gmail.com							</div>
							</li>

						</div>
						<div className="col-12 my-3">&nbsp;</div>
						<div className="col-lg-12 text-center pt-4">
							<p className="smallfnt josefin pb-3">As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call. Please add and submit your enquiries and enjoy your Diwali with SETHU PYRO PARK RACHIKA CRACKERS. Our License No.----. SETHU PYRO PARK RACHIKA CRACKERS as a company following 100% legal &amp; statutory compliances and all our shops, go-downs are maintained as per the explosive acts. We send the parcels through registered and legal transport service providers as like every other major companies in Sivakasi is doing so.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="fixed point w0">
				<a href="https://api.whatsapp.com/send">
					<img src={HomeImg36} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
				</a>
			</div>
			<div className="fixed point1 w0 d-none d-lg-block">
				<span className="time-of-year">
					<img src={HomeImg37} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
					<div className="tooltip text-white text-center"> For More Details Call <br />
						<i className="bi bi-phone"></i> +91 8867390680 					</div>
				</span>
			</div>
			<div className="fixed point1 w0 d-lg-none">
				<a href="tel:+918867390680">
					<img src={HomeImg38} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
				</a>
			</div>
			<div className="fixed point2">
				<a href={pricelistUrl || "/products"} onClick={handleDownloadPricelist} target="_blank" rel="noopener noreferrer">
					<img src={HomeImg39} className="priceicn2 float-right blink" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
				</a>
			</div>





			<noscript><iframe src="https://www.googletagmanager.com/ns.html" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>




		</>
	);
};

export default Home;
