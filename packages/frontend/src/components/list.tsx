export function ProblemList(list) {
  return (
    <>
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
            <option disabled selected>
              48
            </option>
            <option>72</option>
          </select>
        </div>
        <div className="join">
          <button className="join-item btn px-[10px] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              viewBox="0 -960 960 960"
              width="18"
            >
              <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
          </button>
          <button className="join-item btn btn-active">1</button>
          <button className="join-item btn px-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              viewBox="0 -960 960 960"
              width="18"
            >
              <path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
