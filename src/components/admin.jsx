import "./admin.css";
import { useState, useEffect } from 'react';
import DataService from '../services/dataService';

const Admin = () => {
  const [product, setProduct] = useState({});
  const [coupon, setCoupon] = useState({});
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [allCoupons, setAllCoupons] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    retrieveCoupons();
    retrieveProducts();
  }, []);

  const retrieveProducts = async () => {
    let service = new DataService();
    let prods = await service.getCatalog();
    setAllProducts(prods);
  };

  const retrieveCoupons = async () => {
    let service = new DataService();
    let coupons = await service.getCoupons();
    setAllCoupons(coupons);
  };

  const handleTextChange = (e) => {
    let copy = { ...product };
    copy[e.target.name] = e.target.value;

    setProduct(copy);
  };

  const handleCouponChange = (e) => {
    let copy = { ...coupon };
    copy[e.target.name] = e.target.value;

    setCoupon(copy);
  };

  const showError = (text) => {
    setErrorMessage(text);
    setErrorVisible(true);
  };

  const handleSaveProduct = async () => {
    // validations
    if (product.title.length < 5) {
      showError('Error, Title should have at least 5 chars');
      return;
    }

    if (!product.image) {
      showError('Error, Image can not be empty');
      return;
    }

    if (!product.category) {
      showError('Error, Category can not be empty');
      return;
    }

    let savedProduct = { ...product };
    savedProduct.price = parseFloat(product.price);

    if (!savedProduct.price || savedProduct.price < 1) {
      showError('Error, Price should be greater than $1');
      return;
    }

    setErrorVisible(false);

    // send product to Server
    let service = new DataService();
    let res = await service.saveProduct(savedProduct);
    console.log('Saved', res);

    // add the product to the state var
    let copy = [...allProducts];
    copy.push(res);
    setAllProducts(copy);
  };

  const handleSaveCoupon = async () => {
    console.log(coupon);

    let savedCoupon = { ...coupon };
    savedCoupon.discount = parseFloat(savedCoupon.discount);

    // validations:
    // 1 discount cant not be greater than 35%
    if (!savedCoupon.discount || savedCoupon.discount > 35) {
      showError('Error, discount can not be lower than 1 or greater than 35%');
      return;
    }

    // 2 code should have at least 5 chars
    if (savedCoupon.code.length < 5) {
      showError('Error, code should contain at least 5 characters');
      return;
    }

    setErrorVisible(false);

    // send coupon to Server
    let service = new DataService();
    let res = await service.saveCoupon(savedCoupon);
    console.log(res);

    // also, add the savedCoupon to allCoupons state var
    let copy = [...allCoupons];
    copy.push(res);
    setAllCoupons(copy);
  };

  return (
    <div className="admin-page">
      {errorVisible ? <div className="alert alert-danger">{errorMessage}</div> : null}

      <div className="sections-container">
        <section className="sec-products">
          <h4>Manage Products</h4>

          <div className="form">
            <div className="my-control">
              <label>Title:</label>
              <input onChange={handleTextChange} name="title" type="text" />
            </div>

            <div className="my-control">
              <label>Image:</label>
              <input onChange={handleTextChange} name="image" type="text" />
            </div>

            <div className="my-control">
              <label>Category:</label>
              <input onChange={handleTextChange} name="category" type="text" />
            </div>

            <div className="my-control">
              <label>Price:</label>
              <input onChange={handleTextChange} name="price" type="number" />
            </div>

            <div className="my-control">
              <button onClick={handleSaveProduct} className="btn btn-dark">
                Register Product
              </button>
            </div>
          </div>

          <div className="prod-list">
            <ul>
              {allProducts.map((prod) => (
                <li key={prod._id}>
                  {prod.title} - ${prod.price}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec-coupons">
          <h4>Manage Coupon Codes</h4>

          <div className="form">
            <div className="my-control">
              <label>Coupon Code:</label>
              <input onChange={handleCouponChange} name="code" type="text" />
            </div>

            <div className="my-control">
              <label>Discount:</label>
              <input onChange={handleCouponChange} name="discount" type="number" />
            </div>

            <div className="my-control">
              <button onClick={handleSaveCoupon} className="btn btn-dark">
                Register Coupon
              </button>
            </div>
          </div>

          <div className="coupon-list">
            <ul>
              {allCoupons.map((coupon) => (
                <li key={coupon._id}>
                  {coupon.code} - {coupon.discount}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
