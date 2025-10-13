import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function SalesChart({ monthly }) {
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: monthly,
        borderColor: 'rgb(59,130,246)',
        backgroundColor: 'rgba(59,130,246,0.2)',
        tension: 0.3,
      },
    ],
  }
  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } },
  }
  return (
    <div className="bg-white border rounded p-4">
      <Line data={data} options={options} />
    </div>
  )
}