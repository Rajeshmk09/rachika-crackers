function FloatingButtons() {
  const phone = '917200362436';

  return (
    <>
      {/* WhatsApp Float */}
      <div className="fixed-point w0">
        <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">
          <img
            src="https://sparkstarcrackers.com/images/whatsappicon.png"
            className="priceicn1 float-left"
            alt="WhatsApp Chat"
          />
        </a>
      </div>

      {/* Call Float (Desktop) */}
      <div className="fixed-point1 w0 d-none d-lg-block">
        <span className="time-of-year position-relative">
          <img
            src="https://sparkstarcrackers.com/images/callicon.png"
            className="priceicn1 float-left"
            alt="Call Us"
          />
          <div className="call-tooltip text-white text-center">
            For More Details Call <br />
            +91 72003 62436
          </div>
        </span>
      </div>

      {/* Call Float (Mobile) */}
      <div className="fixed-point1 w0 d-lg-none">
        <a href={`tel:+917200362436`}>
          <img
            src="https://sparkstarcrackers.com/images/callicon.png"
            className="priceicn1 float-left"
            alt="Call"
          />
        </a>
      </div>

      {/* Quick Purchase Float */}
      <div className="fixed-point2">
        <a href="/products">
          <img
            src="https://sparkstarcrackers.com/images/quickpurchase.png"
            className="priceicn2 float-right blink"
            alt="Quick Purchase"
          />
        </a>
      </div>
    </>
  );
}

export default FloatingButtons;
