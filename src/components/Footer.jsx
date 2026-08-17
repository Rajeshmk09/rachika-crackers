function Footer() {
  return (
    <div className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          {/* Profile & Links */}
          <div className="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
            <div className="acme heading4 pb-3 clr text-warning fw-bold">Our Profile</div>
            <p className="josefin text-light" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              We "Rachika Crackers" acknowledged as the renowned super stockist &amp; wholesale supplier
              of an exclusive range of Sivakasi firecrackers.
            </p>
            <div className="acme heading4 py-3 clr text-warning fw-bold">Quick Links</div>
            <div className="tagcloud d-flex flex-wrap gap-2">
              <a href="/" className="josefin btn btn-sm btn-outline-warning text-white">Home</a>
              <a href="/about" className="josefin btn btn-sm btn-outline-warning text-white">About Us</a>
              <a href="/products" className="josefin btn btn-sm btn-outline-warning text-white">Quick Purchase</a>
              <a href="/safety-tips" className="josefin btn btn-sm btn-outline-warning text-white">Safety Tips</a>
              <a href="/contact" className="josefin btn btn-sm btn-outline-warning text-white">Contact Us</a>
            </div>
          </div>

          {/* Logo center */}
          <div className="col-lg-4 col-md-6 col-12 text-center align-self-center mb-4 mb-lg-0">
            <a href="/">
              <img
                src="https://sparkstarcrackers.com/images/sparkstar.webp"
                className="img-fluid w-75 mx-auto d-block"
                alt="Rachika Crackers"
                title="Rachika Crackers"
              />
            </a>
          </div>

          {/* Location & Contact Info */}
          <div className="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
            <div className="acme heading4 pb-3 clr text-warning fw-bold">Our Location</div>
            <div className="josefin pb-2 d-flex align-items-start gap-2">
              <span className="clr text-warning">📍</span>
              <div className="text-light smallfnt">
                Sivakasi, Tamil Nadu, Anupankulam,<br />
                Sivakasi - 626 189
              </div>
            </div>

            <div className="acme py-2 heading5 clr text-warning fw-bold">For Orders</div>
            <div className="josefin pb-2 d-flex align-items-center gap-2">
              <span className="clr text-warning">📞</span>
              <div className="text-light smallfnt">+91 72003 62436</div>
            </div>
            <div className="josefin pb-3 d-flex align-items-center gap-2">
              <span className="clr text-warning">✉️</span>
              <div className="text-light smallfnt">rachikacrackers@gmail.com</div>
            </div>
          </div>

          <div className="col-12 my-3 border-top border-secondary"></div>

          {/* Supreme court legal disclaimer */}
          <div className="col-lg-12 text-center pt-4">
            <p className="smallfnt josefin text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
              As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers
              and at the same time, respect jurisdiction. We request you to add your products to the cart and submit
              the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the
              order through WhatsApp or phone call. Please add and submit your enquiries and enjoy your Diwali with
              Rachika Crackers. Our License No.----. Rachika Crackers as a company following 100% legal &amp; statutory
              compliances and all our shops, go-downs are maintained as per the explosive acts. We send the parcels
              through registered and legal transport service providers as like every other major company in Sivakasi
              is doing so.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
