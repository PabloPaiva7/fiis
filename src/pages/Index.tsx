import { useState, useEffect } from 'react';
import { FII } from '../types/fii';
import { fiiApiService } from '../services/fiiApiService';
import { FiiCard } from '../components/FiiCard';
import { FiiSearch } from '../components/FiiSearch';
import { FiiDetailModal } from '../components/FiiDetailModal';
import { FiiSimulator } from '../components/FiiSimulator';
import { TradingDashboard } from '../components/TradingDashboard';
import { useToast } from '@/hooks/use-toast';
import { Building, TrendingUp, Search, Star, Loader2, Wifi, Calculator, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [fiis, setFiis] = useState<FII[]>([]);
  const [selectedFii, setSelectedFii] = useState<FII | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'monitor' | 'simulator' | 'trading'>('monitor');
  const { toast } = useToast();

  // Carregar FIIs principais na inicialização
  useEffect(() => {
    const loadTopFiis = async () => {
      setIsLoading(true);
      try {
        const topFiis = await fiiApiService.getTopFiis();
        setFiis(topFiis);
        toast({
          title: "Dados carregados!",
          description: `${topFiis.length} FIIs carregados com dados reais da B3`,
        });
      } catch (error) {
        console.error('Erro ao carregar FIIs:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Usando dados de demonstração",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTopFiis();
  }, [toast]);

  const handleSearch = async (ticker: string) => {
    setIsSearching(true);
    try {
      const result = await fiiApiService.fetchFiiData(ticker);
      if (result) {
        // Adicionar o FII encontrado ao topo da lista se não existir
        const exists = fiis.some(fii => fii.ticker === result.ticker);
        if (!exists) {
          setFiis([result, ...fiis]);
        }
        setSelectedFii(result);
        setIsModalOpen(true);
        toast({
          title: "FII encontrado!",
          description: `${result.ticker} - ${result.name} (dados reais)`,
        });
      } else {
        toast({
          title: "FII não encontrado",
          description: `Não foi possível encontrar dados para ${ticker}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o FII. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFiiClick = (fii: FII) => {
    setSelectedFii(fii);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFii(null);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Building className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  FIIs Monitor
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <Wifi className="w-5 h-5 text-success" />
                  )}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {isLoading ? 'Carregando dados reais...' : 'Dados reais da B3 • Atualizados'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 bg-card/50 rounded-lg p-1">
                <Button
                  variant={activeTab === 'monitor' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('monitor')}
                  className="flex items-center gap-2"
                >
                  <Building className="w-4 h-4" />
                  Monitor
                </Button>
                <Button
                  variant={activeTab === 'simulator' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('simulator')}
                  className="flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Simulador
                </Button>
                <Button
                  variant={activeTab === 'trading' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('trading')}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Trading AI
                </Button>
              </div>
              
              {activeTab === 'monitor' && (
                <FiiSearch onSearch={handleSearch} isLoading={isSearching} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'monitor' ? (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-card border border-border/50 rounded-lg p-6 animate-slide-up">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-warning" />
                  <h3 className="text-lg font-semibold text-foreground">
                    FIIs Monitorados
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{fiis.length}</p>
                <p className="text-muted-foreground text-sm">
                  Principais fundos da B3
                </p>
              </div>

              <div className="bg-gradient-card border border-border/50 rounded-lg p-6 animate-slide-up [animation-delay:100ms]">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Yield Médio
                  </h3>
                </div>
                <p className="text-3xl font-bold text-success">
                  {fiis.length > 0 ? (fiis.reduce((acc, fii) => acc + fii.dividendYield, 0) / fiis.length).toFixed(2) : '0.00'}%
                </p>
                <p className="text-muted-foreground text-sm">
                  Dividend yield dos FIIs
                </p>
              </div>

              <div className="bg-gradient-card border border-border/50 rounded-lg p-6 animate-slide-up [animation-delay:200ms]">
                <div className="flex items-center gap-3 mb-2">
                  <Search className="w-5 h-5 text-info" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Busca Avançada
                  </h3>
                </div>
                <p className="text-3xl font-bold text-info">Ativa</p>
                <p className="text-muted-foreground text-sm">
                  Pesquise qualquer FII
                </p>
              </div>
            </div>

            {/* FIIs Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Principais FIIs
                </h2>
                <p className="text-muted-foreground text-sm">
                  Clique em um card para ver detalhes
                </p>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gradient-card border border-border/50 rounded-lg p-6 animate-pulse">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="h-6 w-20 bg-muted rounded"></div>
                            <div className="h-4 w-32 bg-muted rounded"></div>
                          </div>
                          <div className="h-6 w-16 bg-muted rounded"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="h-4 w-20 bg-muted rounded"></div>
                            <div className="h-6 w-16 bg-muted rounded"></div>
                          </div>
                          <div className="flex justify-between">
                            <div className="h-4 w-24 bg-muted rounded"></div>
                            <div className="h-4 w-20 bg-muted rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {fiis.map((fii, index) => (
                    <div 
                      key={fii.ticker}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <FiiCard fii={fii} onClick={() => handleFiiClick(fii)} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : activeTab === 'simulator' ? (
          <FiiSimulator fiis={fiis} />
        ) : (
          <TradingDashboard fiis={fiis} />
        )}
      </main>

      {/* Modal */}
      <FiiDetailModal
        fii={selectedFii}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
