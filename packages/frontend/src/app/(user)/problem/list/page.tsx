"use client"
import "@/globals.css";
import { useState } from 'react';

export default function ProblemList(){
    const [filterSwitch,filterSwitcher] = useState(false);
    return(
        <>
            <div className="text-sm breadcrumbs">
                <ul>
                    <li><a href="/">NOJ</a></li> 
                    <li>题库</li> 
                </ul>
            </div>
            <div className="text-4xl mb-10 flex">题目列表
            <button className="btn btn-ghost px-[8px] ml-1">
                { filterSwitch ? <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Z"/></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M592-481 273-800h487q25 0 36 22t-4 42L592-481ZM791-56 560-287v87q0 17-11.5 28.5T520-160h-80q-17 0-28.5-11.5T400-200v-247L56-791l56-57 736 736-57 56Z"/></svg>
                }
            </button></div>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                        <th className="w-1/12">ID</th>
                        <th>名称</th>
                        <th className="w-1/5">标签</th>
                        <th className="w-1/12">通过率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>P001</th>
                            <td>A + B Problem</td>
                            <td>基础</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <th>P001</th>
                            <td>A + B Problem</td>
                            <td>基础</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <th>P001</th>
                            <td>A + B Problem</td>
                            <td>基础</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <th>P001</th>
                            <td>A + B Problem</td>
                            <td>基础</td>
                            <td>100%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-5 flex justify-between">
                <div className="join flex items-center">
                    <div className="text-sm mr-2 whitespace-nowrap">每页数量</div>
                    <select className="select select-ghost w-full max-w-xs">
                        <option disabled selected>48</option>
                        <option>72</option>
                    </select>
                </div>
                <div className="join">
                    <button className="join-item btn px-[10px] "><svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18"><path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/></svg></button>
                    <button className="join-item btn btn-active">1</button>
                    <button className="join-item btn px-[10px]"><svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18"><path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z"/></svg></button>
                </div>
            </div>

        </>
    )
}