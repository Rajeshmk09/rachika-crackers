function MarqueeBar() {
  const text = `🚨 Important Update! 🚨 The RACHIKA CRACKERS website will be closing this coming Sunday! 🧨 Kindly place your orders as soon as possible to avoid missing out. Due to increased transport charges and unfavorable weather conditions, we are closing earlier than usual. 🙏 Thank you for your continued support! For instant 90% discounts, offers call us now :- +91 72003 62436. Diwali sale is open now. Please buy early to get best discounts Happy Diwali....!!!! NOTE:-25.09.2025 ONWARDS ALL COMBO'S PACKS CLOSED & "Home delivery is not available — please come and pick it up from the local hub."`

  return (
    <div className="sectionbg">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 px-0">
            <div className="py-2 px-2 marquee-bar" style={{ backgroundColor: '#0a539f', color: '#ffffff' }}>
              <div className="marquee-track">
                <span>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span aria-hidden="true">{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarqueeBar;
