import React from 'react';
import { Users, Briefcase, User, Eye, DollarSign } from 'lucide-react';

function OverviewCard() {
  const cards = [
    {
      id: 1,
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      bgColor: 'bg-blue-500',
      isPositive: true
    },
    {
      id: 2,
      title: 'Active Providers',
      value: '342',
      change: '+8.3%',
      icon: Briefcase,
      bgColor: 'bg-purple-500',
      isPositive: true
    },
    {
      id: 3,
      title: 'Active Clients',
      value: '2,505',
      change: '+15.2%',
      icon: User,
      bgColor: 'bg-blue-500',
      isPositive: true
    },
    {
      id: 4,
      title: 'Total Listings',
      value: '1,234',
      change: '+18.7%',
      icon: Eye,
      bgColor: 'bg-cyan-500',
      isPositive: true
    },
    {
      id: 5,
      title: 'Total Revenue',
      value: 'AED 185,400',
      change: '+23.1%',
      icon: DollarSign,
      bgColor: 'bg-green-500',
      isPositive: true
    }
  ]; 
  return (
    <div className="flex gap-4 flex-wrap p-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-sm p-6 flex-1 min-w-[200px] hover:shadow-md transition-shadow border border-[#0000001A]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span>{card.change}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OverviewCard;