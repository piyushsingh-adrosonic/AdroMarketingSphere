import amsLogo from "@/assets/images/ams-logo.png";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { AlertCircle, Eye, EyeOff, Search } from "lucide-react";
import { toast } from "sonner";

// Predefined user credentials
const validCredentials = [
  {
    email: "admin@adrosonic.com",
    password: "AMS2024@Admin",
    role: "admin",
    name: "Admin User"
  },
  {
    email: "marketing@adrosonic.com",
    password: "Marketing@123",
    role: "Marketing Head",
    name: "Matt Pesce"
  },
  {
    email: "piyush.singh@adrosonic.com",
    password: "Piyush@123",
    role: "Associate",
    name: "Piyush Singh"
  },
  {
    email: "kamlesh.yadav@adrosonic.com",
    password: "Kaqmlesh@123",
    role: "Department Head",
    name: "Kamlesh Yadav"
  },
  {
    email: "mayank@adrosonic.com",
    password: "Mayank@123",
    role: "Executive",
    name: "Mayank"
  }
];

interface LoginPageProps {
  onLogin: (userData: {
    email: string;
    rememberMe: boolean;
    role: string;
    name: string;
  }) => void;
}

// Adjustable spacing between the left intro section and the right login form
// Modify this Tailwind class string to change the gap in one place
const MAIN_CONTENT_GAP_CLASS = "gap-40"; // 10rem

// Sticky Header Component
// Sticky Header Component
function StickyHeader() {
  return (
    <header className="bg-[#1a2c47] text-white">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16 sm:h-20 font-montserrat">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <a href="#/landing" className="flex items-center gap-3">
            <img src={amsLogo} alt="AMS Logo" className="h-12 sm:h-16" />
            <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
              Adro Marketing Sphere
            </h1>
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <Search className="h-5 w-5 cursor-pointer" onClick={() => toast.info("Registration is coming soon.")} />
          <button
            onClick={() => toast.info("Registration is coming soon.")}
            className="text-white hover:text-gray-200 font-medium"
          >
            Register
          </button>
        </div>
      </div>
    </header>
  );
}


// Sticky Footer Component
function StickyFooter() {
  return (
    <footer className="sticky bottom-0 z-50 bg-[#1a2c47] border-t border-white/20 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-white text-sm">
            <span className="font-bold uppercase">ADRO MARKETING SPHERE</span>
            <span className="hidden sm:inline">|</span>
            <span>© Copyright 2025</span>
          </div>
          <div className="text-white text-xs sm:text-sm text-center sm:text-right">
            <span>Lucknow, Mumbai, London, Denver, Santiago, SaoPaulo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Login Form Component
function LoginForm({
  onLogin,
}: {
  onLogin: (userData: {
    email: string;
    rememberMe: boolean;
    role: string;
    name: string;
  }) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = validCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (user) {
      onLogin({
        email: user.email,
        rememberMe,
        role: user.role,
        name: user.name,
      });
    } else {
      setError(
        "Invalid email or password. Please check your credentials and try again."
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md font-montserrat">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Log In to AMS
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Where Marketing Gets Smarter...
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              EMAIL ADDRESS
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
              disabled={isLoading}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              PASSWORD
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
                disabled={isLoading}
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 text-sm text-gray-600 cursor-pointer"
            >
              Remember Me
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#1a2c47] hover:bg-[#1a2c47]/90 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {isLoading ? "SIGNING IN..." : "PROCEED"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col font-montserrat">
      <StickyHeader />

      {/* Main two-column layout */}
      <main className={`flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-12 ${MAIN_CONTENT_GAP_CLASS}`}>
        {/* Left Side - Branding */}
        <div className="flex-1 max-w-lg text-left">
          {/* <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
            Welcome to <br /> Adro Marketing Sphere
          </h1> */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Welcome to <br /> <span className="text-[#1a2c47]">Adro Marketing Sphere</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your AI-powered hub for smarter marketing operations.
            Log in to access your personalized dashboard, projects, and insights.
          </p>
          <p className="text-gray-700">
            Need help?{" "}
            <a
              href="mailto:adromarketingsphere@adrosonic.com"
              className="text-blue-600 font-medium hover:underline"
            >
              adromarketingsphere@adrosonic.com
            </a>
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 max-w-md w-full">
          <LoginForm onLogin={onLogin} />
        </div>
      </main>

      <StickyFooter />
    </div>
  );
}
