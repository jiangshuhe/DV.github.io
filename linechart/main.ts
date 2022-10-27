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
  SELECT date_trunc('month', "Timestamp(UTC)") + INTERVAL 15 DAY as t, round(avg("US AQI"), 2) as a_aqi
  FROM airquality.parquet
  WHERE "Station name" = '${Station}'
  GROUP BY t 
  ORDER BY t`);


  const X1 = data.getChild("t")!.toArray();
  const Y1 = data.getChild("a_aqi")!.toArray();


  console.log(Y1);
  chart.update(X1, Y1);
}


const res = await fetch(parquet);
await db.registerFileBuffer(
  "airquality.parquet",
  new Uint8Array(await res.arrayBuffer())
);


// Query DuckDB for the stations
const conn = await db.connect();


const Stations: Table<{ Station: Utf8, cnt: Int32 }> = await conn.query(`
SELECT "Station name" as Station, count(*)::INT as cnt
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


update("Lawrenceville");

// Raw data


// Add the chart to the DOM
app.appendChild(chart.element);
