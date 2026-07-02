import { useState } from 'react';
import { useAppStore, type LinkItem } from '../../store';
import { Plus, Search, Link as LinkIcon, ExternalLink, Trash2 } from 'lucide-react';
import { LinkModal } from './components/LinkModal';

export function LinkVault() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const links = useAppStore((state) => state.links) || [];
  const deleteLink = useAppStore((state) => state.deleteLink);

  const filteredLinks = links
    .filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase()));

  // Group by category
  const groupedLinks = filteredLinks.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, LinkItem[]>);

  return (
    <div className="flex flex-col h-full space-y-6 max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md text-text-main">Link Vault</h1>
          <p className="text-body-sm text-text-muted mt-1">Save and organize important resources.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-text-main text-bg-app px-4 py-2 rounded-pill text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-bg-card p-4 rounded-md border border-border-subtle">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search links..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-app border border-border-subtle rounded-sm pl-9 pr-4 py-2 text-sm text-text-main focus:outline-none focus:border-text-muted transition-colors"
          />
        </div>
      </div>

      {/* Links Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12 text-text-muted bg-bg-card rounded-lg border border-border-subtle">
            <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No links found. Add your first resource!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
              <div key={category}>
                <h2 className="text-body-lg font-medium text-text-main mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryLinks.map(link => (
                    <div 
                      key={link.id} 
                      className="bg-bg-card border border-border-subtle hover:border-text-muted transition-colors p-4 rounded-md flex flex-col justify-between group"
                    >
                      <div>
                        <h3 className="text-body-md font-medium text-text-main mb-1 line-clamp-1">{link.title}</h3>
                        <p className="text-caption text-text-muted line-clamp-1">{link.url}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                        <button 
                          onClick={() => deleteLink(link.id)}
                          className="text-text-muted hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <LinkModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
