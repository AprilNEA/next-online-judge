import { Card, Loading } from "react-daisyui";
import "@/components/judgeinfo-card.css";
import CheckIcon from "@/icons/check.svg";
import CrossIcon from "@/icons/cross.svg";
import { SubmissionStatus } from "@/types";

export default function JudgeinfoCard(props: { id: string; status: SubmissionStatus }) {
  return (
    <Card className="w-[225px] h-[75px] shadow-md hover:shadow-lg transition-shadow rounded-xl mb-2.5 mr-2.5">
      <Card.Body className="p-0 flex justify-between flex-row rounded-xl">
        <div
          className={`flex h-full w-1/3 bg-gray-400 rounded-l-xl items-center justify-center transition-colors ${
            props.status
          } ${
            props.status != "Pending" &&
            props.status != "Compiling" &&
            props.status != "Running"
              ? "svg-white"
              : ""
          }`}
        >
          {props.status == "Pending" ||
          props.status == "Compiling" ||
          props.status == "Running" ? (
            <Loading size="sm" variant="bars" />
          ) : props.status == "Accepted" ? (
            <CheckIcon />
          ) : (
            <CrossIcon />
          )}
        </div>
        <div className="flex h-full w-2/3 pl-1 py-2 flex-col justify-center">
          <div className="text-xl font-bold">#{props.id}</div>
          <div className="text-xs overflow-hidden">{props.status}</div>
        </div>
      </Card.Body>
    </Card>
  );
}
