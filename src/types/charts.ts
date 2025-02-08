export interface ChartComponentProps {
    type: 'line' | 'bar' | 'pie';
    data: { name: string; amount: number; createdon: string; clientusername: string, amountsold?: number }[];
    title: string;
    yLabel: string;
    xLabel?: string;
}