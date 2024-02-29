import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Bar } from "react-chartjs-2";
import styles from "./style/Analyze.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analyze = () => {
  const location = useLocation();
  const { selectedTag, fromDate, toDate } = location.state;

  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  // Update state to include all metrics visibility
  const [isVisible, setIsVisible] = useState({
    min: true,
    max: true,
    mean: true,
    average: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/analyzetofrom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tag: selectedTag.toString(),
            from_date: fromDate,
            to_date: toDate,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Adjust here to include all datasets
        setChartData({
          labels: data.map((d) => d.date),
          datasets: [
            {
              label: "Min",
              data: data.map((d) => d.min),
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              hidden: !isVisible.min,
            },
            {
              label: "Max",
              data: data.map((d) => d.max),
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              hidden: !isVisible.max,
            },
            {
              label: "Mean",
              data: data.map((d) => d.mean),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              hidden: !isVisible.mean,
            },
            {
              label: "Average",
              data: data.map((d) => d.average), // Assuming 'average' is provided by your backend
              borderColor: "rgb(255, 205, 86)",
              backgroundColor: "rgba(255, 205, 86, 0.5)",
              hidden: !isVisible.average,
            },
          ],
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTag, fromDate, toDate, isVisible]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        onClick: (e, legendItem, legend) => {
          // Update visibility based on legend item click
          setIsVisible({
            ...isVisible,
            [legendItem.text.toLowerCase()]:
              !isVisible[legendItem.text.toLowerCase()],
          });
        },
      },
      title: {
        display: true,
        text: "Data Analysis",
      },
    },
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analyze Component</h1>
      <p className={styles.paragraph}>Selected Tag: {selectedTag}</p>
      <p className={styles.paragraph}>From Date: {fromDate}</p>
      <p className={styles.paragraph}>To Date: {toDate}</p>

      {isLoading ? (
        <div className={styles.loader}>
          <TailSpin color="#00BFFF" height={80} width={80} />
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>Error: {error}</div>
      ) : (
        <>
          <div className={styles.toggles}>
            {Object.keys(isVisible).map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={isVisible[key]}
                  onChange={() =>
                    setIsVisible({ ...isVisible, [key]: !isVisible[key] })
                  }
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                {/* Capitalize label */}
              </label>
            ))}
          </div>
          <Bar data={chartData} options={options} />
        </>
      )}
    </div>
  );
};

export default Analyze;
