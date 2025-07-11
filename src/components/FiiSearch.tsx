import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface FiiSearchProps {
  onSearch: (ticker: string) => Promise<void>;
  isLoading: boolean;
}

export const FiiSearch = ({ onSearch, isLoading }: FiiSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Ticker necessário",
        description: "Digite o código do FII para buscar",
        variant: "destructive"
      });
      return;
    }

    await onSearch(searchTerm.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Digite o ticker (ex: KNRI11)"
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !searchTerm.trim()}
        className="bg-gradient-primary hover:opacity-90 transition-opacity"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Buscar"
        )}
      </Button>
    </form>
  );
};