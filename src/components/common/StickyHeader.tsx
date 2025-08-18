// src/components/common/StickyHeader.tsx
import amsLogo from "@/assets/images/ams-logo.png";
import placeholderImage from "@/assets/images/placeholder.png";

export function StickyHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#1a2c47] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 bg-no-repeat bg-center bg-cover flex-shrink-0"
              style={{ backgroundImage: `url('${amsLogo}')` }}
            />
            <div className="hidden sm:block">
              <h1 className="text-white font-semibold text-lg sm:text-xl tracking-wider">
                Adro Marketing Sphere
              </h1>
              <p className="text-neutral-200 text-sm">
                Project Management Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-white text-sm">
              <span>Need help?</span>
              <span className="text-blue-300">Contact Support</span>
            </div>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center">
              <div
                className="h-6 w-6 sm:h-8 sm:w-8 bg-no-repeat bg-center bg-contain rotate-90"
                style={{ backgroundImage: `url('${placeholderImage}')` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
