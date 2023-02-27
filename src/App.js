
import { BrowserRouter, Route ,Routes} from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Register from './Pages/Register';
import Create from './Pages/Create';
import Login from './Pages/Login';
import Protected from './Components/Protected';
function App() {
  return (
    <div className="App">
      <ToastContainer position='top-center'/>
      <BrowserRouter>
      <Navbar/>
     <Routes>
      <Route path='/' element={<Protected Component={Home}/>}></Route>
      <Route path='/register' element={<Register/>}/>
      <Route path='/create' element={<Protected Component={Create}/>}/>
      <Route path='/login' element={<Login/>}/>
     </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
