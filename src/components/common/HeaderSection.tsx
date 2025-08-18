import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, Menu, Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { svgPaths } from "@/assets/icons/svg-paths";

interface HeaderSectionProps {
  setIsSidebarOpen: (open: boolean) => void;
}

export const HeaderSection = ({ setIsSidebarOpen }: HeaderSectionProps) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen]);

  return (
  <div className="bg-white border-b border-gray-200 px-4 py-4 sm:py-5">
    <div className="flex items-center justify-between">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden mr-2"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex items-center gap-2 sm:gap-3 ml-auto relative">
        <div className="relative">
          <Input
            placeholder="Search projects, tasks"
            className="w-48 sm:w-64 md:w-80 pl-10 rounded-full border-gray-300 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        {/* Notifications click-to-toggle panel */}
        <div className="relative">
          <Button
            ref={buttonRef}
            onClick={() => setIsNotificationsOpen((o) => !o)}
            variant="outline"
            size="icon"
            className="relative rounded-full border-gray-300 h-9 w-9 sm:h-10 sm:w-10"
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 rounded-full p-0 flex items-center justify-center">
              03
            </Badge>
          </Button>
          {isNotificationsOpen && (
            <div ref={panelRef} className="absolute right-0 mt-2 w-96 max-w-[95vw] z-50">
              <div className="rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                  <span className="text-[12px] font-semibold text-[#1a2c47]">Notifications</span>
                  <button className="text-xs text-[#1a2c47] hover:underline" onClick={() => setIsNotificationsOpen(false)}>Close</button>
                </div>
                <div className="p-2 space-y-1">
                  <div className="flex gap-2 p-2 rounded-lg hover:bg-gray-50">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#1a2c47]" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 leading-5">Your content has been generated. Please review.</div>
                      <div className="text-[10px] text-gray-500">Just now</div>
                    </div>
                  </div>
                  <div className="flex gap-2 p-2 rounded-lg hover:bg-gray-50">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#1a2c47]" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 leading-5">Matt has added a comment. Please check.</div>
                      <div className="text-[10px] text-gray-500">2 min ago</div>
                    </div>
                  </div>
                  <div className="flex gap-2 p-2 rounded-lg hover:bg-gray-50">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#1a2c47]" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 leading-5">AMS generated campaign content for Elevate Connect London. Please review.</div>
                      <div className="text-[10px] text-gray-500">5 min ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};