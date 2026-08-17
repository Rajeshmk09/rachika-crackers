function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light navbg navfont">
      <div className="container">
        <button
          type="button"
          className="navbar-toggler mx-auto"
          data-bs-toggle="collapse"
          data-bs-target="#myNavbar"
          aria-controls="myNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="text-white">☰ Menu</span>
        </button>
        <div id="myNavbar" className="collapse navbar-collapse navfont">
          <ul className="navbar-nav mr-auto text-center">
            <li className="nav-item px-3 active">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item px-3">
              <a className="nav-link" href="/about">About</a>
            </li>
            <li className="nav-item px-3">
              <a className="nav-link" href="/products">Products</a>
            </li>
            <li className="nav-item px-3">
              <a className="nav-link" href="/safety-tips">Safety Tips</a>
            </li>
            <li className="nav-item px-3">
              <a className="nav-link" href="/contact">Contact</a>
            </li>
            <li className="nav-item px-3">
              <a className="nav-link" href="https://www.metturtransports.com" target="_blank" rel="noreferrer">
                Track Your Order
              </a>
            </li>
            <li className="nav-item px-3 text-center">
              <a className="pricelist_pdf blink" href="/pricelist">
                Download Pricelist
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
