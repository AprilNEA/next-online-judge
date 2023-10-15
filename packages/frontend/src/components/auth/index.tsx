"use client";

import {useRef, useCallback} from "react";
import {Button, Modal} from "react-daisyui";
import {useAuthStore} from "@/store";


function Login() {
  const authStore = useAuthStore.getState();

  return (
    <div className="flex flex-col space-y-4 items-center">
      <h3 className="font-bold text-lg">登录</h3>
      <div className="w-full space-y-2 justify-center">
        <div className="flex flex-row items-center">
          <p className="px-4">邮箱</p>
          <input
            type="text"
            value={authStore.email}
            onChange={(e) => {
              authStore.updateEmail(e.target.value)
            }}
            placeholder="Li.Hua@xjtlu.edu.cn"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="flex flex-row items-center">
          <p className="px-4">密码</p>
          <input
            type="password"
            value={authStore.password}
            onChange={(e) => {
              authStore.updatePassword(e.target.value)
            }}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>
      <button onClick={authStore.login} className="btn w-fit">提交</button>
    </div>
  )
}

function Register() {
  return (
    <div className="flex flex-col space-y-4 items-center">
      <h3 className="font-bold text-lg">登录</h3>
      <div className="w-full space-y-2 justify-center">
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
  )
}

export default function AuthModal() {
  const ref = useRef<HTMLDialogElement | null>(null);

  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  return (
    <>
      <Button onClick={handleShow}>登录</Button>

      <Modal ref={ref} suppressHydrationWarning>
        <Modal.Header className="font-bold">Hello!</Modal.Header>
        <Modal.Body>
          <Login/>
        </Modal.Body>
        <Modal.Actions>
          <form method="dialog">
            <Button>Close</Button>
          </form>
        </Modal.Actions>
      </Modal>
    </>
  );
}

