import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ArrowLeft, Calendar, CheckSquare, ArrowRightCircle, Save, Eye, Edit2, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { HeaderSection } from "../components/common/HeaderSection";
import { handleAddComment } from "../utils/helpers";
import { contentItems, mockComments } from "../data/mockData";

interface ContentEditorPageProps {
  setIsSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  selectedContentId: number | null;
}

export const ContentEditorPage = ({
  setIsSidebarOpen,
  setCurrentPage,
  selectedContentId
}: ContentEditorPageProps) => {
  const [newComment, setNewComment] = useState('');
  const [contentText, setContentText] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const content = contentItems.find(item => item.id === selectedContentId);

  if (!content) {
    return (
      <div className="flex-1 bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-black mb-4">Content Not Found</h1>
          <p className="text-gray-600 mb-4">The requested content could not be found.</p>
          <Button onClick={() => setCurrentPage('content-hub')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Initialize content text from content data
  useState(() => {
    if (content.content && !contentText) {
      setContentText(content.content);
    }
  });

  const handleSaveContent = () => {
    toast.success('Content saved successfully.');
  };

  const handleApproveContent = () => {
    toast.success('Content approved successfully.');
    setCurrentPage('content-hub');
  };

  const handleRequestRevisions = () => {
    toast('Revision request sent.');
    setCurrentPage('content-hub');
  };

  const handleRejectContent = () => {
    if (confirm('Are you sure you want to reject this content?')) {
      toast('Content rejected.');
      setCurrentPage('content-hub');
    }
  };

  // Milestone helpers
  const normalize = (v: string | undefined | null) => String(v || '').trim().toLowerCase().replace(/\s+/g, '-');
  const normalizedStatus = normalize(content?.status);
  const stageOrder = ['draft', 'in-review', 'approved', 'published'] as const;
  const currentStageIndex = (() => {
    const idx = stageOrder.indexOf(normalizedStatus as typeof stageOrder[number]);
    if (idx >= 0) return idx;
    // Fallback: map common variants
    if (normalizedStatus === 'inreview') return 1;
    return 0;
  })();

  return (
    <div className="bg-neutral-50 flex flex-col h-full">
      <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center gap-4 sm:gap-6 mb-2 sm:mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage('content-hub')}
            className="hover:bg-gray-100 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] sm:text-[24px] font-medium text-black">Content Editor</h1>
            <p className="text-[12px] sm:text-[14px] text-gray-600">Review and edit content</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[#1a2c47] text-white px-1 py-0 rounded text-[11px] sm:text-[12px]">
              {content.status?.toLowerCase().replace(/\s+/g, '-') === 'in-review' ? 'In Review' : content.status}
            </Badge>
            <Badge variant="outline" className="border-gray-400 px-1 py-0 rounded text-[11px] sm:text-[12px]">
              v2
            </Badge>
            <Badge className="bg-gray-100 text-black px-1 py-0 rounded text-[11px] sm:text-[12px]">
              AI Generated
            </Badge>
          </div>
        </div>

        {/* Milestone Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`${currentStageIndex >= 0 ? 'bg-[#1a2c47]' : 'bg-gray-300'} h-2 transition-all`}
              style={{ width: `${((currentStageIndex + 1) / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {stageOrder.map((stage, idx) => (
              <div key={stage} className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    idx <= currentStageIndex ? 'bg-[#1a2c47]' : 'bg-gray-300'
                  }`}
                />
                <span
                  className={`text-[10px] sm:text-[11px] ${
                    idx === currentStageIndex ? 'text-[#1a2c47] font-semibold' : 'text-gray-600'
                  }`}
                >
                  {stage === 'in-review' ? 'In Review' : stage.charAt(0).toUpperCase() + stage.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Summary Card */}
        <Card className="bg-white border border-gray-300 mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-2">
                  {content.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-[12px] text-gray-600">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                      <AvatarFallback className="bg-gray-200 text-black text-[10px] sm:text-[11px]">
                        {content.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>by {content.author}</span>
                  </div>
                  <span>{content.type}</span>
                  <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
                  <span>Submitted {content.timeSpent} ago</span>
                  <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Due: {content.publishDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-[11px] sm:text-[12px]">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">{content.comments} comments</span>
                </div>
                <Badge variant="outline" className="border-gray-400 px-1 py-0 rounded text-[11px] sm:text-[12px]">
                  1 revision request
                </Badge>
                <Badge className="bg-red-600 text-white px-1 py-0 rounded text-[11px] sm:text-[12px]">
                  3 unresolved comments
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Content Section */}
          <div className="flex-1">
            <Card className="bg-white border border-gray-300">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-medium text-[13px] sm:text-[14px] text-black">Content Editor</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isPreviewMode ? "outline" : "default"}
                      size="sm"
                      className={`text-xs ${!isPreviewMode ? 'bg-[#1a2c47] text-white' : 'border-gray-300'}`}
                      onClick={() => setIsPreviewMode(false)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={isPreviewMode ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${isPreviewMode ? 'bg-[#1a2c47] text-white' : 'border-gray-300'}`}
                      onClick={() => setIsPreviewMode(true)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>

                {isPreviewMode ? (
                  <div className="bg-gray-50 border border-gray-200 rounded p-4 min-h-[300px] sm:min-h-[400px]">
                    <div className="prose prose-sm max-w-none">
                      <h1 className="text-lg font-semibold mb-4">{content.title}</h1>
                      <div className="text-sm text-gray-600 mb-4">
                        Industry: Insurance (Marine) | Use Case
                      </div>
                      <div className="space-y-4 text-sm leading-relaxed">
                        <p>Full spectrum of testing (functional, automation, and performance)</p>
                        <p>All types of migration (data, policies, trading certificates, etc.)</p>
                        <p>Management Information (MI) reports and dashboards</p>
                        <p>Substantially reduced unit costs for application testing and quality assurance</p>
                        <h2 className="text-base font-semibold mt-6 mb-3">Implementation Strategy</h2>
                        <p>Detailed implementation approach with specific examples and case studies that demonstrate practical application of the concepts discussed.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2 block">Content Title</Label>
                      <Input
                        value={content.title}
                        className="border-gray-300 text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2 block">Content Body</Label>
                      <Textarea
                        value={contentText}
                        onChange={(e) => setContentText(e.target.value)}
                        className="min-h-[250px] sm:min-h-[350px] border-gray-300 text-sm font-mono"
                        placeholder="Start editing your content here..."
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] sm:text-[12px] text-gray-600">
                      <span>{contentText.length} characters • Supports Markdown</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Last saved: 2 minutes ago</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-sm"
                    onClick={handleSaveContent}
                  >
                    <Save className="w-4 h-4 mr-1 sm:mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm"
                    onClick={handleApproveContent}
                  >
                    <CheckSquare className="w-4 h-4 mr-1 sm:mr-2" />
                    Approve Content
                  </Button>
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 text-sm"
                    onClick={handleRequestRevisions}
                  >
                    <Edit2 className="w-4 h-4 mr-1 sm:mr-2" />
                    Request Revisions
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 text-sm"
                    onClick={handleRejectContent}
                  >
                    Reject Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comments & Collaboration Section */}
          <div className="flex-1 lg:max-w-md">
            <Card className="bg-white border border-gray-300">
              <CardContent className="p-3 sm:p-4">
                {/* Add Comment */}
                <div className="mb-4 sm:mb-6">
                  <Label className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2 block">Add Comment</Label>
                  <Textarea
                    placeholder="Leave feedback or suggestions..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-gray-300 mb-2 text-sm min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleAddComment(newComment, setNewComment)}
                      className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm"
                      disabled={!newComment.trim()}
                    >
                      <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>

                <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-4 sm:mb-6">
                  Comments ({mockComments.length})
                </h3>

                {/* Comments List */}
                <div className="space-y-4 sm:space-y-6">
                  {mockComments.map((comment, index) => (
                    <div key={comment.id}>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 sm:w-7 sm:h-7">
                            <AvatarFallback className="bg-gray-200 text-black text-[10px] sm:text-[11px]">
                              {comment.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[11px] sm:text-[12px] text-black">
                                {comment.author}
                              </span>
                              <Badge variant="outline" className="border-gray-400 px-1 py-0 rounded text-[9px] sm:text-[10px]">
                                {comment.role}
                              </Badge>
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-gray-600">2 hours ago</div>
                          </div>
                        </div>
                        <p className="text-[11px] sm:text-[12px] text-gray-700 leading-relaxed pl-8 sm:pl-9">
                          {comment.content}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pl-8 sm:pl-9">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[10px] sm:text-[11px] font-semibold text-green-600 hover:text-green-800 p-0 h-auto"
                              onClick={() => toast.success('This feedback has been resolved.')}
                            >
                              <CheckSquare className="w-3 h-3 mr-1" />
                              Mark as resolved
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[10px] sm:text-[11px] font-semibold text-blue-600 hover:text-blue-800 p-0 h-auto"
                              onClick={() => toast('This feedback has been applied.', { className: 'bg-blue-50 text-blue-900 border border-blue-200' })}
                            >
                              Apply Feedback
                              <ArrowRightCircle className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < mockComments.length - 1 && (
                        <hr className="border-gray-300 my-4 sm:my-6" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Content Metadata */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-[12px] sm:text-[13px] text-black mb-3">Content Details</h4>
                  <div className="space-y-2 text-[10px] sm:text-[11px] text-gray-600">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{content.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Campaign:</span>
                      <span>{content.campaign}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{content.status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span>{content.publishDate}</span>
                    </div>
                    {content.reviewStage && (
                      <div className="flex justify-between">
                        <span>Review Stage:</span>
                        <span>{content.reviewStage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};