
import{NavLink} from 'react-router-dom'
import "./Navbar.css"
function Navbar(){
return(
    <div className="nav">
        <div className='heading'>
        <h1>BloggingSite</h1>
        </div>
         <div className="navbar">
            <ul >
                <li><NavLink to={"/"} className={"navbar-link"}>Home</NavLink></li>
                <li><NavLink to={'/register'} className={"navbar-link"}>Register</NavLink></li>
                <li><NavLink to={'/create'} className={"navbar-link"}>Write</NavLink></li>
                <li><NavLink to={'/login'} className={"navbar-link"}>Sign In</NavLink></li>
                {/* <li><NavLink to={'/contact'} className={"navbar-link"}>ContactUs</NavLink></li> */}
            </ul>
        </div>

    </div>
)
}
export default Navbar