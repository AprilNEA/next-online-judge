export function Auth() {
  return (
    <div className="flex flex-col space-y-4 items-center">
      <h3 className="font-bold text-lg">登录</h3>
      <div className="w-full space-y-2 ">
        <div className="flex flex-row items-center">
          <p className="px-4">邮箱</p>
          <input
            type="text"
            placeholder="Li.Hua@xjtlu.edu.cn"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="flex flex-row items-center">
          <p className="px-4">密码</p>
          <input
            type="password"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>
      <button className="btn w-fit">提交</button>
    </div>
  );
}

export function AuthModal() {
  return (
    <>
      <button
        className="btn"
        // @ts-ignore
        onClick={() => document.getElementById("auth-modal")!.showModal()}
      >
        登录
      </button>
      <dialog id="auth-modal" className="modal">
        <div className="modal-box">
          <Auth />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
