export default function Blockquote({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border-l-4 border-primary-500 pl-4 font-bold">
      {children}
    </div>
  );
}
