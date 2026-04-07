// Dependencies
import { Svg, Path } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

export default function Polygon({ color, size, style }: { color: string, size: number, style?: StyleProp<ViewStyle> }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 46 46" fill={color} style={style}>
      <Path d="M26.5355 23L36.435 32.8995L32.8995 36.4351L23 26.5356L13.1005 36.4351L9.56494 32.8995L19.4644 23L9.56494 13.1005L13.1005 9.565L23 19.4645L32.8995 9.565L36.435 13.1005L26.5355 23Z" />
    </Svg>
  );
}