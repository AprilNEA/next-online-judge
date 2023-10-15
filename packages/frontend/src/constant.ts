export const BASE = process.env.NEXT_PUBLIC_BASE!;
export const config = {
    name: "Next Online Judge",
    abbreviation: "NOJ",
    navs: [{
        key: 0,
        name: "首页",
        path: "/",
    },
    {
        key: 1,
        name: "题库",
        path: "/problem/list"
    }],
  }