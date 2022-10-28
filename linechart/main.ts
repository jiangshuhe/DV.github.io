import "./style.css";
import * as d3 from "d3";

import { lineChart } from "./line-chart";
import { Int32, Table, Utf8 } from "apache-arrow";
import { db } from "./duckdb";
import parquet from "./airquality.parquet?url";

const app = document.querySelector("#app")!;

// line chart

// Create the dropdown chart
const chart = lineChart();

async function update(Station: string) {
  const data: Table = await conn.query(`
  SELECT date_trunc('month', "Timestamp(UTC)") + INTERVAL 15 DAY as time, 
  round(avg("US AQI"), 2) as AQI, 
  round(quantile_cont("US AQI", 0.1), 2) as AQI_1, 
  round(quantile_cont("US AQI", 0.9), 2) as AQI_2,
  FROM airquality.parquet
  WHERE "Station name" = '${Station}' 
  AND AQI IS NOT NULL AND AQI_1 IS NOT NULL AND AQI_2 IS NOT NULL
  GROUP BY time 
  ORDER BY time`);

  const data1: Table = await conn.query(`
  SELECT date_trunc('day', "Timestamp(UTC)") as time1, round("US AQI", 2) as AQI1
  FROM airquality.parquet
  WHERE "Station name" = '${Station}'
  AND AQI IS NOT NULL AND AQI_1 IS NOT NULL AND AQI_2 IS NOT NULL
  GROUP BY time1, AQI1 
  ORDER BY time1`);


  const X = data.getChild("time")!.toArray();
  const Y = data.getChild("AQI")!.toArray();
  const Y_1 = data.getChild("AQI_1")!.toArray();
  const Y_2 = data.getChild("AQI_2")!.toArray();
  const X1 = data1.getChild("time1")!.toArray();
  const Y1 = data1.getChild("AQI1")!.toArray();

  // console.log(Y);
  chart.update1(X, X1, Y, Y_1, Y_2, Y1);
}


const res = await fetch(parquet);
await db.registerFileBuffer(
  "airquality.parquet",
  new Uint8Array(await res.arrayBuffer())
);


// Query DuckDB for the stations
const conn = await db.connect();


const Stations: Table<{ Station: Utf8, cnt: Int32 }> = await conn.query(`
SELECT "Station name" AS Station, count(*)::INT AS cnt
FROM airquality.parquet
GROUP BY Station 
ORDER BY cnt DESC`);


// Create a select element for the stations
const select = d3.select(app).append("select");
for (const Station of Stations) {
  select
    .append("option")
    .text(`${Station.Station} (${Station.cnt})`)
    .property("value", Station.Station);
}


select.on("change", async () => {
  const Station = select.property("value");
  update(Station);
});


update("null");


// Add the chart to the DOM
app.appendChild(chart.element);
