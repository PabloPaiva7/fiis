import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AssetType } from '../types/global-assets';

interface GlobalSearchProps {
  onSearch: (query: string, assetType?: AssetType) => void;
  isLoading?: boolean;
}

export const GlobalSearch = ({ onSearch, isLoading = false }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [assetType, setAssetType] = useState<AssetType | 'all'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), assetType === 'all' ? undefined : assetType);
    }
  };

  const assetTypeOptions = [
    { value: 'all', label: 'Todos os ativos' },
    { value: 'fiis', label: 'FIIs' },
    { value: 'stocks', label: 'Ações' },
    { value: 'etfs', label: 'ETFs' },
    { value: 'bdrs', label: 'BDRs' },
    { value: 'crypto', label: 'Criptomoedas' },
    { value: 'commodities', label: 'Commodities' }
  ];

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Pesquisar por ticker ou nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <Select value={assetType} onValueChange={(value) => setAssetType(value as AssetType | 'all')}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {assetTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        type="submit" 
        disabled={isLoading || !query.trim()}
        className="px-4"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
};