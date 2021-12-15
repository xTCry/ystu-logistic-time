import React from 'react';
import { useSelector } from 'react-redux';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

const ColorsArr = [
  'rgba(255, 99, 132, 0.5)',
  'rgba(53, 162, 235, 0.5)',
  'rgba(76, 175, 80, 0.5)',
  'rgba(244, 67, 54, 0.5)',
  'rgba(205, 220, 57, 0.5)',
];

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Операторы',
      },
    },
    y: {
      // min: 10,
      // suggestedMax: 250,
      title: {
        display: true,
        text: 'Секунды',
      },
      // ticks: { stepSize: 5 },
    },
  },
};

const ChartTimes = () => {
  const { totalOperatorsCount, workShifts } = useSelector((state) => state.work);

  const labels = React.useMemo(
    () => Array.from(Array(totalOperatorsCount)).map((_, e) => `${e + 1}`),
    [totalOperatorsCount],
  );

  const operatorsTimes = React.useMemo(
    () =>
      workShifts
        .map((ws, i) => ({
          ...ws,
          operators: ws.operators.map((e) => ({
            ...e,
            avg: e.times.length === 0 ? null : Math.floor(e.times.reduce((a, b) => a + b, 0) / e.times.length),
          })),
          color: ColorsArr[i],
        }))
        .map((ws) => ({
          ...ws,
          avg:
            ws.operators.length === 0
              ? null
              : Math.floor(ws.operators.reduce((a, b) => a + b.avg, 0) / ws.operators.length),
        }))
        .flat(),
    [workShifts],
  );

  const datasetsWork = React.useMemo(
    () => [
      ...operatorsTimes
        .map((ws) => ({
          type: 'bar' as const,
          label: `Смена ${ws.id}`,
          data: ws.operators.map((e) => e.avg),
          backgroundColor: ws.color,
        }))
        .flat(),
      ...operatorsTimes
        .map((ws) => ({
          type: 'line' as const,
          label: `Смена ${ws.id} (средн.)`,
          borderColor: ws.color,
          borderWidth: 1,
          fill: false,
          borderDash: [5, 5],
          data: ws.operators.map(() => ws.avg),
        }))
        .flat(),
    ],
    [operatorsTimes],
  );

  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'T',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        fill: false,
        borderDash: [5, 5],
        data: labels.map(() => 120),
      },
      ...datasetsWork,
    ],
  };

  return <Chart type="bar" data={data} options={options} />;
};
export default React.memo(ChartTimes);
