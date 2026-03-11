import React, { useState } from "react";
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
import { useLanguage } from "../../i18n/LanguageContext";
import { getAvatarUrl } from "../../utils/url";
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
  const { t } = useLanguage();
  const searchMenu = useToggle(false);
  const userMenu = useToggle(false);
  const [location, setLocation] = useLocation();
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

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
          <NavLink href="/" currentLocation={location}>{t.nav.home}</NavLink>
          <NavLink href="/blog" currentLocation={location}>{t.nav.blogs}</NavLink>
          <NavLink href="/courses" currentLocation={location}>{t.nav.courses}</NavLink>
          <NavLink href="/documents" currentLocation={location}>{t.nav.documents}</NavLink>
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
              <div className="absolute top-full mt-4 right-0 w-80 bg-card p-4 rounded-lg shadow-lg border border-border">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (headerSearchQuery.trim()) {
                    setLocation(`/search?q=${encodeURIComponent(headerSearchQuery.trim())}`);
                    searchMenu.toggle();
                    setHeaderSearchQuery("");
                  }
                }}>
                  <input
                    type="text"
                    value={headerSearchQuery}
                    onChange={(e) => setHeaderSearchQuery(e.target.value)}
                    placeholder={t.nav.searchPlaceholder}
                    className="p-2 w-full rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    autoFocus
                  />
                  <p className="text-muted-foreground text-center py-4 text-xs">
                    {t.nav.pressEnter}
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
                <img
                  src={getAvatarUrl(user?.avatar, user?.fullName)}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full object-cover border border-border"
                />
                {user?.fullName}
              </button>
              {userMenu.value && (
                <div className="absolute right-0 top-full mt-4 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-2">
                  <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                    <button>
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      {t.nav.profile}
                    </button>
                  </Link>
                  <Link href="/profile?tab=Setting" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                    <button>
                      <FontAwesomeIcon icon={faGear} className="mr-2" />
                      {t.nav.settings}
                    </button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer select-none">
                      <button>
                      <FontAwesomeIcon icon={faUserTie} className="mr-2" style={{color: "#FFD43B"}} />
                        {t.nav.admin} 
                      </button>
                    </Link>
                  )}
                  <Link className="block px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer select-none">
                    <button onClick={logout}>
                      <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" style={{color: "#ff0000"}} />
                      {t.nav.logout}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth" className="text-foreground py-2 px-4 cursor-pointer select-none">
                {t.nav.login}
              </Link>
              <Link href="/auth" className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors cursor-pointer select-none">
                {t.nav.signup}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
