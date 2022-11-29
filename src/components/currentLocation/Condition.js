import sprite_symbols from "../../img/sprite_symbols.svg";
import { StyledCondition } from "../styles/Condition.styled";
import { StyleCloudSun } from "../styles/Icon.styled";

const Condition = (props) => {
  const iconClass = `owf owf-${props.weatherCode}-${props.daytime} owf-4x`;

  return (
    <StyledCondition>
      <div>
        {props.icon ? (
          <i className={iconClass}></i>
        ) : (
          <StyleCloudSun>
            <use xlinkHref={`${sprite_symbols}#${"icon-cloud-sun"}`}></use>
          </StyleCloudSun>
        )}
      </div>
      <p>{props.temperature ? `${props.temperature.toFixed(1)}°C` : "15°C"}</p>
      <span>{props.description ? props.description : "sun"}</span>
    </StyledCondition>
  );
};

export default Condition;
