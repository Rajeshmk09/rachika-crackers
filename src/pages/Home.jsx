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
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const featuredProducts = [
  {
    id: "prod_1",
    name: "4x4 Wheel (Ground Chakkara)",
    price: 60,
    original_price: 120,
    unit: "1 Box",
    category: "GROUND CHAKKARA SERIES",
    image: HomeImg15
  },
  {
    id: "prod_2",
    name: "Flower Pots Special",
    price: 140,
    original_price: 280,
    unit: "1 Box",
    category: "FLOWER POTS SERIES",
    image: HomeImg16
  },
  {
    id: "prod_3",
    name: "7 cm Sparklers",
    price: 75,
    original_price: 150,
    unit: "1 Box",
    category: "KIDS SPARKLERS SERIES",
    image: HomeImg17
  },
  {
    id: "prod_4",
    name: "12 cm Sparklers",
    price: 100,
    original_price: 200,
    unit: "1 Box",
    category: "KIDS SPARKLERS SERIES",
    image: HomeImg17
  },
  {
    id: "prod_5",
    name: "5 in 1 Mini Chottu Tri Colour Fountains",
    price: 150,
    original_price: 300,
    unit: "1 Box",
    category: "KIDS PINK COLOURFUL FOUNTAINS SERIES",
    image: HomeImg16
  },
  {
    id: "prod_6",
    name: "4\" Deluxe Colors Lakshmi",
    price: 85,
    original_price: 170,
    unit: "1 Pkt",
    category: "SINGLE SOUND SERIES",
    image: HomeImg18
  },
  {
    id: "prod_7",
    name: "6\" Mega Deluxe Colors Lakshmi",
    price: 140,
    original_price: 280,
    unit: "1 Pkt",
    category: "SINGLE SOUND SERIES",
    image: HomeImg18
  },
  {
    id: "prod_8",
    name: "Roller Coaster (Golden Spinkler)",
    price: 180,
    original_price: 360,
    unit: "1 Box",
    category: "ELITE WONDERFUL FOUNTAIN SERIES",
    image: HomeImg19
  }
];

