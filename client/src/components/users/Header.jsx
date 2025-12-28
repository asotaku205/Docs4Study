import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import authService from "../../services/authService";

export function Header() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("accessToken");

        if (storedUser && storedToken) {
          const parsedData = JSON.parse(storedUser);
          setUser(parsedData);
          setIsLoggedIn(true);
          if(parsedData.role && parsedData.role.toLowerCase() === "admin"){
            setIsAdmin(true);
          }
          
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            if(userData.role && userData.role.toLowerCase() === "admin"){
              setIsAdmin(true);
            }
          } catch (apiError) {
            console.log("Failed to fetch fresh user data, using cached data");
          }
        }
        
      } catch (error) {
        console.error("Error in fetchUser:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
      }
    };

    fetchUser();
  }, []);
  const handleLogout = () => {
    try {
      const logOut = authService.signout();
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      window.location.href = "/home";
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className=" flex sticky top-0 backdrop-blur bg-background/30 w-full z-50 ">
      <div className="flex-grow p-4 px-4 justify-between flex items-center mx-auto container">
        <Link href="/">
          <a className="text-2xl font-bold cursor-pointer gap-2 flex items-center select-none">
            <span className="bg-primary text-white px-2 py-1 rounded font-heading">
              D4S
            </span>
            Docs4Study
          </a>
        </Link>
        <nav className=" gap-8 flex items-center text-white">
          <a className="text-muted-foreground hover:text-primary cursor-pointer select-none">
            Home
          </a>
          <a className="text-muted-foreground hover:text-primary cursor-pointer select-none">
            Blogs
          </a>
          <a className="text-muted-foreground hover:text-primary cursor-pointer select-none">
            Cources
          </a>
          <a className="text-muted-foreground hover:text-primary cursor-pointer select-none">
            Documents
          </a>
        </nav>
        <div className="gap-4 flex items-center">
          <div className="relative">
            <button
              className=" text-primary px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors text-muted-foreground hover:text-foreground "
              onClick={() => {
                setSearchOpen(!searchOpen);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search h-5 w-5"
                aria-hidden="true"
              >
                <path d="m21 21-4.34-4.34"></path>
                <circle cx="11" cy="11" r="8"></circle>
              </svg>
            </button>
            {searchOpen && (
              <div className="absolute top-full mt-4 right-0 w-80 bg-card p-4 rounded-lg shadow-lg">
                <input
                  type="text"
                  placeholder="Search blogs, courses, documents..."
                  className=" p-2 w-full rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-muted-foreground text-center py-4 text-xs">Start typing to search...</p>
              </div>
            )}
          </div>
          <div className="h-6 w-px bg-border cursor-pointer"></div>

          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                }}
              >
                {user?.fullName}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-4 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-2">
                  <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                    <button >
                      Profile
                    </button>
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                    <button >
                      Settings
                    </button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                      <button >
                        Admin Dashboard
                      </button>
                    </Link>
                  )}
                  <Link className="block px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer select-none">
                  <button
                    onClick={handleLogout}
                    
                  >
                    Logout
                  </button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Link href="/auth">
                <a className="text-foreground py-2 px-4 cursor-pointer select-none">
                  Log in
                </a>
              </Link>
              <Link href="/auth">
                <a className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors cursor-pointer select-none">
                  Sign up
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
