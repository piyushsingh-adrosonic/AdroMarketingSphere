import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ArrowLeft, Plus } from 'lucide-react';
import { HeaderSection } from "../components/common/HeaderSection";
import { handleGenerateContent } from "../utils/helpers";
import { toast } from 'sonner';

interface GenerateContentPageProps {
  setIsSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
}

export const GenerateContentPage = ({
  setIsSidebarOpen,
  setCurrentPage
}: GenerateContentPageProps) => {
  // Form states for content generation
  const [contentType, setContentType] = useState('');
  const [tone, setTone] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // simplified per design
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      handleGenerateContent(title, description, tone, contentType, setGeneratedContent);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveAsDraft = () => {
    toast.success('Draft saved.');
    setCurrentPage('content-hub');
  };

  const handleSendForApproval = () => {
    toast.success('Sent for approval.');
    setCurrentPage('content-hub');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      setUploadedFile(f);
      toast.success('Document attached. Ready to extract.');
    }
  };

  return (
    <div className="bg-neutral-50 flex flex-col h-full">
      <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage('content-hub')}
            className="hover:bg-gray-100 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-[20px] sm:text-[24px] font-medium text-black">Generate a New Content</h1>
            <p className="text-[12px] sm:text-[14px] text-gray-600">AI Powered</p>
          </div>
        </div>

        <div className="max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              {/* Basic Details */}
              <Card className="bg-white border border-gray-300">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Content Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Content Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="case-study">Case Study</SelectItem>
                          <SelectItem value="social">Social Media Post</SelectItem>
                          <SelectItem value="whitepaper">Whitepaper</SelectItem>
                          <SelectItem value="email">Email Newsletter</SelectItem>
                          <SelectItem value="landing-page">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Tone</Label>
                      <Input
                        placeholder="Enter tone of the content"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="border-gray-300 text-sm"
                      />
                    </div>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Title</Label>
                    <Input
                      placeholder="Enter content title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Description</Label>
                    <Textarea
                      placeholder="Brief description of what you want to create..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-gray-300 text-sm min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* AI Content Generation */}
              <Card className="bg-[#f7fafe] border border-gray-300">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">AI Content Generation</h3>
                  <div className="mb-3 sm:mb-4">
                    <Label className="text-[13px] sm:text-[14px] text-gray-600 mb-1 block">Content Generation Prompt</Label>
                    <Textarea
                      placeholder="Describe what content you want to generate. Be specific about tone, length, key points, and target audience..."
                      value={generationPrompt}
                      onChange={(e) => setGenerationPrompt(e.target.value)}
                      className="border-gray-300 text-sm min-h-[100px]"
                    />
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !title || !description}
                    className="bg-[#1a2c47] text-white rounded-md hover:bg-[#2a3c57] text-sm px-3"
                  >
                    <Plus className="w-4 h-4 mr-1 inline" />
                    {isGenerating ? 'Generating...' : 'Generate Content'}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Content Editor */}
              <Card className="bg-white border border-gray-300">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Content</h3>
                  <Textarea
                    placeholder="Start writing your content here, or use AI generation to get started..."
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[200px] sm:min-h-[300px] border-gray-300 text-sm"
                  />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3 sm:mt-4">
                    <p className="text-[11px] sm:text-[12px] text-gray-600">
                      {generatedContent.length} characters • Supports Markdown formatting
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-gray-300 text-sm" onClick={handleSaveAsDraft}>Save as Draft</Button>
                      <Button className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm" onClick={handleSendForApproval}>Send for Approval</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right-side Upload Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-white border border-gray-300 sticky top-4">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-2">Upload Document</h3>
                  <p className="text-[11px] sm:text-[12px] text-gray-600 mb-3">Attach a pre-written document to extract its content into the editor.</p>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center bg-neutral-50">
                    <input id="doc-upload" type="file" accept=".doc,.docx,.pdf,.txt,.md" onChange={handleFileUpload} className="hidden" />
                    <label htmlFor="doc-upload" className="inline-flex items-center justify-center px-3 py-2 rounded-md cursor-pointer border border-gray-300 bg-white text-sm hover:bg-gray-50">
                      Choose File
                    </label>
                    <div className="mt-2 text-[11px] sm:text-[12px] text-gray-600">Supported: .doc, .docx, .pdf, .txt, .md</div>
                  </div>
                  {uploadedFile && (
                    <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded">
                      <div className="text-[12px] text-black truncate">{uploadedFile.name}</div>
                      <div className="text-[11px] text-gray-600">{(uploadedFile.size/1024).toFixed(1)} KB</div>
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Button
                      className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm flex-1"
                      disabled={!uploadedFile}
                      onClick={() => toast('Extraction in progress (UI only).')}
                    >
                      Extract to Content
                    </Button>
                    <Button
                      variant="outline"
                      className="text-sm border-gray-300"
                      onClick={() => { setUploadedFile(null); }}
                      disabled={!uploadedFile}
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};