import React from "react";
import { Link, useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMagnifyingGlass, 
  faUser, 
  faGear, 
  faUserTie, 
  faArrowRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../hooks/useAuth";
import { useToggle } from "../../hooks/useToggle";

const NavLink = ({ href, currentLocation, children }) => {
  const isActive = currentLocation === href;
  return (
    <Link href={href} className={`${isActive ? 'text-primary font-bold' : 'text-muted-foreground'} hover:text-primary cursor-pointer select-none`}>
      {children}
    </Link>
  );
};

export function Header() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const searchMenu = useToggle(false);
  const userMenu = useToggle(false);
  const [location] = useLocation();

  return (
    <header className="flex sticky top-0 backdrop-blur bg-background/30 w-full z-50">
      <div className="flex-grow p-4 px-4 justify-between flex items-center mx-auto container">
        
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer gap-2 flex items-center select-none">
            <span className="bg-primary text-white px-2 py-1 rounded font-heading">
              D4S
            </span>
            Docs4Study
          </div>
        </Link>

        <nav className="gap-8 flex items-center text-white">
          <NavLink href="/" currentLocation={location}>Home</NavLink>
          <NavLink href="/blog" currentLocation={location}>Blogs</NavLink>
          <NavLink href="/courses" currentLocation={location}>Courses</NavLink>
          <NavLink href="/documents" currentLocation={location}>Documents</NavLink>
        </nav>

        <div className="gap-4 flex items-center">
          {/* Search Button */}
          <div className="relative">
            <button
              className="text-primary px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
              onClick={searchMenu.toggle}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            {searchMenu.value && (
              <div className="absolute top-full mt-4 right-0 w-80 bg-card p-4 rounded-lg shadow-lg">
                <form action="/search" method="GET">
                  <input
                    type="text"
                    placeholder="Search blogs, courses, documents..."
                    className="p-2 w-full rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-muted-foreground text-center py-4 text-xs">
                    Start typing to search...
                  </p>
                </form>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-border cursor-pointer"></div>
          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onClick={userMenu.toggle}
              >
                <FontAwesomeIcon icon={faUser} className="bg-muted-foreground/20 rounded-full p-2" />
                {user?.fullName}
              </button>
              {userMenu.value && (
                <div className="absolute right-0 top-full mt-4 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-2">
                  <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                    <button>
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Profile
                    </button>
                  </Link>
                  <Link href="/profile?tab=Setting" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                    <button>
                      <FontAwesomeIcon icon={faGear} className="mr-2" />
                      Settings
                    </button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                      <button>
                        <FontAwesomeIcon icon={faUserTie} className="mr-2" style={{color: "#FFD43B"}} />
                        Admin 
                      </button>
                    </Link>
                  )}
                  <Link className="block px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer select-none">
                    <button onClick={logout}>
                      <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" style={{color: "#ff0000"}} />
                      Logout
                    </button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth" className="text-foreground py-2 px-4 cursor-pointer select-none">
                Log in
              </Link>
              <Link href="/auth" className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors cursor-pointer select-none">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
