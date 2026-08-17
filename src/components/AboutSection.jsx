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
      <div className="row justify-content-center">
        <div className="col-lg-10 col-12">
          <div className="row justify-content-center text-center">
            
            <div className="col-lg-12 mb-4">
              <h1 className="acme clr1 display-5 fw-bold">Rachika Crackers</h1>
              <div className="heading5 acme mt-1 text-secondary">
                We're providing the best quality crackers in town.
              </div>
              <div className="title title-border mx-auto my-3"></div>
              <p className="josefin text-muted">
                Discover an extensive selection of firecrackers to illuminate your celebrations with dazzling displays.
              </p>
            </div>

            {/* Since */}
            <div className="col-lg-4 col-md-4 col-12 my-3">
              <div className="count-box">
                <ul id="counter" className="fullpad list-unstyled m-0">
                  <li className="mb-2">
                    <span style={{ fontSize: '2rem' }}>❤️</span>
                  </li>
                  <li>
                    <Counter target={2014} />
                  </li>
                  <p className="acme josefin txt-danger mb-0">SINCE</p>
                </ul>
              </div>
            </div>

            {/* Happy Clients */}
            <div className="col-lg-4 col-md-4 col-12 my-3">
              <div className="count-box">
                <ul id="counter" className="fullpad list-unstyled m-0">
                  <li className="mb-2">
                    <span style={{ fontSize: '2rem' }}>👥</span>
                  </li>
                  <li>
                    <Counter target={500} suffix="+" />
                  </li>
                  <p className="acme josefin txt-danger mb-0">HAPPY CLIENTS</p>
                </ul>
              </div>
            </div>

            {/* Satisfaction */}
            <div className="col-lg-4 col-md-4 col-12 my-3">
              <div className="count-box">
                <ul id="counter" className="fullpad list-unstyled m-0">
                  <li className="mb-2">
                    <span style={{ fontSize: '2rem' }}>👍</span>
                  </li>
                  <li>
                    <Counter target={100} suffix="%" />
                  </li>
                  <p className="acme josefin txt-danger mb-0">SATISFACTION</p>
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
