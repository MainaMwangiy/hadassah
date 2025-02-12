import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts, { Options } from 'highcharts';
import dayjs from 'dayjs';

interface ChartData {
  name: string;
  y: number;
  category?: string;
}

interface ChartComponentProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  title: string;
  yLabel: string;
  xLabel?: string;
  seriesData: ChartData[]; 
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type, data, title, yLabel, xLabel, seriesData }) => {
    let chartData: ChartData[] = [];
  
    if (type === 'pie') {
      chartData = seriesData;
    } else if (type === 'bar') {
      chartData = seriesData;
    } else {
      chartData = data.map(item => ({
        name: item.name,
        y: Number(item.sellingprice || item.amount || item.amountsold),
        category: dayjs(item.createdon).format('DD-MM-YYYY'),
      }));
    }
  
    const options: Options = {
      chart: {
        type: type,
      },
      title: {
        text: title,
      },
      xAxis: {
        categories: type === 'pie' ? undefined : chartData.map((item: any) => item.category || item.name),
        title: {
          text: xLabel,
        },
      },
      yAxis: {
        title: {
          text: yLabel,
        },
      },
      series: [
        {
          data: chartData,
          type: type,
          name: title,
          dataLabels: {
            enabled: type !== 'line',
            format: type === 'pie' ? '<b>{point.name}</b>: {point.percentage:.1f}%' : '{point.y}',
          },
        },
      ],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          },
        },
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y}',
          },
        },
        line: {
          dataLabels: {
            enabled: false,
          },
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 600,
            },
            chartOptions: {
              legend: {
                enabled: false,
              },
            },
          },
        ],
      },
      credits: {
        enabled: false,
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }; 

export default ChartComponent;
