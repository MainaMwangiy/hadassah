import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts, { Options } from 'highcharts';
import dayjs from 'dayjs';

interface ChartComponentProps {
    type: 'line' | 'bar' | 'pie';
    data: { name: string; amount: number; createdon: string; clientusername: string, amountsold?: number }[];
    title: string;
    yLabel: string;
    xLabel?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type, data, title, yLabel, xLabel }) => {
    let seriesData;
    if (type === 'pie') {
        seriesData = data.reduce((acc: any[], item) => {
            const foundIndex = acc.findIndex((d) => d.name === item.clientusername);
            if (foundIndex !== -1) {
                acc[foundIndex].y += Number(item.amount);
            } else {
                acc.push({
                    name: item.clientusername,
                    y: Number(item.amount),
                });
            }
            return acc;
        }, []);
    } else {
        seriesData = data.map((item) => ({
            name: item.name,
            y: Number(item.amount || item.amountsold),
            category: dayjs(item.createdon).format('DD-MM-YYYY'),
        }));

        if (type === 'bar') {
            seriesData = seriesData.sort((a, b) => b.y - a.y).slice(0, 10);
        }
    }

    const options: Options = {
        chart: {
            type: type,
        },
        title: {
            text: title,
        },
        xAxis: {
            categories: type === 'pie' ? undefined : seriesData.map((item: any) => item.category),
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
                data: seriesData,
                type: type,
                name: title,
                dataLabels: {
                    enabled: type !== 'line',
                    format: type === 'pie' ? '<b>{point.name}</b>: {point.y}' : '{point.y}',
                },
            },
        ],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}',
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
