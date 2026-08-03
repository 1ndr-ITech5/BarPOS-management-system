import Home from "./pages/Home.jsx";
import Header from "./layout/Header.jsx";
import Navbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";
import './App.css';

const App = () => {
    return(
      <div className='app'>
          <Header/>
          <Navbar/>
          <main>
            <Home/>
          </main>
          <Footer/>
      </div>
    )
}

export default App;