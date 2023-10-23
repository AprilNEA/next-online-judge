import { Progress } from "react-daisyui";

export default function LoadingUI() {
  return (
    <div className="flex w-full justify-center mt-10">
      <Progress className="w-56" />
    </div>
  );
}
