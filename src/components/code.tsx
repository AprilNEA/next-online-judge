"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function CodeSpace() {
  return (
    <SyntaxHighlighter language="javascript">
      {`function sum(a, b) {`}
      {`  return a + b;`}
      {`}`}
    </SyntaxHighlighter>
  );
}
