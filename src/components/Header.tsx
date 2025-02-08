// src/components/Header.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { href: "/xupload", label: "X Upload" },
    { href: "/upload", label: "Upload" },
    { href: "/check", label: "Check" },
  ];

  return (
    <header className="p-4">
      <div className="max-w-4xl mx-auto flex justify-center gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded ${
              currentPath === item.href
                ? "bg-blue-500 text-white"
                : "bg-gray-500 hover:bg-gray-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
