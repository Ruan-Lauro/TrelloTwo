import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressChartProps {
  concluded?: number;
  impeditive?: number;
  late?: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  concluded = 55, 
  impeditive = 12, 
  late = 12 
}) => {
  const data = {
    labels: ['Concluído', 'Impedativo', 'Em atraso'],
    datasets: [
      {
        data: [concluded, impeditive, late],
        backgroundColor: [
          '#48bb78', 
          '#ecc94b', 
          '#f56565'  
        ],
        hoverBackgroundColor: [
          '#38a169',
          '#d69e2e',
          '#e53e3e'
        ]
      }
    ]
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.formattedValue}%`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="bg-white flex flex-col pb-3">
      <div className="flex text-center mb-4">
         <h2 className="font-bold xl:text-[24px] text-2 truncate max-xl:max-w-[100px] text-center w-full">Progresso</h2>
      </div>
      <div className="flex max-3xl:flex-col items-center">
        <div className="p-4 flex-grow relative 3xl:w-2/3">
          <div className="w-full h-full">
            <Doughnut data={data} options={options} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-2xl font-bold text-gray-700">{concluded}%</span>
              <p className="text-sm text-gray-500">Projeto dentro do prazo</p>
            </div>
          </div>
        </div>
        <div className="3xl:w-1/3 flex flex-col justify-center pr-4 space-y-2">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#48bb78] mr-2"></span>
            <span className="text-sm text-gray-700 mr-2">Concluído</span>
            <span className="text-sm font-bold text-gray-700">{concluded}%</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#ecc94b] mr-2"></span>
            <span className="text-sm text-gray-700 mr-2">Impedativo</span>
            <span className="text-sm font-bold text-gray-700">{impeditive}%</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#f56565] mr-2"></span>
            <span className="text-sm text-gray-700 mr-2">Em atraso</span>
            <span className="text-sm font-bold text-gray-700">{late}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;