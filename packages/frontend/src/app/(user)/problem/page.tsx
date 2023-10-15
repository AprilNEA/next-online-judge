'use client'

import "@/globals.css";
import "github-markdown-css"
import Markdown from 'react-markdown'
import AceEditor from "react-ace";
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

import "ace-builds/src-noconflict/ext-language_tools";


const markdown = `
# Hello World

Hello World
`

export default function ProblemPage(){
    return(
        <>
            <div className="text-sm breadcrumbs">
                <ul>
                    <li><a href="/">NOJ</a></li> 
                    <li><a href="/problem/list">题库</a></li>
                    <li>P001</li> 
                </ul>
            </div>
            <div className="text-4xl mb-10 flex whitespace-nowrap overflow-hidden">P001 A + B Problem</div>
            <div className="markdown-body"><Markdown remarkPlugins={[remarkGfm,remarkMath]} rehypePlugins={[rehypeKatex]}>{markdown}</Markdown></div>
            <div className="divider"></div>
            <AceEditor
            mode="javascript"
            editorProps={{ $blockScrolling: true }}
            />
        </>
    )
}