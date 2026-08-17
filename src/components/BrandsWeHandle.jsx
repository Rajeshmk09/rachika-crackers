const BRANDS = [
  { name: 'Vadivel', img: 'https://sparkstarcrackers.com/images/vadivel.png' },
  { name: 'Spark Star', img: 'https://sparkstarcrackers.com/images/sparkstar.png' },
  { name: 'Standard', img: 'https://sparkstarcrackers.com/images/standard.png' },
  { name: 'Anil', img: 'https://sparkstarcrackers.com/images/anil.png' },
  { name: 'Ananda', img: 'https://sparkstarcrackers.com/images/ananda.png' },
  { name: 'Elephant', img: 'https://sparkstarcrackers.com/images/elephant.png' },
];

function BrandsWeHandle() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-12 text-center align-self-center">
          <h1 className="acme clr bannerhead1">Brands We Handle</h1>
          <p className="josefin text-secondary">
            We provide all top branded deepavali crackers &amp; other occasional Fire crackers...
          </p>
        </div>

        {/* Brands scroll/display container */}
        <div className="col-12 mt-4">
          <div className="brands-marquee-wrapper">
            <div className="brands-marquee-track">
              {/* Double up the list for infinite looping */}
              {[...BRANDS, ...BRANDS].map((brand, idx) => (
                <div key={idx} className="brand-item-box text-center">
                  <img
                    src={brand.img}
                    className="img-fluid brand-img-logo"
                    alt={brand.name}
                    title={brand.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandsWeHandle;
