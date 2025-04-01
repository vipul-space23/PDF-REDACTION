
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export default function SummaryCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  className
}: SummaryCardProps) {
  return (
    <div className={cn(
      "glass-card p-6 rounded-lg flex flex-col space-y-4 animate-fade-in",
      className
    )}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-softWhite/70">{title}</p>
        <div className="p-2 rounded-full bg-cyberBlue/80">{icon}</div>
      </div>
      <div>
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend && trendValue && (
          <p className={cn(
            "text-xs flex items-center",
            trend === 'up' ? 'text-neonGreen' : trend === 'down' ? 'text-red-500' : 'text-softWhite/50'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </p>
        )}
      </div>
    </div>
  );
}
