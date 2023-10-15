"use client";

import { AuthModal,Auth } from "@/components/auth";
import { config } from "@/constant";

export default function Header() {
  let navList:Array<React.ReactNode> = []
  config.navs.forEach(item => {
    navList.push(<li key={item.key}><a href={item.path}>{item.name}</a></li>)
  })

  return (
    <>
    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
    <div className="flex justify-center">
      <div className="navbar bg-base-100 max-w-[1200px]">
        <div className="navbar-start">
          <div className="flex-none lg:hidden">
          <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>
        </div> 
          <a className="btn btn-ghost normal-case text-xl" href="/">NOJ</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navList}
          </ul>
        </div>
        <div className="navbar-end">
          <AuthModal />
        </div>
      </div>
    </div>
    <div className="drawer-side z-40">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
        <a className="normal-case text-3xl ml-[8px] mb-3">NOJ</a>
          {navList}
        </ul>
      </div>
    </>
  );
}
