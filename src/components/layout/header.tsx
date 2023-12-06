"use client";

import Link from "next/link";
import Auth from "@/components/auth";
import { Button, Dropdown, Menu, Navbar } from "react-daisyui";
import useInfo from "@/hooks/use-info";

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

const adminNavs = [
  {
    name: "首页",
    path: "/admin",
  },
  {
    name: "题目管理",
    path: "/admin/problem",
  },
  {
    name: "用例管理",
    path: "/admin/cases",
  },
];

export function Header() {
  const { userInfo, userInfoLoading } = useInfo();

  return (
    <div className="flex justify-center">
      <Navbar className="max-w-[1200px] pr-[24px]">
        <Navbar.Start>
          <Dropdown>
            <Button
              tag="label"
              color="ghost"
              tabIndex={0}
              className="lg:hidden"
            >
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
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </Button>
            <Dropdown.Menu tabIndex={0} className="w-52 menu-sm mt-3 z-[1]">
              {navs.map((nav) => (
                <li key={nav.name}>
                  <Link href={nav.path}>{nav.name}</Link>
                </li>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <a className="btn btn-ghost normal-case text-xl">NOJ</a>
        </Navbar.Start>
        <Navbar.Center className="hidden lg:flex">
          <Menu horizontal className="px-1">
            {navs.map((nav) => (
              <Menu.Item key={nav.name}>
                <Link href={nav.path}>{nav.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Navbar.Center>
        <Navbar.End>
          {!userInfoLoading &&
            (userInfo ? <span>{userInfo.handle}</span> : <Auth />)}
        </Navbar.End>
      </Navbar>
    </div>
  );
}

export function HeaderAdmin() {
  const { userInfo, userInfoLoading } = useInfo();

  return (
    <div className="flex justify-center">
      <Navbar className="max-w-[1200px] pr-[24px]">
        <Navbar.Start>
          <Dropdown>
            <Button
              tag="label"
              color="ghost"
              tabIndex={0}
              className="lg:hidden"
            >
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
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </Button>
            <Dropdown.Menu tabIndex={0} className="w-52 menu-sm mt-3 z-[1]">
              {adminNavs.map((nav) => (
                <li key={nav.name}>
                  <Link href={nav.path}>{nav.name}</Link>
                </li>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <a className="btn btn-ghost normal-case text-xl">NOJ ADMIN</a>
          <Link href="/">
            <Button className="whitespace-nowrap">返回NOJ</Button>
          </Link>
        </Navbar.Start>
        <Navbar.Center className="hidden lg:flex">
          <Menu horizontal className="px-1">
            {adminNavs.map((nav) => (
              <Menu.Item key={nav.name}>
                <Link href={nav.path}>{nav.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Navbar.Center>
        <Navbar.End>
          {!userInfoLoading &&
            (userInfo ? <span>{userInfo.handle}</span> : <Auth />)}
        </Navbar.End>
      </Navbar>
    </div>
  );
}
