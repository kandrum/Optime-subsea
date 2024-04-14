import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";
import { ip } from "./appconstants";
import styles from "./style/Graph.module.css";
import wrong from "./wrong.jpg";
Chart.register(...registerables);

export default function Graphs() {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const tagsState = useSelector((state) => state.tags);
  const { selectedKeys, startDate, endDate } = tagsState;
  const folderName = useSelector((state) => state.currentFolder.folder);

  const chartRefs = useRef(new Map());
  const combinedLineChartRef = useRef(null);
  const dailyAverageChartRef = useRef(null);

  useEffect(() => {
    if (!selectedKeys || !startDate || !endDate) return;

    setError(null);
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
        setError(
          "I CANNOT FIND THE DATES OR TAGS SELECTED, SELECT THE TAGS WHICH ARE AVAILABLE IN THE DATA."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedKeys, startDate, endDate, folderName]);

  useEffect(() => {
    if (chartData) {
      chartRefs.current.forEach((chart) => chart.destroy());
      chartRefs.current.clear();

      // Combined Line Chart for all tag averages
      if (combinedLineChartRef.current) {
        const ctx = combinedLineChartRef.current.getContext("2d");
        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: Object.keys(chartData.stats).map((tag) => `Tag ${tag}`),
            datasets: [
              {
                label: "Average Value for Selected Tags",
                data: Object.values(chartData.stats).map(
                  (data) => data.average
                ),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          },
        });
        chartRefs.current.set(combinedLineChartRef.current, chart);
      }

      // Daily Average Chart
      if (dailyAverageChartRef.current) {
        const ctx = dailyAverageChartRef.current.getContext("2d");
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: Object.keys(chartData.date_averages),
            datasets: [
              {
                label: "Daily Average",
                data: Object.values(chartData.date_averages),
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
        chartRefs.current.set(dailyAverageChartRef.current, chart);
      }

      // Individual Charts for each tag
      Object.keys(chartData.stats).forEach((tag) => {
        const tagData = chartData.stats[tag];
        const canvasId = `canvas-tag-${tag}`;
        let canvas = document.getElementById(canvasId);
        if (!canvas) {
          const container = document.createElement("div");
          container.className = styles.chartContainer;
          container.innerHTML = `<p>Graph for Tag ${tag}</p>`;
          canvas = document.createElement("canvas");
          canvas.id = canvasId;
          container.appendChild(canvas);
          document
            .querySelector(`.${styles.graphsContainer}`)
            .appendChild(container);
        }
        const ctx = canvas.getContext("2d");
        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Min", "Average", "Max"],
            datasets: [
              {
                label: `Data for Tag ${tag}`,
                data: [tagData.min, tagData.average, tagData.max],
                fill: false,
                borderColor: `hsl(${
                  (parseInt(tag) / Object.keys(chartData.stats).length) * 360
                }, 70%, 50%)`,
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
        chartRefs.current.set(canvas, chart);
      });
    }

    return () => {
      chartRefs.current.forEach((chart) => chart.destroy());
      chartRefs.current.clear();
    };
  }, [chartData]);

  return (
    <div className={styles.graphsContainer}>
      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>
          {error}
          <img src={wrong} alt="Error" />
        </div>
      ) : (
        <>
          <div className={styles.chartContainer}>
            <p>Combined Average Line Chart</p>
            <canvas
              ref={combinedLineChartRef}
              className={styles.chartCanvas}
            ></canvas>
          </div>
          <div className={styles.chartContainer}>
            <p>Daily Average Chart</p>
            <canvas
              ref={dailyAverageChartRef}
              className={styles.chartCanvas}
            ></canvas>
          </div>
          {Object.keys(chartData?.stats || {}).map((tag) => (
            <div
              key={`chart-container-${tag}`}
              className={styles.chartContainer}
            >
              <p>Graph for Tag {tag}</p>
              <canvas
                id={`canvas-tag-${tag}`}
                className={styles.chartCanvas}
              ></canvas>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
