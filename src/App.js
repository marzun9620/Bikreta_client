import { Route, Routes } from "react-router-dom";
import { withAuth } from "./auth";
import AddProducts from "./components/AddProducts";
import AdminLogin from './components/AdminLogin/index';
import SalesGraph from './components/AdminPanel/index';
import AdminSignup from './components/AdminSignUp/index';
import UserList from './components/AllUsers/index';
import Cart from './components/Cart';
import CategoryPage from './components/CategoryPage';
import UserPurchases from './components/ClientOrders/index';
import OrderTracker from './components/ERP_Order_Track/OrderTracker';
import OrderStatus from './components/ERP_Order_Track/index';
import EmailVerify from "./components/EmailVerify";
import FrontPage from "./components/FrontPage";
import Login from "./components/Login";
import PaymentModal from './components/PaymentModal/index';
import ProductDetails from './components/ProductDetails';
import ProductList from "./components/ProductList";
import DataFilterVisualization from './components/ProductSellUnderstand/productAnalysis';
import Signup from "./components/Singup";
import UserPurchaseHistory from './components/UserAllProducts/index';
import ProfileViewer from './components/UserProfile/index';
import StatusChange from './components/OderStatusChange/index';
import AnalysisResult from './components/AnalysisResult/index1';
import ErpBill from './components/BillGeneration/index';
import ErpBill1 from './components/BillGeneration/index1';
import MES from './components/Mes/index';
import OutofStockOrder from './components/outOfStockOrder/index';
function App() {
	const user = localStorage.getItem("token");
	const SalesGraphWithAuth = withAuth(SalesGraph);

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
			<Route path="/product/out/:id" exact element={<OutofStockOrder/>} />
			<Route path="/cart" exact element={<Cart/>} />
			<Route path="/category/:category" exact element={<CategoryPage/>} />
			<Route path="/admin" element={<SalesGraphWithAuth />} />

			<Route path="/orders" exact element={<UserPurchases/>} />
			<Route path="/orderStatus" exact element={<OrderStatus/>} />
			<Route path="/payment/:transactionId/:userId/done" exact element={<PaymentModal/>} />
			<Route path="/Admin/Signup" exact element={<AdminSignup/>} />
			<Route path="/Admin/Login" exact element={<AdminLogin/>} />
			<Route path="/Admin/allUsers" exact element={<UserList/>} />
			<Route path="/user/profile/:id" exact element={<ProfileViewer/>} />
			<Route path="/user/:id/product-history/:id" exact element={<UserPurchaseHistory/>} />
			<Route path="/order-tracker/:productId" exact element={<OrderTracker/>} />
			<Route path="/analysis" exact element={<DataFilterVisualization/>} />
			<Route path="/status-change" exact element={<StatusChange/>} />
			<Route path="/analysis_result" exact element={<AnalysisResult/>} />
			<Route path="/bill-generation" exact element={<ErpBill/>} />
			<Route path="/mes" exact element={<MES/>} />
			<Route path="/mes_bill generation" exact element={<ErpBill1/>} />


			


		</Routes>
	);
}

export default App;