import React from "react";
import { Link } from "wouter";
import { Header } from "./users/Header.jsx";
import Footer from "./users/Footer.jsx";


const Layout = ({ children }) => {
  return(
  <>
    <Header />
    <main className="flex flex-col flex-1 ">

      {children}
    
    </main>
    <Footer />
  </>

  );

}

export default Layout;
