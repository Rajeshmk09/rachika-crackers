function ParallaxCTA() {
  return (
    <div className="homeparallax">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center py-5">
            <h1 className="acme white-text">
              We are one of the leading sellers of Sivakasi Firecrackers
            </h1>
            <p className="josefin white-text">
              Available 24×7 Support. Order and let's celebrate!
            </p>
            <a
              href={`https://wa.me/917200362436`}
              target="_blank"
              rel="noreferrer"
              className="btn btn1 josefin mt-3"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParallaxCTA;
