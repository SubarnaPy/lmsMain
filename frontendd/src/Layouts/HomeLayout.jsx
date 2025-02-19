
import Footer from "../Components/Footer/footer";


import Navbar from "../Components/Navbar.jsx/Navbar";


const Layout = ({ children }) => {
  
  return (
    <div className="overflow-hidden ">

    
      
    
      <Navbar /> 
        

      

      {children}

      {/* adding the footer content */}
      
      <Footer />
    </div>
  );
};

export default Layout;
