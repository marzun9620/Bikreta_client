import { Route, Routes } from "react-router-dom";
import AddProducts from "./components/AddProducts";
import AAdmin from './components/AdminHeader/index';
import Cart from './components/Cart';
import CategoryPage from './components/CategoryPage';
import UserPurchases from './components/ClientOrders/index';
import OrderStatus from './components/ERP_Order_Track/index';
import EmailVerify from "./components/EmailVerify";
import FrontPage from "./components/FrontPage";
import Login from "./components/Login";
import PaymentModal from './components/PaymentModal/index';
import ProductDetails from './components/ProductDetails';
import ProductList from "./components/ProductList";
import Signup from "./components/Singup";


function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<ProductList />} />}
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
			<Route path="/admin" exact element={<AAdmin/>} />
			<Route path="/orders" exact element={<UserPurchases/>} />
			<Route path="/orderStatus" exact element={<OrderStatus/>} />
			<Route path="/payment/done" exact element={<PaymentModal/>} />

		
		</Routes>
	);
}

export default App;