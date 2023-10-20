export default ({ params }: { params: { handle: string } }) => {
  return <span>Hello, {params.handle}</span>;
};
