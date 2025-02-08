// src/components/Header.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { href: "/xupload", label: "𝕏 Upload" },
    { href: "/xcheck", label: "𝕏 Check" },
    { href: "/upload", label: "Upload" },
    { href: "/check", label: "Check" },
  ];

  return (
    <header className="p-4">
      <div className="flex justify-center mb-4 w-full">
        <img src="/story_lock_black.png" alt="Logo" className="w-1/3" />
      </div>
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1 rounded text-sm ${
              currentPath === item.href
                ? "bg-blue-500 text-white"
                : "bg-gray-500 hover:bg-gray-700 text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