const Home = () => {
  const [featuredProductsList, setFeaturedProductsList] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch("https://iplfsscpeixfxzbouhlp.supabase.co/rest/v1/products?limit=8&order=product_code.asc", {
          headers: {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8"
          }
        });
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map(p => {
            let img = HomeImg15;
            if (p.category.toLowerCase().includes('pots')) img = HomeImg16;
            else if (p.category.toLowerCase().includes('sparkler') || p.category.toLowerCase().includes('stars')) img = HomeImg17;
            else if (p.category.toLowerCase().includes('sound') || p.category.toLowerCase().includes('bomb')) img = HomeImg18;
            else if (p.category.toLowerCase().includes('fountain') || p.category.toLowerCase().includes('peacock')) img = HomeImg19;
            return {
              ...p,
              image: img
            };
          });
          setFeaturedProductsList(mapped);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <>
      
	
<div className="sectionbg">
    <div className="container-fluid">
		<div className="row">
			<div className="col-md-12 px-0">
			
<div className="py-2 px-2 marquee L" style={{backgroundColor: '#0a539f', color: '#ffffff'}}><div style={{width: '100000px', marginLeft: '1454px', animation: '57.8047s linear 0s infinite normal none running marqueeAnimation-6440257'}} className="js-marquee-wrapper"><div className="js-marquee" style={{marginRight: '0px', float: 'left'}}>
    🚨 Important Update! 🚨
The SETHU PYRO PARK RACHIKA CRACKERS website will be closing this coming Sunday!

🧨 Kindly place your orders as soon as possible to avoid missing out.

Due to increased transport charges and unfavorable weather conditions, we are closing earlier than usual.

🙏 Thank you for your continued support!

For instant 90% discounts, offers call us now :- +91 96267 77758.   Diwali sale is open now. Please buy early to get best discounts Happy Diwali....!!!! NOTE:-25.09.2025 ONWARDS ALL COMBO'S PACKS CLOSED &amp; "Home delivery is not available — please come and pick it up from the local hub."
.....Due to high transportation charges, we have stopped services to Andhra Pradesh, Telangana, and Karnataka. We apologize for the inconvenience caused.</div></div></div>
      
    
			</div>
		</div>
    </div>
</div>
<div className="container py-2">
	<div className="row">
		<div className="col-lg-4 col-md-12 col-12 text-center text-lg-left align-self-center">
			<a href="/"> 
				<img src={HomeImg1} className="img-fluid logo" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
			</a>
		</div>
		<div className="col-lg-4 d-none d-md-none d-lg-block align-self-center">
			<div className="d-flex align-items-center">
				<div className="icon pr-2">
				    <img src={HomeImg2} className="img-fluid" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
				</div>
				<div className="icon-info">
				    <div className="acme heading6 clr">Location</div>
				    <div className="josefin smallfnt">9/296/1, Sri Anjaneya Nagar, Anupankulam,<br />Sivakasi - 626 189 </div>
				</div>
			</div>
		</div>
		<div className="col-lg-4 d-none d-md-none d-lg-block">
			<div className="phone"> 
				<p className="smallfnt black">FOR QUERIES &amp; <br /> Bulk order</p>
				<span className="josefin smallfnt clr1"> +91 96267 77758 </span> 
			</div>
		</div>
	</div>
</div>

<nav className="navbar navbar-expand-lg navbar-light navbg navfont">
	<div className="container">
		<button type="button" className="navbar-toggler mx-auto" data-toggle="collapse" data-target="#myNavbar">
			<span className="bi bi-list text-white"> Menu </span>
		</button>
		<div id="myNavbar" className="collapse navbar-collapse navfont">
			<ul className="navbar-nav mr-auto text-center">
				<li className="nav-item px-3 active">
					<a className="nav-link" href="/"> Home </a>
				</li>
				<li className="nav-item px-3 ">
					<a className="nav-link" href="/about"> About </a>
				</li>
				<li className="nav-item px-3 ">
					<a className="nav-link" href="/products"> Products </a>
				</li>
				<li className="nav-item px-3 ">
					<a className="nav-link" href="/safetytips">Safety Tips</a>
				</li>
				<li className="nav-item px-3 ">
					<a className="nav-link" href="/contact">Contact</a>
				</li>
				<li className="nav-item px-3">
					<a className="nav-link" href="https://www.metturtransports.com/">Track Your Order</a>
				</li>
				<li className="nav-item px-3 text-center">
					<a className="pricelist_pdf blink" href="order/pdf/rpt_price_list_php.html" target="_blank">
    Download Pricelist
</a>
				</li>
			</ul>
		</div> 	
	</div>	
</nav>

 <div id="myCarousel" className="carousel slide d-none d-md-block" data-ride="carousel">
	<ol className="carousel-indicators">
					<li data-target="#myCarousel" data-slide-to="0" className="active"></li>
					<li data-target="#myCarousel" data-slide-to="1" className=""></li>
			</ol>
	<div className="carousel-inner">
								<div className="carousel-item active">
							<img src={HomeImg3} onclick="window.open(&quot;products.php&quot;,&quot;_self&quot;)" style={{cursor: 'pointer'}} className="img-fluid w-100 d-block" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
						</div>
								<div className="carousel-item">
							<img src={HomeImg4} onclick="window.open(&quot;products.php&quot;,&quot;_self&quot;)" style={{cursor: 'pointer'}} className="img-fluid w-100 d-block" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
						</div>
			</div>
		<a className="carousel-control-prev" href="/" role="button" data-slide="prev">
		<span className="carousel-control-prev-icon" aria-hidden="true"></span>
		<span className="sr-only">Previous</span>
	</a>
	<a className="carousel-control-next" href="/" role="button" data-slide="next">
		<span className="carousel-control-next-icon" aria-hidden="true"></span>
		<span className="sr-only">Next</span>
	</a>
	</div>
<div id="myCarousel1" className="carousel slide d-md-none" data-ride="carousel">
	<ol className="carousel-indicators">
				<li data-target="#myCarousel1" data-slide-to="0" className="active"></li>
				<li data-target="#myCarousel1" data-slide-to="1"></li>
				<li data-target="#myCarousel1" data-slide-to="2"></li>
			</ol>
	<div className="carousel-inner">
								<div className="carousel-item  active  ">
							<img src={HomeImg5} className="img-fluid w-100 d-block" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
						</div>
								<div className="carousel-item  ">
							<img src={HomeImg6} className="img-fluid w-100 d-block" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
						</div>
								<div className="carousel-item  ">
							<img src={HomeImg7} className="img-fluid w-100 d-block" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
						</div>
			</div>
		<a className="carousel-control-prev" href="/" role="button" data-slide="prev">
		<span className="carousel-control-prev-icon" aria-hidden="true"></span>
		<span className="sr-only">Previous</span>
	</a>
	<a className="carousel-control-next" href="/" role="button" data-slide="next">
		<span className="carousel-control-next-icon" aria-hidden="true"></span>
		<span className="sr-only">Next</span>
	</a>
	</div>






  

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
						<div className="josefin smallfnt"><i className="bi bi-currency-rupee"></i> 3000 (TN, BLRE &amp; PY) </div>
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
						<div className="josefin smallfnt">Minimum Order <i className="bi bi-currency-rupee"></i> 6,000 </div>
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

<div className="container-fluid py-5 px-lg-5 px-md-4 px-2" style={{ marginLeft: '50px', marginRight: '50px', width: 'calc(100% - 100px)' }}>
  <div className="row justify-content-center mb-4">
    <div className="col-lg-8 text-center">
      <h2 className="acme clr bannerhead1" style={{ color: '#0a539f' }}>Featured Products</h2>
      <p className="josefin text-muted" style={{ fontSize: '1.1rem' }}>Check out our top-selling crackers at Sivakasi wholesale prices with amazing discounts!</p>
    </div>
  </div>
  <div className="row mx-n3">
    {featuredProductsList.map(product => (
      <div key={product.id} className="col-lg-3 col-md-6 col-12 mb-4 px-3">
        <ProductCard product={product} />
      </div>
    ))}
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
			<h1 className="acme clr bannerhead1 pb-3 wow animated" data-wow-duration="1.5s" data-wow-delay=".7s" style={{visibility: 'visible', animationDuration: '1.5s', animationDelay: '0.7s'}}>Our Best &amp; Trending Products</h1>
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
			<div className="col-lg-12 text-center wow zoomIn" data-wow-duration="1.5s" data-wow-delay=".3s" style={{visibility: 'visible', animationDuration: '1.5s', animationDelay: '0.3s', animationName: 'zoomIn'}}>
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
					<div className="single-offers d-flex mb-20 shadow wow zoomInLeft" style={{visibility: 'visible', animationName: 'zoomInLeft'}}>
						<div className="icon pr-2">
							<i className="bi bi-puzzle boxicn"></i>
						</div>
						<div className="offers-cap">
							<div className="heading6 clr1 acme">Superior Quality</div>
							<p className="josefin"> Fine Quality Products &amp; innovation are the key behind our success </p>
						</div>
					</div>
					<div className="single-offers d-flex mb-20 shadow wow zoomInRight" style={{visibility: 'visible', animationName: 'zoomInRight'}}>
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
							(+91) 96267 77758 						</div>
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
						<i className="bi bi-phone"></i> +91 96267 77758 					</div>
				</span>
			</div>
							<div className="fixed point1 w0 d-lg-none">
				<a href="tel:+919626777758">
					<img src={HomeImg38} className="priceicn1 float-left" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
				</a>
			</div>
				<div className="fixed point2">
			<a href="/products">
				<img src={HomeImg39} className="priceicn2 float-right blink" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
			</a>
		</div>
	 




<noscript><iframe src="https://www.googletagmanager.com/ns.html" height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe></noscript>




    </>
  );
};

export default Home;
