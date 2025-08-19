import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ArrowLeft, ArrowRight, Filter, Plus, Search, Star } from 'lucide-react';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderSection } from "@/components/common/HeaderSection";
import { getStatusBadge, normalizeStatus } from "@/utils/helpers";
import { contentItems } from "@/data/mockData";
// More filters rendered inline on toggle
import { useState } from 'react';

interface ContentHubPageProps {
  setIsSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  handleContentClick: (contentId: number) => void;
  currentUserName?: string;
}

export const ContentHubPage = ({
  setIsSidebarOpen,
  setCurrentPage,
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  handleContentClick,
  currentUserName
}: ContentHubPageProps) => {
  // Ensure page content can scroll
  // Wrapper divs already inherit from App; nothing else needed here
  // Extra filter state (More filters)
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [tagsFilter, setTagsFilter] = useState<string>('');
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState<boolean>(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');

  const uniqueAuthors = Array.from(new Set(contentItems.map((i) => i.author))).sort();
  const uniqueCampaigns = Array.from(new Set(contentItems.map((i) => i.campaign))).sort();
  // Filter content based on active section and filters
  const filteredContent = contentItems.filter(item => {
    const itemStatus = normalizeStatus(item.status);
    const selected = normalizeStatus(selectedStatus);
    // Section-based visibility
    if (activeSection === 'approved-content') {
      // Show items that have passed all approvals (approved or published), visible to all users
      if (!(itemStatus === 'approved' || itemStatus === 'published')) return false;
    } else {
      // My Contents: show only items pending approval at any stage (draft or in-review) created by current user
      const isPending = itemStatus === 'draft' || itemStatus === 'in-review';
      const isMine = !currentUserName || item.author === currentUserName;
      if (!(isPending && isMine)) return false;
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedType !== 'all' && item.type.toLowerCase() !== selectedType.toLowerCase()) return false;
    if (selected !== 'all' && itemStatus !== selected) return false;
    if (authorFilter !== 'all' && item.author !== authorFilter) return false;
    if (campaignFilter !== 'all' && item.campaign !== campaignFilter) return false;
    if (selectedQuarter !== 'all') {
      const toQuarter = (d: string) => {
        // Expect DD-MM-YYYY; fallback to Date.parse
        const parts = String(d || '').split('-').map(Number);
        let year = 0; let month = 0;
        if (parts.length === 3 && !parts.some(isNaN)) {
          year = parts[2];
          month = parts[1];
        } else {
          const t = Date.parse(d as string);
          if (!isNaN(t)) {
            const dt = new Date(t);
            year = dt.getFullYear();
            month = dt.getMonth() + 1;
          }
        }
        const quarter = month >= 1 && month <= 3 ? 'q1' : month <= 6 ? 'q2' : month <= 9 ? 'q3' : 'q4';
        return { quarter, year };
      };
      const { quarter, year } = toQuarter(item.publishDate);
      // Match 2025 quarters as per UI labels
      if (!(year === 2025 && quarter === selectedQuarter)) return false;
    }
    if (tagsFilter.trim()) {
      const tags = tagsFilter.toLowerCase().split(',').map(t => t.trim()).filter(Boolean);
      const haystack = `${item.title} ${item.content}`.toLowerCase();
      const anyTagMatches = tags.some(tag => haystack.includes(tag));
      if (!anyTagMatches) return false;
    }
    return true;
  });

  // Calculate metrics
  const metrics = {
    total: contentItems.length,
    drafts: contentItems.filter(item => normalizeStatus(item.status) === 'draft').length,
    inReview: contentItems.filter(item => normalizeStatus(item.status) === 'in-review').length,
    approved: contentItems.filter(item => normalizeStatus(item.status) === 'approved').length,
    published: contentItems.filter(item => normalizeStatus(item.status) === 'published').length
  };

  return (
    <div className="flex-1 bg-neutral-50 flex flex-col overflow-hidden">
      <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

      {/* Page Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-black">Content Hub</h1>
            <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Manage all your marketing content at one place</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-sm whitespace-nowrap"
              onClick={() => import('sonner').then(({ toast }) => toast('Contents by AI is coming soon.'))}
            >
              <Star className="w-4 h-4 mr-2" />
              Contents by AI
            </Button>
            <Button
              className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm sm:text-base whitespace-nowrap"
              onClick={() => setCurrentPage('generate')}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              New Content
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: "Total Content", value: metrics.total, color: "text-gray-900" },
            { label: "Drafts", value: metrics.drafts, color: "text-gray-900" },
            { label: "In Review", value: metrics.inReview, color: "text-gray-900" },
            { label: "Approved", value: metrics.approved, color: "text-gray-900" },
            { label: "Published", value: metrics.published, color: "text-gray-900" }
          ].map((metric, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-[14px] sm:text-[16px] text-gray-800 mb-2 sm:mb-3">{metric.label}</h3>
                <p className={`text-[24px] sm:text-[32px] lg:text-[36px] font-semibold ${metric.color} tracking-tight`}>{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Section Toggle + Quarter & Month Controls */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="bg-gray-200 bg-opacity-40 rounded-full p-1 inline-flex w-full sm:w-auto overflow-x-auto">
          <Button
            variant={activeSection === 'my-content' ? 'default' : 'ghost'}
            className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
              activeSection === 'my-content'
                ? 'bg-white text-black shadow-sm'
                : 'text-black hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('my-content')}
          >
            My Contents
          </Button>
          <Button
            variant={activeSection === 'approved-content' ? 'default' : 'ghost'}
            className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
              activeSection === 'approved-content'
                ? 'bg-white text-black shadow-sm'
                : 'text-black hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('approved-content')}
          >
            Approved Content
          </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quarter Filter */}
            <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <SelectTrigger className="rounded-full border-gray-300 text-sm w-[140px]">
                <SelectValue placeholder="Quarter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quarters</SelectItem>
                <SelectItem value="q1">Q1 2025</SelectItem>
                <SelectItem value="q2">Q2 2025</SelectItem>
                <SelectItem value="q3">Q3 2025</SelectItem>
                <SelectItem value="q4">Q4 2025</SelectItem>
              </SelectContent>
            </Select>

            {/* Month Switcher (Planner style) */}
            <div className="rounded-full border border-gray-300 px-3 py-1.5 flex items-center gap-3">
              <button aria-label="Previous Month" className="text-gray-700">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <Calendar className="w-4 h-4 text-gray-700" />
              <span className="text-sm text-gray-800">August</span>
              <button aria-label="Next Month" className="text-gray-700">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative flex-1 max-w-full sm:max-w-80">
            <Input
              placeholder="Search Content"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-gray-300 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="case study">Case Study</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="whitepaper">Whitepaper</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            {!isMoreFiltersOpen && (
              <Button
                variant="outline"
                className="rounded-full border-gray-300 text-sm whitespace-nowrap"
                onClick={() => setIsMoreFiltersOpen(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                More filters
              </Button>
            )}

            {isMoreFiltersOpen && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Select value={authorFilter} onValueChange={setAuthorFilter}>
                  <SelectTrigger className="w-full sm:w-auto min-w-[140px] rounded-full border-gray-300 text-sm">
                    <SelectValue placeholder="All Authors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    {uniqueAuthors.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                  <SelectTrigger className="w-full sm:w-auto min-w-[140px] rounded-full border-gray-300 text-sm">
                    <SelectValue placeholder="All Campaigns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {uniqueCampaigns.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="w-full sm:w-56">
                  <Input
                    placeholder="Tags: AI, insurance"
                    value={tagsFilter}
                    onChange={(e) => setTagsFilter(e.target.value)}
                    className="rounded-full border-gray-300 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 px-4 sm:px-6 pb-12 overflow-auto">
        <div className="space-y-2.5">
          {filteredContent.map((item) => (
            <Card
              key={item.id}
              className="bg-white border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleContentClick(item.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-1 sm:mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-[12px] text-gray-600 mb-1 sm:mb-2">
                      <span>{item.type}</span>
                      <span>by {item.author}</span>
                      <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
                      <span>{item.campaign}</span>
                      <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
                      <span>{item.timeSpent}</span>
                      <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
                      <span>{item.comments} previous comments</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      {normalizeStatus(item.status) === 'in-review' && item.reviewStage && (
                        <span className="text-blue-600 font-semibold text-[11px] sm:text-[12px]">
                          {item.reviewStage}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>
                          {item.status === 'published' ? `Published On: ${item.publishDate}` : `Publish Till: ${item.publishDate}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                      <AvatarFallback className="bg-gray-200 text-black text-[10px] sm:text-xs">
                        {item.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {getStatusBadge(item)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};