import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Building, TrendingUp, DollarSign, Zap, Coins, Minus, Calculator } from 'lucide-react';
import { AssetType } from '../types/global-assets';

interface AssetTabsProps {
  activeTab: AssetType | 'simulator';
  onTabChange: (tab: AssetType | 'simulator') => void;
  children: React.ReactNode;
}

export const AssetTabs = ({ activeTab, onTabChange, children }: AssetTabsProps) => {
  const tabs = [
    { value: 'fiis', label: 'FIIs', icon: Building },
    { value: 'stocks', label: 'Ações', icon: TrendingUp },
    { value: 'etfs', label: 'ETFs', icon: DollarSign },
    { value: 'bdrs', label: 'BDRs', icon: Zap },
    { value: 'crypto', label: 'Crypto', icon: Coins },
    { value: 'commodities', label: 'Commodities', icon: Minus },
    { value: 'simulator', label: 'Simulador', icon: Calculator },
  ] as const;

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-7 bg-card/50 mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {children}
    </Tabs>
  );
};