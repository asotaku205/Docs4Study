import React from "react";
import { Link } from "wouter";
import { Header } from "./users/Header.jsx";
import Footer from "./users/Footer.jsx";


const Layout = ({ children }) => {
  return(
  <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
    <Header />
    <main className="flex flex-col flex-1 ">

      {children}
    
    </main>
    <Footer />
  </div>

  );

}

export default Layout;
