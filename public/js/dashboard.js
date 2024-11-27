document.addEventListener('DOMContentLoaded', async function () {
  const ctx = document.getElementById('residencePieChart').getContext('2d');

  try {
    const response = await fetch('/api/residents-by-country');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const residentsData = await response.json();
    const labels = residentsData.map(item => item._id);
    const data = residentsData.map(item => item.count);

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Residents by Country',
        data: data,
        backgroundColor: labels.map(() => getRandomColor()),
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Residents by Country' }
        }
      }
    };

    new Chart(ctx, config);
  } catch (error) {
    console.error('Error loading chart data:', error);
  }
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
