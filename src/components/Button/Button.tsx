type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
>;

export function Button(props: ButtonProps) {
  return (
    <button
      className="bg-blue-500 py-1 px-3 text-white font-semibold rounded hover:bg-blue-600 shadow disabled:opacity-50"
      {...props}
    />
  );
}
