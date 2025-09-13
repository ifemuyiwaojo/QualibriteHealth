import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useCallback, memo } from "react";
import { useAuth } from "@/lib/auth";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

function HeaderComponent() {
  const [open, setOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <img 
              src="/qualibrite-family-logo.png" 
              alt="Qualibrite Family Psychiatry" 
              className="h-8 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black text-gray-900">
                Qualibrite Family Psychiatry
              </span>
              {user && (
                <span className="text-xs text-gray-500 font-medium">
                  {user.role === 'patient' ? 'Patient Portal' : 
                   user.role === 'provider' ? 'Provider Portal' : 
                   user.role === 'admin' ? 'Admin Portal' : 
                   'Healthcare Platform'}
                </span>
              )}
            </div>
          </Link>
          <div className="flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between md:justify-end">
          <Link href="/" className="md:hidden flex items-center space-x-2">
            <img 
              src="/qualibrite-family-logo.png" 
              alt="Qualibrite Family Psychiatry" 
              className="h-6 w-auto"
            />
            <span className="text-lg font-black text-gray-900">
              Qualibrite Family Psychiatry
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Button asChild variant="ghost">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link href="/auth/profile">My Account</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost">
                      <Link href="/auth/login">Sign in</Link>
                    </Button>
                    <Button asChild variant="default">
                      <Link href="/auth/register">Register</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default memo(HeaderComponent);