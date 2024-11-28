import type { ForecastData } from '@/api/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

import { LineChart, Line } from 'recharts';
import { time } from 'console';

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}
const HourlyTemperature = ({ data }: HourlyTemperatureProps) => {
  // Get today's forecast data and format for chart

  const chartData: ChartData[] = data.list
    .slice(0, 8) // Get next 24 hours (3-hour intervals)
    .map((item) => ({
      time: format(new Date(item.dt * 1000), 'ha'),
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
    }));

  console.log({ chartData });
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h=[200px] w-full">
          <ResponsiveContainer width={'100%'} height={'100%'}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemperature;
