import { Route, Routes, Navigate } from "react-router-dom";
import ProductList from "./components/ProductList";
import AddProducts from "./components/AddProducts";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import FrontPage from "./components/FrontPage";
import EmailVerify from "./components/EmailVerify";
import ProductDetails from './components/ProductDetails'
import Cart from './components/Cart';
import CategoryPage from './components/CategoryPage';
import SalesGraph from './components/AdminPanel/index';
import AAdmin from './components/AdminHeader/index';
import UserPurchases from './components/ClientOrders/index';
import OrderStatus from './components/ERP_Order_Track/index';
import PaymentModal from './components/PaymentModal/index';
import AdminSignup from './components/AdminSignUp/index';
import AdminLogin from './components/AdminLogin/index';
import ProfileViewer from'./components/UserProfile/index';

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<ProductList/>} />}
			<Route path="/signup" exact element={<Signup />} />
<Route path="/login" exact element={<Login />} />
			<Route path="/" exact element={<ProductList />} />
            <Route path="/addproducts" exact element={<AddProducts />} />
            <Route path="/productlist" exact element={<ProductList />} />
			<Route path="/frontpage" exact element={<FrontPage />} />
			<Route path="/users/:id/verify/:token" element={<EmailVerify />} />
			<Route path="/product/:id" exact element={<ProductDetails/>} />
			<Route path="/cart" exact element={<Cart/>} />
			<Route path="/category/:category" exact element={<CategoryPage/>} />
			<Route path="/admin" exact element={<SalesGraph/>} />
			<Route path="/orders" exact element={<UserPurchases/>} />
			<Route path="/orderStatus" exact element={<OrderStatus/>} />
			<Route path="/payment/done" exact element={<PaymentModal/>} />
			<Route path="/Admin/Signup" exact element={<AdminSignup/>} />
			<Route path="/Admin/Login" exact element={<AdminLogin/>} />
			<Route path="/user/profile/:id" exact element={<ProfileViewer/>} />

			


		</Routes>
	);
}

export default App;