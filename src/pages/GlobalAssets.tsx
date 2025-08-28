import { useState, useEffect } from 'react';
import { Asset, AssetType } from '../types/global-assets';
import { globalApiService } from '../services/globalApiService';
import { AssetCard } from '../components/AssetCard';
import { GlobalSearch } from '../components/GlobalSearch';
import { AssetTabs } from '../components/AssetTabs';
import { FiiSimulator } from '../components/FiiSimulator';
import { useToast } from '@/hooks/use-toast';
import { Building, Globe, Loader2, Wifi, TrendingUp, DollarSign, Activity } from 'lucide-react';

const GlobalAssets = () => {
  const [assets, setAssets] = useState<Record<AssetType, Asset[]>>({
    fiis: [],
    stocks: [],
    etfs: [],
    bdrs: [],
    crypto: [],
    commodities: []
  });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AssetType | 'simulator'>('fiis');
  const { toast } = useToast();

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Carregar dados em paralelo para melhor performance
        const [fiis, stocks, etfs, bdrs, cryptos, commodities] = await Promise.allSettled([
          globalApiService.getTopFiis(),
          globalApiService.getTopDividendStocks(),
          globalApiService.getTopETFs(),
          globalApiService.getTopBDRs(),
          globalApiService.getTopCryptos(),
          globalApiService.getTopCommodities()
        ]);

        setAssets({
          fiis: fiis.status === 'fulfilled' ? fiis.value : [],
          stocks: stocks.status === 'fulfilled' ? stocks.value : [],
          etfs: etfs.status === 'fulfilled' ? etfs.value : [],
          bdrs: bdrs.status === 'fulfilled' ? bdrs.value : [],
          crypto: cryptos.status === 'fulfilled' ? cryptos.value : [],
          commodities: commodities.status === 'fulfilled' ? commodities.value : []
        });

        const totalLoaded = Object.values(assets).flat().length;
        toast({
          title: "Dados carregados!",
          description: `${totalLoaded} ativos carregados de mercados globais`,
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Usando dados de demonstração",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [toast]);

  const handleSearch = async (query: string, assetType?: AssetType) => {
    setIsSearching(true);
    try {
      const results = await globalApiService.searchAsset(query, assetType);
      
      if (results.length > 0) {
        // Adicionar os resultados encontrados às respectivas categorias
        const newAssets = { ...assets };
        
        results.forEach(asset => {
          // Determinar o tipo do asset baseado em suas propriedades
          let type: AssetType = 'stocks'; // default
          
          if ('sector' in asset && 'netWorth' in asset) type = 'fiis';
          else if ('category' in asset && 'totalAssets' in asset) type = 'etfs';
          else if ('underlyingAsset' in asset) type = 'bdrs';
          else if ('symbol' in asset && 'rank' in asset) type = 'crypto';
          else if ('unit' in asset) type = 'commodities';
          
          // Adicionar se não existir
          const exists = newAssets[type].some(a => a.ticker === asset.ticker);
          if (!exists) {
            newAssets[type] = [asset, ...newAssets[type]];
          }
        });
        
        setAssets(newAssets);
        setActiveTab(assetType || 'fiis'); // Mudar para a aba relevante
        
        toast({
          title: "Ativos encontrados!",
          description: `${results.length} resultado(s) para "${query}"`,
        });
      } else {
        toast({
          title: "Nenhum ativo encontrado",
          description: `Não foi possível encontrar dados para "${query}"`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o ativo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    // TODO: Implementar modal de detalhes
  };

  const getCurrentAssets = () => {
    if (activeTab === 'simulator') return [];
    return assets[activeTab as AssetType] || [];
  };

  const getGlobalStats = () => {
    const allAssets = Object.values(assets).flat();
    const totalAssets = allAssets.length;
    const avgYield = allAssets
      .filter(asset => 'dividendYield' in asset && asset.dividendYield)
      .reduce((acc, asset) => acc + (asset as any).dividendYield, 0) / 
      allAssets.filter(asset => 'dividendYield' in asset).length || 0;
    
    const positiveAssets = allAssets.filter(asset => asset.priceChange > 0).length;
    const positivePercentage = totalAssets > 0 ? (positiveAssets / totalAssets) * 100 : 0;

    return { totalAssets, avgYield, positivePercentage };
  };

  const stats = getGlobalStats();

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  Global Assets Monitor
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <Wifi className="w-5 h-5 text-success" />
                  )}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {isLoading ? 'Carregando dados globais...' : 'Mercados globais • Dados em tempo real'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <GlobalSearch onSearch={handleSearch} isLoading={isSearching} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AssetTabs activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'simulator' ? (
            <FiiSimulator fiis={assets.fiis as any} />
          ) : (
            <>
              {/* Global Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-card border border-border/50 rounded-lg p-6 animate-slide-up">
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="w-5 h-5 text-warning" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Ativos Globais
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.totalAssets}</p>
                  <p className="text-muted-foreground text-sm">
                    Monitorados em tempo real
                  </p>
                </div>

                <div className="bg-gradient-card border border-border/50 rounded-lg p-6 animate-slide-up [animation-delay:100ms]">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-success" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Yield Médio
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-success">
                    {stats.avgYield.toFixed(2)}%
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Rendimento de dividendos
                  </p>
                </div>

                <div className="bg-gradient-card border border-border/50 rounded-lg p-6 animate-slide-up [animation-delay:200ms]">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-info" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Mercado
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-info">
                    {stats.positivePercentage.toFixed(0)}%
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Ativos em alta
                  </p>
                </div>
              </div>

              {/* Assets Grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    {activeTab === 'fiis' && 'FIIs Brasileiros'}
                    {activeTab === 'stocks' && 'Ações com Dividendos'}
                    {activeTab === 'etfs' && 'ETFs Globais'}
                    {activeTab === 'bdrs' && 'BDRs Brasileiros'}
                    {activeTab === 'crypto' && 'Criptomoedas'}
                    {activeTab === 'commodities' && 'Commodities'}
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
                    {getCurrentAssets().map((asset, index) => (
                      <div 
                        key={asset.ticker}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <AssetCard 
                          asset={asset} 
                          assetType={activeTab as AssetType}
                          onClick={handleAssetClick} 
                        />
                      </div>
                    ))}
                  </div>
                )}

                {!isLoading && getCurrentAssets().length === 0 && (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhum ativo encontrado
                    </h3>
                    <p className="text-muted-foreground">
                      Use a busca para encontrar ativos específicos
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </AssetTabs>
      </main>
    </div>
  );
};

export default GlobalAssets;