import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function MyChart({ option, height = 350 }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        chart.setOption(option);

        const handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.dispose();
        };
    }, [option]);

    return <div ref={chartRef} style={{ width: "100%", height }} />;
}
