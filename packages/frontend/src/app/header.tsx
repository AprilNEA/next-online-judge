"use client";

import Link from "next/link";
import { AuthModal } from "@/components/auth";

const navs = [
  {
    name: "首页",
    path: "/",
  },
  {
    name: "题库",
    path: "/problem/all",
  },
  {
    name: "状态",
    path: "/problem/status",
  },
];

export default function Header() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h18"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navs.map((nav) => (
              <li>
                <Link href={nav.path}>{nav.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">NOJ</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navs.map((nav) => (
            <li>
              <Link href={nav.path}>{nav.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <AuthModal />
      </div>
    </div>
  );
}
