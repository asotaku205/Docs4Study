import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import authService from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass,faUser } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export function Header() {
  const [user, setUser] = useState(() =>{
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!(localStorage.getItem("accessToken") && localStorage.getItem("user"));
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedData = JSON.parse(storedUser);
      return parsedData.role && parsedData.role.toLowerCase() === "admin";
    }
    return false;
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [islocation] = useLocation();
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
      window.location.href = "/";
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
          <Link href="/">
          <a className={`${ islocation === '/' ? 'text-primary font-bold' : 'text-muted-foreground'} hover:text-primary cursor-pointer select-none`}>
            Home
          </a>
          </Link>
          <Link href="/blog">
          <a className={`${ islocation === '/blog' ? 'text-primary font-bold' : 'text-muted-foreground'} hover:text-primary cursor-pointer select-none`}>
            Blogs
          </a>
          </Link>
          <Link href="/courses">
          <a className={`${ islocation === '/courses' ? 'text-primary font-bold' : 'text-muted-foreground'} hover:text-primary cursor-pointer select-none`}>
            Courses
          </a>
          </Link>
          <Link href="/documents">
          <a className={`${ islocation === '/documents' ? 'text-primary font-bold' : 'text-muted-foreground'} hover:text-primary cursor-pointer select-none`}>
            Documents
          </a>
          </Link>
        </nav>
        <div className="gap-4 flex items-center">
          <div className="relative">
            <button
              className=" text-primary px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors text-muted-foreground hover:text-foreground "
              onClick={() => {
                setSearchOpen(!searchOpen);
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
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
                <FontAwesomeIcon icon={faUser} className="bg-muted-foreground/20 rounded-full p-2" />
                {user?.fullName}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-4 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-2">
                  <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                    <button >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Profile
                    </button>
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                    <button >
                      <FontAwesomeIcon icon={faGear} className="mr-2" />
                      Settings
                    </button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                      <button >
                        <FontAwesomeIcon icon={faUserTie} className="mr-2" style={{color: "#FFD43B",}} />
                        Admin 
                      </button>
                    </Link>
                  )}
                  <Link className="block px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer select-none">
                  <button
                    onClick={handleLogout}
                    
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" style={{color: "#ff0000",}} />
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
