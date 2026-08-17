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
      <div className="row">

        {/* Left image - hidden on mobile */}
        <div className="col-lg-6 col-md-12 col-12 align-self-center d-md-none d-lg-block">
          <img
            src="https://sparkstarcrackers.com/images/count-side.webp"
            className="img-fluid"
            alt="festival crackers shop"
            title="festival crackers shop"
          />
        </div>

        {/* Right content */}
        <div className="col-lg-6 col-md-12 col-12">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <h1 className="acme clr1">Rachika Crackers</h1>
              <div className="heading5 acme mt-1">We're providing the best quality crackers in town.</div>
              <div className="title title-border"></div>
              <p className="josefin">
                Discover an extensive selection of firecrackers to illuminate your celebrations with dazzling displays.
              </p>
            </div>

            <div className="col-lg-6 col-md-4 col-12 my-3">
              <div className="count-box">
                <ul id="counter" className="fullpad raleway">
                  <li>
                    <Counter target={2014} />
                  </li>
                  <p className="acme josefin txt-danger">SINCE</p>
                </ul>
              </div>
            </div>

            <div className="col-lg-6 col-md-4 col-12 my-3">
              <div className="count-box">
                <ul id="counter" className="fullpad raleway">
                  <li>
                    <Counter target={500} suffix="+" />
                  </li>
                  <p className="acme josefin txt-danger">HAPPY CLIENTS</p>
                </ul>
              </div>
            </div>

            <div className="col-lg-6 col-md-4 col-12 my-3">
              <div className="count-box">
                <ul id="counter" className="fullpad raleway">
                  <li>
                    <Counter target={100} suffix="%" />
                  </li>
                  <p className="acme josefin txt-danger">SATISFACTION</p>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
