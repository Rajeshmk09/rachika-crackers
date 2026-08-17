function WhyChooseUs() {
  return (
    <div className="about-area position-relative">
      <div className="container py-5">
        <div className="row">
          {/* Left Text */}
          <div className="col-lg-4 col-md-6 col-12 pt-4 align-self-center mt-3 text-center text-lg-start">
            <h1 className="acme pb-3 clr1 heading1">Why Choose Us?</h1>
            <p className="josefin pb-3 text-muted">
              Whether you're marking a festival, a special occasion, or simply embracing the joy of life,
              our curated collection ensures that your moments shine the brightest.
            </p>
          </div>

          {/* Center Features */}
          <div className="col-lg-5 col-md-6 col-12 pt-4">
            <div className="about-blog">
              {/* Feature 1 */}
              <div className="single-offers d-flex mb-4 p-3 shadow-sm rounded-3 bg-white">
                <div className="icon pe-3 align-self-center" style={{ fontSize: '2rem', color: '#0a539f' }}>
                  🧩
                </div>
                <div className="offers-cap">
                  <div className="heading6 clr1 acme fw-bold">Superior Quality</div>
                  <p className="josefin mb-0 text-secondary" style={{ fontSize: '0.85rem' }}>
                    Fine Quality Products &amp; innovation are the key behind our success.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="single-offers d-flex p-3 shadow-sm rounded-3 bg-white">
                <div className="icon pe-3 align-self-center" style={{ fontSize: '2rem', color: '#0a539f' }}>
                  🪄
                </div>
                <div className="offers-cap">
                  <div className="heading6 clr1 acme fw-bold">Safe to Use</div>
                  <p className="josefin mb-0 text-secondary" style={{ fontSize: '0.85rem' }}>
                    Crackers we offer are safe &amp; are made from fine quality raw materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Right Image (Desktop Only) */}
        <div className="about-shape d-none d-lg-block position-absolute" style={{ right: '0', bottom: '10px', zIndex: 1 }}>
          <img
            src="https://sparkstarcrackers.com/images/giftboxesnew.webp"
            className="img-fluid w-75"
            alt="Crackers Gift Boxes"
            title="Crackers"
          />
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUs;
