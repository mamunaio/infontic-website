import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/category', label: 'Categories' },
  { href: '/about', label: 'About' },
  { href: '/search', label: 'Search' },
];

export const metadata: Metadata = {
  title: "Infontic - Blog & Reviews",
  description: "Your hub for the latest reviews, insights, and tech trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground min-h-screen flex flex-col font-sans`}
      >
        <header className="glass sticky top-0 z-50 transition-all duration-300 border-b border-border/10 premium-shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold font-outfit tracking-tight text-gradient hover:opacity-90 transition-opacity">
              Infontic
            </Link>
            <nav className="hidden md:flex gap-8 items-center font-medium">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="relative group hover:text-primary transition-colors py-2">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              {process.env.NODE_ENV === 'development' && (
                <Link 
                  href="/studio" 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Studio
                </Link>
              )}
            </nav>
            {/* Mobile menu button could go here */}
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border bg-slate-50 dark:bg-slate-900/50 py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div className="space-y-4">
                <Link href="/" className="text-2xl font-bold font-outfit text-gradient">
                  Infontic
                </Link>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your hub for the latest reviews, insights, and tech trends. Stay ahead of the curve with Infontic.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold font-outfit">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                    <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                    <li><Link href="/search" className="hover:text-primary transition-colors">Search</Link></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold font-outfit">Legal</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4 text-right md:text-left">
                <h4 className="font-bold font-outfit">Contact</h4>
                <p className="text-sm text-muted-foreground">
                  Email: info@infontic.com
                </p>
              </div>
            </div>
            <div className="pt-8 border-t border-border text-center text-muted-foreground text-xs">
              <p>&copy; {new Date().getFullYear()} Infontic. Crafted with passion.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
