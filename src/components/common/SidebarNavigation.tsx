import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { svgPaths } from "@/assets/icons/svg-paths";
import amsLogo from "@/assets/images/ams-logo.png";

interface SidebarNavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onLogout?: () => void;
  currentUser?: { email: string; rememberMe: boolean; role: string; name: string } | null;
}

export const SidebarNavigation = ({
  currentPage,
  setCurrentPage,
  isSidebarOpen,
  setIsSidebarOpen,
  onLogout,
  currentUser
}: SidebarNavigationProps) => (
  <>
    {/* Mobile overlay */}
    {isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <div className={`fixed left-0 top-0 z-50 bg-[#1a2c47] w-80 sm:w-[312px] flex flex-col h-full transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            setCurrentPage('ams-info');
            setIsSidebarOpen(false);
          }}
        >
          <div
            className="w-[64px] h-[62px] bg-no-repeat bg-center bg-cover flex-shrink-0"
            style={{ backgroundImage: `url('${amsLogo}')` }}
          />
          <div className="min-w-0">
            <div className="text-white font-bold text-[14px] sm:text-[16px] leading-5 truncate">
              Adro Marketing Sphere
            </div>
            <div className="text-neutral-100 text-[12px] sm:text-[14px] leading-5 truncate">
              Project Management Platform
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 sm:px-4 space-y-1 overflow-y-auto">
        {/* Content Hub */}
        <div className={`${currentPage.includes('content-hub') || currentPage.includes('generate') || currentPage.includes('editor') ? 'bg-[#152339]' : ''} rounded-md`}>
          <div
            className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
            onClick={() => {
              console.log('Switching to content hub');
              setCurrentPage('content-hub');
              setIsSidebarOpen(false);
            }}
          >
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d={svgPaths.pef16a80} fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Content Hub</span>
          </div>
        </div>

        {/* Planner */}
        <div className={`${currentPage === 'planner' ? 'bg-[#152339]' : ''} rounded-md`}>
          <div
            className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
            onClick={() => {
              console.log('Switching to planner');
              setCurrentPage('planner');
              setIsSidebarOpen(false);
            }}
          >
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d={svgPaths.p8324480} fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Planner</span>
          </div>
        </div>

        {/* Event Hub */}
        <div className={`${currentPage === 'event-hub' ? 'bg-[#152339]' : ''} rounded-md`}>
          <div
            className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
            onClick={() => {
              console.log('Switching to event hub');
              setCurrentPage('event-hub');
              setIsSidebarOpen(false);
            }}
          >
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 23 24" fill="none" className="w-6 h-6">
                <path d={svgPaths.p189de200} fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Event Hub</span>
          </div>
        </div>

        {/* Proof Points */}
        <div className={`${currentPage === 'proof-points' ? 'bg-[#152339]' : ''} rounded-md`}>
          <div
            className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
            onClick={() => {
              console.log('Switching to proof points');
              setCurrentPage('proof-points');
              setIsSidebarOpen(false);
            }}
          >
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d={svgPaths.p1ee106c0} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Proof Points</span>
          </div>
        </div>

        {/* Leads & Prospects */}
        <div className={`${currentPage === 'leads-prospects' ? 'bg-[#152339]' : ''} rounded-md`}>
          <div
            className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
            onClick={() => {
              console.log('Switching to leads & prospects');
              setCurrentPage('leads-prospects');
              setIsSidebarOpen(false);
            }}
          >
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 26 26" fill="none" className="w-6 h-6">
                <path d={svgPaths.p2382f940} fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Leads & Prospects</span>
          </div>
        </div>

        {/* Assets Management */}
        <div className={`${currentPage === 'assets-management' ? 'bg-[#152339]' : ''} rounded-md`}>
          <div
            className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
            onClick={() => {
              console.log('Switching to assets management');
              setCurrentPage('assets-management');
              setIsSidebarOpen(false);
            }}
          >
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d={svgPaths.p15652a00} stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Assets Management</span>
          </div>
        </div>

        {/* Analytics */}
        <div className={`${currentPage === 'analytics' ? 'bg-[#152339]' : ''} rounded-md`}>
          <div
            className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
            onClick={() => {
              console.log('Switching to analytics');
              setCurrentPage('analytics');
              setIsSidebarOpen(false);
            }}
          >
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 16 16" fill="none" className="w-6 h-6">
                <path d={svgPaths.p33ade3f1} fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Analytics</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-600">
        <div className="space-y-1 mb-4 sm:mb-6">
          <div className="flex items-center px-3 py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[44px]" onClick={() => import('sonner').then(({ toast }) => toast('Support functionality is coming soon.'))}>
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d={svgPaths.p30dc0400} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Support</span>
          </div>
          <div className="flex items-center px-3 py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[44px]" onClick={() => import('sonner').then(({ toast }) => toast('Settings functionality is coming soon.'))}>
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d={svgPaths.p3cccb600} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d={svgPaths.p3737f500} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] sm:text-[16px] truncate">Settings</span>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-4 sm:pt-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" onClick={() => import('sonner').then(({ toast }) => toast('My Profile functionality is coming soon.'))}>
                <AvatarFallback className="bg-gray-200 text-black text-xs sm:text-sm">
                  {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'PS'}
                </AvatarFallback>
              </Avatar>
              <div className="text-white min-w-0 flex-1">
                <div className="font-bold text-[12px] sm:text-[14px] truncate">
                  {currentUser?.name || 'Piyush Singh'}
                </div>
                <div className="font-medium text-[11px] sm:text-[14px] truncate">
                  {currentUser?.email || 'piyush@adrosonic.com'}
                </div>
                {currentUser?.role && (
                  <div className="text-[10px] text-gray-300 capitalize truncate">
                    {currentUser.role.replace('-', ' ')}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-600 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
              onClick={onLogout}
              title="Logout"
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d={svgPaths.p17b1b80} stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </>
);