function Header() {
  return (
    <div className="container py-2">
      <div className="row">

        {/* Logo */}
        <div className="col-lg-4 col-md-12 col-12 text-center text-lg-start align-self-center">
          <a href="/">
            <img
              src="https://sparkstarcrackers.com/images/sparkstar.webp"
              className="img-fluid logo"
              alt="Rachika Crackers"
              title="Rachika Crackers"
            />
          </a>
        </div>

        {/* Location - desktop only */}
        <div className="col-lg-4 d-none d-md-none d-lg-block align-self-center">
          <div className="d-flex align-items-center">
            <div className="icon pr-2">
              <img
                src="https://sparkstarcrackers.com/images/images.jpg"
                className="img-fluid"
                alt="Location"
                title="Location"
              />
            </div>
            <div className="icon-info">
              <div className="acme heading6 clr">Location</div>
              <div className="josefin smallfnt">
                Sivakasi, Tamil Nadu, Anupankulam,<br />
                Sivakasi - 626 189
              </div>
            </div>
          </div>
        </div>

        {/* Phone - desktop only */}
        <div className="col-lg-4 d-none d-md-none d-lg-block">
          <div className="phone">
            <p className="smallfnt black">FOR QUERIES &amp; <br /> Bulk order</p>
            <span className="josefin smallfnt clr1">+91 72003 62436</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Header;
