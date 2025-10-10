export default function Header({ title }: { title: string }) {
  return (
    <header className="bg-gradient-to-l from-blue-900 to-blue-700 text-white p-4 mb-4 shadow">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
