function HeroCarousel() {
  const desktopSlides = [
    'https://r2.sriseosolutions.com/sparkstarcrackers.com/upload/home_banner_29_07_2025_07_08_07.webp',
    'https://r2.sriseosolutions.com/sparkstarcrackers.com/upload/home_banner_29_07_2025_07_08_38.webp',
  ];

  const mobileSlides = [
    'https://r2.sriseosolutions.com/sparkstarcrackers.com/upload/mobile_banner_29_07_2025_07_05_21.webp',
    'https://r2.sriseosolutions.com/sparkstarcrackers.com/upload/mobile_banner_29_07_2025_07_05_30.webp',
    'https://r2.sriseosolutions.com/sparkstarcrackers.com/upload/mobile_banner_29_07_2025_07_07_19.webp',
  ];

  return (
    <>
      {/* Desktop Carousel */}
      <div id="myCarousel" className="carousel slide d-none d-md-block" data-bs-ride="carousel" data-bs-interval="3000">
        <ol className="carousel-indicators">
          {desktopSlides.map((_, i) => (
            <li key={i} data-bs-target="#myCarousel" data-bs-slide-to={i} className={i === 0 ? 'active' : ''} />
          ))}
        </ol>
        <div className="carousel-inner">
          {desktopSlides.map((src, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <img
                src={src}
                onClick={() => window.location.href = '/products'}
                style={{ cursor: 'pointer' }}
                className="img-fluid w-100 d-block"
                alt="Rachika Crackers Banner"
              />
            </div>
          ))}
        </div>
        <a className="carousel-control-prev" href="#myCarousel" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </a>
        <a className="carousel-control-next" href="#myCarousel" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </a>
      </div>

      {/* Mobile Carousel */}
      <div id="myCarousel1" className="carousel slide d-md-none" data-bs-ride="carousel" data-bs-interval="3000">
        <ol className="carousel-indicators">
          {mobileSlides.map((_, i) => (
            <li key={i} data-bs-target="#myCarousel1" data-bs-slide-to={i} className={i === 0 ? 'active' : ''} />
          ))}
        </ol>
        <div className="carousel-inner">
          {mobileSlides.map((src, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <img src={src} className="img-fluid w-100 d-block" alt="Rachika Crackers Banner" />
            </div>
          ))}
        </div>
        <a className="carousel-control-prev" href="#myCarousel1" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </a>
        <a className="carousel-control-next" href="#myCarousel1" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </a>
      </div>
    </>
  );
}

export default HeroCarousel;
