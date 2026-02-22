// Dependencies
import { Svg, Path } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

export default function Polygon({ color, size, style }: { color: string, size: number, style?: StyleProp<ViewStyle> }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <Path d="M12 2L2 22h20L12 2z" />
    </Svg>
  );
}