export function Question() {
  return (
    <div>
      <h1>Question</h1>
      <div className="form-control">
        <label className="label">
          <span className="label-text">代码</span>
          <span className="label-text-alt">C++</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Code"
        ></textarea>
        <label className="label">
          <span className="label-text-alt"></span>
          <span className="label-text-alt">提交</span>
        </label>
      </div>
    </div>
  );
}

export default function QuestionPage(params: { questionId: string }) {
  return <Question />;
}
