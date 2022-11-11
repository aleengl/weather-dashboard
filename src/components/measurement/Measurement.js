import { MeasureContainer } from "../styles/Measurement.styled";
import TemperatureChart from "../charts/TemperatureChart";
import PressureChart from "../charts/PressureChart";
import HumidityChart from "../charts/HumidityChart";
import RainChart from "../charts/RainChart";
import WindChart from "../charts/WindChart";
import { ChartContainer } from "../styles/ChartContainer.styled";

const getChartParameterForecastData = (timestamps, timezone, parameter) => {
  if (timestamps && timezone) {
    return timestamps.map((obj) => {
      const date = new Date(obj["dt_txt"]);
      const timestampInMs = date.getTime();
      const unixTime = Math.floor(timestampInMs / 1000) + timezone;
      const time = new Date(unixTime * 1000).toLocaleString("de-DE", {
        hour: "numeric",
        minute: "numeric",
      });

      return {
        time: time,
        ...(parameter === "temp" && {
          temp: parseFloat(obj.main.temp.toFixed(1)),
          temp_min: parseFloat(obj.main.temp_min.toFixed(1)),
          temp_max: parseFloat(obj.main.temp_max.toFixed(1)),
        }),
        ...(parameter === "pressure" && {
          pressure: obj.main.pressure,
          grnd_level: obj.main.grnd_level,
          sea_level: obj.main.sea_level,
        }),
        ...(parameter === "humidity" && { humidity: obj.main.humidity }),
        ...(parameter === "rain" && {
          rain: parseFloat(obj.rain["3h"].toFixed(1)),
        }),
        ...(parameter === "wind" && {
          speed: parseFloat((obj.wind.speed * 3.6).toFixed(1)),
          gust: parseFloat((obj.wind.gust * 3.6).toFixed(1)),
          deg: obj.wind.deg,
        }),
      };
    });
  }

  return [];
};

const Measurement = (props) => {
  console.log(props.plotData.timestamps);
  // console.log(props.error);

  const plotChartData = getChartParameterForecastData(
    props.plotData.timestamps,
    props.plotData.timezone,
    "temp"
  );

  return (
    <MeasureContainer>
      <ChartContainer>
        <TemperatureChart data={plotChartData} />
      </ChartContainer>
      <div>
        <label htmlFor="parameter">Parameters</label>
        <br />
        <select name="parameter" id="parameter">
          <option value="Temperature">Temperature</option>
          <option value="Pressure">Pressure</option>
          <option value="Wind">Wind</option>
          <option value="Visibility">Humidity</option>
          <option value="Rain">Rain</option>
        </select>
      </div>
    </MeasureContainer>
  );
};

export default Measurement;
