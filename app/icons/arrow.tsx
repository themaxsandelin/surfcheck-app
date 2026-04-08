// Dependencies
import { Svg, Path } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

export default function Polygon({ color, size, style }: { color: string, size: number, style?: StyleProp<ViewStyle> }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill={color} style={style}>
      <Path d="M11 10L11 17.5L9 17.5L9 10L5.66992 10L10 2.5L14.3301 10L11 10Z" />
    </Svg>
  );
}