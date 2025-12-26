import React from 'react';
import { Link } from 'wouter';

export function Header() {
    return(<header className=" flex sticky top-0 backdrop-blur bg-background/30 w-full ">
        <div className="flex-grow p-4 px-4 justify-between flex items-center">
          <Link href="/">
            <a className="text-2xl font-bold cursor-pointer gap-2 flex items-center select-none">
              <span className="bg-primary text-white px-2 py-1 rounded font-heading">
                D4S
              </span>
              Docs4Study
            </a>
          </Link>
          <nav className=" gap-8 flex items-center text-white">
            <a className="text-muted-foreground hover:text-primary cursor-pointer select-none">Home</a>
            <a className="text-muted-foreground hover:text-primary cursor-pointer select-none">Blogs</a>
            <a className="text-muted-foreground hover:text-primary cursor-pointer select-none">Cources</a>
            <a className="text-muted-foreground hover:text-primary cursor-pointer select-none">Documents</a>
          </nav>
          <div className="gap-4 flex items-center">
            <button className=" text-primary px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search h-5 w-5" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
            </button>
            <Link href="/auth">
              <a className="text-foreground py-2 px-4 cursor-pointer select-none">Log in</a>
            </Link>
            <Link href="/auth">
            <a className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors cursor-pointer select-none">Sign up</a>
            </Link>
          </div>
        </div>
      </header>
      );
}