import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";
import { ip } from "./appconstants";
import styles from "./style/Graph.module.css";

Chart.register(...registerables);

export default function Graphs() {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const tagsState = useSelector((state) => state.tags);
  const { selectedKeys, startDate, endDate } = tagsState;
  const folderName = useSelector((state) => state.currentFolder.folder);

  // Refs for the charts to manage instances
  const chartRefs = useRef(new Map());
  const combinedLineChartRef = useRef(null);

  useEffect(() => {
    if (!selectedKeys || !startDate || !endDate) return;

    setIsLoading(true);
    const tagsQueryParam = Object.keys(selectedKeys)
      .filter((key) => selectedKeys[key])
      .join(",");

    const fetchData = async () => {
      const query = new URLSearchParams({
        filePath: `./uploads/${folderName}/mydata/Data.csv`,
        tags: tagsQueryParam,
        startDate,
        endDate,
      }).toString();
      const url = `${ip}/process-csv?${query}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Fetching data failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedKeys, startDate, endDate]);

  useEffect(() => {
    if (chartData) {
      // Clean up old charts
      chartRefs.current.forEach((chart) => chart.destroy());
      chartRefs.current.clear();

      // Set up combined line chart for average values of all tags
      if (combinedLineChartRef.current) {
        const ctx = combinedLineChartRef.current.getContext("2d");
        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: Object.keys(chartData).map((tag) => `Tag ${tag}`),
            datasets: [
              {
                label: "Average Valuekkl",
                data: Object.values(chartData).map((data) => data.average),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          },
        });
        chartRefs.current.set(combinedLineChartRef.current, chart);
      }

      // Set up individual line charts for each tag as before
      Object.keys(chartData).forEach((tag, index) => {
        const chartContainer = document.getElementById(
          `chart-container-${tag}`
        );
        let canvas = chartContainer.querySelector("canvas");
        if (!canvas) {
          canvas = document.createElement("canvas");
          chartContainer.appendChild(canvas);
        }
        const ctx = canvas.getContext("2d");
        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Min", "Average", "Max"],
            datasets: [
              {
                label: `Data for Tag ${tag}`,
                data: [
                  chartData[tag].min,
                  chartData[tag].average,
                  chartData[tag].max,
                ],
                fill: false,
                borderColor: `hsl(${
                  (index / Object.keys(chartData).length) * 360
                }, 70%, 50%)`,
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
        chartRefs.current.set(canvas, chart);
      });
    }

    return () => {
      // Clean up charts on component unmount
      chartRefs.current.forEach((chart) => chart.destroy());
      chartRefs.current.clear();
    };
  }, [chartData]);

  return (
    <div className={styles.graphsContainer}>
      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <>
          <div className={styles.chartContainer}>
            <p>Combined Average Line Chart</p>
            <canvas
              ref={combinedLineChartRef}
              className={styles.chartCanvas}
            ></canvas>
          </div>
          {Object.keys(selectedKeys)
            .filter((key) => selectedKeys[key])
            .map((tag) => (
              <div
                key={tag}
                id={`chart-container-${tag}`}
                className={styles.chartContainer}
              >
                <p>Graph for Tag {tag}</p>
              </div>
            ))}
        </>
      )}
    </div>
  );
}
