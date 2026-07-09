import { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Pin, Plus } from 'lucide-react';
import { EditorPane } from './EditorPane';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

export const NotesLayout = () => {
  const pages = useAppStore((state) => state.pages);
  const addPage = useAppStore((state) => state.addPage);
  
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [searchQuery] = useState('');

  // We only show top level pages in the grid for now, or flat list
  const filteredPages = useMemo(() => {
    return pages
      .filter(p => !p.parentId) // Only top level for grid
      .filter(p => 
        (p.title?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [pages, searchQuery]);

  const handleCreatePage = async () => {
    const newPage = await addPage({ title: 'Untitled Note', parentId: null });
    if (newPage) {
      setActivePageId(newPage.id);
    }
  };

  // If a page is active, show the editor full-view
  if (activePageId) {
    return (
      <div className="flex-1 h-full flex flex-col relative bg-bg-app">
        <EditorPane 
          key={activePageId} 
          pageId={activePageId} 
          onClose={() => setActivePageId(null)} 
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#202020] overflow-hidden">


      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 max-w-[1600px] mx-auto">
          
          {/* Add Note Card */}
          <div 
            onClick={handleCreatePage}
            className="flex flex-col gap-3 group cursor-pointer"
          >
            <div className="h-44 rounded-xl overflow-hidden relative transition-all duration-200 bg-[#282828] border border-transparent hover:border-[#404040] flex items-center justify-center hover:bg-[#2D2D2D]">
              <Plus className="w-8 h-8 text-[#888888] group-hover:text-[#E0E0E0] transition-colors" />
            </div>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-base font-medium text-[#E0E0E0] line-clamp-1">
                Add Note
              </h3>
              <span className="text-sm text-[#888888] mt-0.5">New</span>
            </div>
          </div>

          {/* Note Cards */}
          {filteredPages.map((page, index) => {
            const isPinned = index === 0; // Just mock pinning the first note like in screenshot
            const formattedDate = format(new Date(page.updatedAt || page.createdAt), 'dd/MM/yy');

            return (
              <div 
                key={page.id} 
                onClick={() => setActivePageId(page.id)}
                className="flex flex-col gap-3 group cursor-pointer"
              >
                {/* Preview Box */}
                <div className={cn(
                  "h-44 rounded-xl overflow-hidden relative transition-all duration-200",
                  "bg-[#282828] border border-transparent hover:border-[#404040] hover:bg-[#2D2D2D]"
                )}>
                  {/* Pinned Icon */}
                  {isPinned && (
                    <div className="absolute top-4 right-4 text-[#888888] z-10">
                      <Pin className="w-4 h-4 fill-current rotate-45 opacity-60" />
                    </div>
                  )}

                  {page.coverImage ? (
                    <img src={page.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-5 w-full h-full text-[13px] text-[#E0E0E0] break-words overflow-hidden opacity-90">
                      <p className="line-clamp-[7] text-left leading-relaxed font-semibold">
                        {page.previewText || page.content?.previewText || "Empty Note Content"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Title & Date */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-1.5">
                    {page.icon && <span className="text-base">{page.icon}</span>}
                    <h3 className="text-base font-medium text-[#E0E0E0] line-clamp-1">
                      {page.title || 'Untitled Note'}
                    </h3>
                  </div>
                  <span className="text-sm text-[#888888] mt-0.5">{formattedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


