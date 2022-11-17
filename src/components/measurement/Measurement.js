import React, { Suspense } from "react";
import { MeasureContainer } from "../styles/Measurement.styled";
import { ChartContainer } from "../styles/ChartContainer.styled";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const TemperatureChart = React.lazy(() => import("../charts/TemperatureChart"));
const PressureChart = React.lazy(() => import("../charts/PressureChart"));
const HumidityChart = React.lazy(() => import("../charts/HumidityChart"));
const RainChart = React.lazy(() => import("../charts/RainChart"));
const WindChart = React.lazy(() => import("../charts/WindChart"));

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
        ...(parameter === "temperature" && {
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
          rain: obj.rain ? parseFloat(obj.rain["3h"].toFixed(1)) : 0,
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

const renderChart = (timestamps, timezone, str) => {
  switch (str) {
    case "temperature":
      return (
        <TemperatureChart
          data={getChartParameterForecastData(
            timestamps,
            timezone,
            "temperature"
          )}
        />
      );
    case "pressure":
      return (
        <PressureChart
          data={getChartParameterForecastData(timestamps, timezone, "pressure")}
        />
      );
    case "wind":
      return (
        <WindChart
          data={getChartParameterForecastData(timestamps, timezone, "wind")}
        />
      );
    case "humidity":
      return (
        <HumidityChart
          data={getChartParameterForecastData(timestamps, timezone, "humidity")}
        />
      );
    case "rain":
      return (
        <RainChart
          data={getChartParameterForecastData(timestamps, timezone, "rain")}
        />
      );
    default:
      break;
  }
};

const Measurement = (props) => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  // if user manually change the path => synch path with state
  const [selectValue, setSelectValue] = useState(
    location.pathname === `${match.path}`
      ? "choose"
      : location.pathname.substring(1)
  );
  console.log(props.plotData.timestamps);

  const timestamps = props.plotData.timestamps;
  const timezone = props.plotData.timezone;
  const options = ["Temperature", "Pressure", "Wind", "Humidity", "Rain"];

  const changeSelectHandler = (event) => {
    const target = event.target;
    console.log(target.value);
    setSelectValue(target.value);
    if (target.value === "choose") {
      history.push(`${match.path}`);
    } else {
      history.push(`${match.path}/${target.value}`);
    }
  };

  return (
    <MeasureContainer>
      <ChartContainer>
        <Suspense fallback={<LoadingSpinner message="Chart is loading..." />}>
          <Switch>
            {options.map((str, index) => {
              const paraToLowerCase = str.toLowerCase();
              return (
                <Route path={`${match.path}/${paraToLowerCase}`} key={index}>
                  {renderChart(timestamps, timezone, paraToLowerCase)}
                </Route>
              );
            })}
          </Switch>
        </Suspense>
      </ChartContainer>
      <div>
        <label htmlFor="parameter">Parameters</label>
        <br />
        <select
          name="parameter"
          id="parameter"
          value={selectValue}
          onChange={changeSelectHandler}
        >
          <option value="choose">--Choose--</option>
          {options.map((str, index) => (
            <option value={str.toLowerCase()} key={index}>
              {str}
            </option>
          ))}
        </select>
      </div>
    </MeasureContainer>
  );
};

export default Measurement;
