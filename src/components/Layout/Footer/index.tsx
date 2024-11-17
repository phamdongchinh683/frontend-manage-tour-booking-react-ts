import { FC } from 'react';
import { Link } from 'react-router-dom';
import data from "../../../mock/test.json";
export const Footer: FC = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">About Us</h5>
            <p>
              Discover the world with us! We offer curated tours and experiences to the most breathtaking destinations. Start your adventure today!
            </p>
            <p>
              <i className="fas fa-map-marker-alt me-2"></i> 188 Nguyen Dinh Tuu, Da Nang City, Vietnam
            </p>
            <p>
              <i className="fas fa-envelope me-2"></i> 
              <Link to="/contact" className="text-light text-decoration-none">
                dchinh6803@gmail.com
              </Link>
            </p>
            <p>
              <i className="fas fa-phone-alt me-2"></i> +772573366
            </p>
          </div>

          <div className="col-md-2">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Quick Links</h5>
            <ul className="list-unstyled">
                {data.map((router) =>
                <li>
                <Link to={router.linkRouter} className="text-light text-decoration-none">
                  {router.name}
                </Link>
              </li>
                )}

            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Follow Us</h5>
            <div className="d-flex gap-3">
              <Link to="https://github.com/phamdongchinh683" className="text-light">
                <i className="fab fa-github fa-2x"></i>
              </Link>
              <Link to="https://www.facebook.com/vegetarian2003" className="text-light">
                <i className="fab fa-facebook fa-2x"></i>
              </Link>
              <Link to="https://www.youtube.com/channel/UCjHblajOXON3cu3iiiC2Mow" className="text-light">
                <i className="fab fa-youtube fa-2x"></i>
              </Link>
              <Link to="https://www.instagram.com/phamchinh2003/" className="text-light">
                <i className="fab fa-instagram fa-2x"></i>
              </Link>
            </div>
          </div>

          <div className="col-md-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Site admin</h5>
            <form>
              <div className="mb-3">
                Chinh Chinh
              </div>
              <Link to={"https://www.facebook.com/vegetarian2003"} type="button" className="btn btn-warning w-100">
                Contact
              </Link>
            </form>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6 text-center text-md-start">
            <p>© 2024 TourBooking. All Rights Reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/dashboard" className="text-light text-decoration-none me-3">
              Terms of Service
            </Link>
            <Link to="/dashboard" className="text-light text-decoration-none">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
