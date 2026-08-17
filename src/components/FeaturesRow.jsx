const features = [
  {
    icon: 'https://sparkstarcrackers.com/images/icon1.png',
    title: 'MINIMUM ORDER VALUE',
    desc: '₹ 3000 (TN, BLRE & PY)',
  },
  {
    icon: 'https://sparkstarcrackers.com/images/icon2.png',
    title: 'SAFE TO USE',
    desc: 'Crackers are safe to use',
  },
  {
    icon: 'https://sparkstarcrackers.com/images/icon3.png',
    title: 'OTHER STATES',
    desc: 'Minimum Order ₹ 6,000',
  },
  {
    icon: 'https://sparkstarcrackers.com/images/icon4.png',
    title: 'QUALITY ASSURED',
    desc: 'Assured Quality Packing',
  },
];

function FeaturesRow() {
  return (
    <div className="container pt-5">
      <div className="row">
        {features.map((f, i) => (
          <div key={i} className="col-lg-3 col-md-6 col-12">
            <div className="box-border">
              <div className="d-flex">
                <div className="hicon">
                  <img src={f.icon} className="img-fluid w-75" alt={f.title} title={f.title} />
                </div>
                <div className="icon-info align-self-center">
                  <div className="top-bx-txt acme clr-red">{f.title}</div>
                  <div className="josefin smallfnt">{f.desc}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesRow;
