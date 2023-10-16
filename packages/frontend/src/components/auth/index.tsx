"use client";

import {useRef, useCallback} from "react";
import {Button, Modal, Input} from "react-daisyui";
import {useAuthStore} from "@/store";

const authStore = useAuthStore.getState();

function LoginModal() {
  return (
    <>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
        <div className="flex mr-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
        </div>
        <div className="form-control w-full max-w-xs">
          <Input 
            type="text"
            value={authStore.email}
            placeholder="Li.Hua23@student.xjtlu.edu.cn"
            onChange={(e) => {
              authStore.updateEmail(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0">
        <div className="flex mr-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/></svg>
        </div>
        <div className="form-control w-full max-w-xs">
          <Input 
            type="password"
            value={authStore.password}
            placeholder="Password"
            onChange={(e) => {
              authStore.updatePassword(e.target.value)
            }}
          />
        </div>
      </div>
    </>
    )
}

function RegisterModal() {
  return (
    <>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
        <div className="flex mr-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
        </div>
        <div className="form-control w-full max-w-xs">
          <Input 
            type="text"
            value={authStore.email}
            placeholder="Li.Hua23@student.xjtlu.edu.cn"
            onChange={(e) => {
              authStore.updateEmail(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0">
        <div className="flex mr-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/></svg>
        </div>
        <div className="form-control w-full max-w-xs">
          <Input 
            type="password"
            value={authStore.password}
            placeholder="Password"
            onChange={(e) => {
              authStore.updatePassword(e.target.value)
            }}
          />
        </div>
      </div>
    </>
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
        <Modal.Header className="font-bold text-2xl items-center flex justify-center mb-3 pl-3">
          {authStore.authModal == 'login-phone' ? '扫码登陆' : authStore.authModal == 'login-email' ? '登录' : authStore.authModal == 'register' ? '注册' : 'undefined'}
          <Button className="btn-ghost ml-auto px-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-520v-320h320v320H120Zm80-80h160v-160H200v160Zm-80 480v-320h320v320H120Zm80-80h160v-160H200v160Zm320-320v-320h320v320H520Zm80-80h160v-160H600v160Zm160 480v-80h80v80h-80ZM520-360v-80h80v80h-80Zm80 80v-80h80v80h-80Zm-80 80v-80h80v80h-80Zm80 80v-80h80v80h-80Zm80-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm80 80v-80h80v80h-80Z"/></svg>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <LoginModal />
        </Modal.Body>
        <Modal.Actions className="justify-between">
          <Button className="btn-ghost">注册</Button>
          <div className="flex">
            <form method="dialog">
              <Button className="btn-ghost">取消</Button>
            </form>
            {authStore.authModal == 'login-phone' ? '' : authStore.authModal == 'login-email' ? <Button className="bg-black text-white hover:bg-gray-500">登录</Button> : authStore.authModal == 'register' ? '注册' : <Button className="bg-black text-white hover:bg-gray-500">注册</Button>}
          </div>
        </Modal.Actions>
      </Modal>
    </>
  );
}

