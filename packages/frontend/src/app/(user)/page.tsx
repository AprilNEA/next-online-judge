import {ProblemList} from "@/components/problem";

export default function Home() {


  return <ProblemList data={[{
    id: 1,
    title: "两数之和",
    passRate: 0.5,
    difficulty: "简单",
  }]}/>;
}
