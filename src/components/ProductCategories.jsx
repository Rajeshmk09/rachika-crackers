const categories = [
  {
    img: 'https://sparkstarcrackers.com/images/chakkars.webp',
    name: 'Chakkars',
    desc: 'Chakkar Big, Special, Asoka...',
  },
  {
    img: 'https://sparkstarcrackers.com/images/flowerpots.webp',
    name: 'Flower Pots',
    desc: 'Colour pots small, Big, Special...',
  },
  {
    img: 'https://sparkstarcrackers.com/images/sparklers.webp',
    name: 'Sparklers',
    desc: 'Red, Green, Electric....',
  },
  {
    img: 'https://sparkstarcrackers.com/images/bombs.webp',
    name: 'Single Sound',
    desc: 'Kuruvi, Lakshmi, Spider...',
    wide: true,
  },
  {
    img: 'https://sparkstarcrackers.com/images/giftbox.webp',
    name: 'Gift Boxes',
    desc: 'Special, Deluxe, Grand....',
    wide: true,
  },
];

function ProductCategories() {
  return (
    <div className="container pad">
      <div className="row">

        {/* Left decoration */}
        <div className="col-lg-2 col-md-2 col-12">
          <div className="product-shape">
            <div className="shape1">
              <img
                src="https://sparkstarcrackers.com/images/flowerpots.png"
                className="img-fluid"
                alt="Rachika Crackers"
              />
            </div>
          </div>
        </div>

        {/* Center heading */}
        <div className="col-lg-8 col-md-8 col-12 text-center">
          <h1 className="acme clr bannerhead1 pb-3">Our Best &amp; Trending Products</h1>
          <p className="josefin">
            With over 200 varieties of crackers developed and marketed every year, we are among the most sought
            brands in the Sivakasi region and around the country. Our products are known for their safety and we
            take great efforts to ensure that all our orders are delivered in a standard time frame with an
            economical pricing.
          </p>
        </div>

        {/* Right decoration */}
        <div className="col-lg-2 col-md-2 col-12">
          <div className="product-shape">
            <div className="shape3">
              <img
                src="https://sparkstarcrackers.com/images/sparklers.png"
                className="w-75 img-fluid"
                alt="Rachika Crackers"
              />
            </div>
          </div>
        </div>

        {/* Category cards - first 3 in col-lg-4 */}
        {categories.slice(0, 3).map((cat, i) => (
          <div key={i} className="col-lg-4 col-md-6 secpad text-center">
            <div className="image-feature img-bottom">
              <figure className="wp-caption box-bg">
                <a href="/products">
                  <img className="img-fluid" src={cat.img} alt={cat.name} title={cat.name} />
                </a>
                <figcaption className="widget-image-caption wp-caption-text">
                  <strong className="acme">{cat.name}</strong><br />
                  <div className="pb-2 josefin">{cat.desc}</div>
                  <div className="cat-btn josefin fw-600">Shop Now</div>
                </figcaption>
              </figure>
            </div>
          </div>
        ))}

        {/* Last 2 in col-lg-6 */}
        {categories.slice(3).map((cat, i) => (
          <div key={i} className="col-lg-6 col-md-6 secpad text-center">
            <div className="image-feature">
              <figure className="wp-caption box-bg">
                <a href="/products">
                  <img src={cat.img} className="img-fluid w-100" alt={cat.name} title={cat.name} />
                </a>
                <figcaption className="widget-image-caption wp-caption-text">
                  <strong className="acme">{cat.name}</strong><br />
                  <div className="pb-2 josefin">{cat.desc}</div>
                  <div className="cat-btn josefin fw-600">Shop Now</div>
                </figcaption>
              </figure>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default ProductCategories;
