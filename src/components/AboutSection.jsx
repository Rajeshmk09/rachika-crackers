import { useEffect, useRef, useState } from 'react';

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const step = Math.ceil(target / 80);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(current);
        }, 25);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="count percent counttext acme">{count}{suffix}</span>;
}

function AboutSection() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">

        {/* Left image column - visible on large screens */}
        <div className="col-lg-5 d-none d-lg-block">
          <img
            src="https://sparkstarcrackers.com/images/count-side.webp"
            className="img-fluid"
            alt="festival crackers shop"
          />
        </div>

        {/* Right content column */}
        <div className="col-lg-7 col-12">
          <div className="row justify-content-center">
            
            <div className="col-lg-12 mb-4">
              <h1 className="acme clr-orange display-5 fw-bold mb-1">Rachika Crackers</h1>
              <div className="heading5 fw-bold text-dark mt-1" style={{ fontSize: '1.2rem' }}>
                We're providing the best quality crackers in town.
              </div>
              <div className="thin-line my-3"></div>
              <p className="josefin text-secondary py-2" style={{ fontSize: '0.95rem' }}>
                Discover an extensive selection of firecrackers to illuminate your celebrations with dazzling displays.
              </p>
            </div>

            {/* Since Card */}
            <div className="col-md-6 col-12 my-4">
              <div className="custom-count-card">
                <div className="card-top-icon">❤️</div>
                <div className="card-body-content">
                  <Counter target={2014} />
                  <div className="card-label">SINCE</div>
                </div>
              </div>
            </div>

            {/* Happy Clients Card */}
            <div className="col-md-6 col-12 my-4">
              <div className="custom-count-card">
                <div className="card-top-icon">👤</div>
                <div className="card-body-content">
                  <Counter target={500} suffix="+" />
                  <div className="card-label">HAPPY CLIENTS</div>
                </div>
              </div>
            </div>

            {/* Satisfaction Card */}
            <div className="col-md-6 col-12 my-4">
              <div className="custom-count-card">
                <div className="card-top-icon">👤</div>
                <div className="card-body-content">
                  <Counter target={100} suffix="%" />
                  <div className="card-label">SATISFACTION</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
