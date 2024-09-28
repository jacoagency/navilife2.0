import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold">
          Mi App
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:text-gray-300">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/chat" className="text-white hover:text-gray-300">
              Chat
            </Link>
          </li>
          <li>
            <Link href="/chat2" className="text-white hover:text-gray-300">
              Chat2
            </Link>
          </li>
          {/* Agrega más enlaces según sea necesario */}
        </ul>
      </div>
    </nav>
  );
}