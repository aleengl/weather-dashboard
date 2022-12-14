import { Legend } from "recharts";

const StyledLegend = () => {
  const changeFontSizeLegend = (value) => (
    <span style={{ fontSize: "14px" }}>{value}</span>
  );

  return (
    <Legend
      verticalAlign="top"
      height={55}
      iconSize={25}
      formatter={changeFontSizeLegend}
    />
  );
};

export default StyledLegend;
