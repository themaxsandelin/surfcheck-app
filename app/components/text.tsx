// Dependencies
import { Text as RNText, StyleProp, TextStyle } from 'react-native';

export default function Text({ children, style, ...props }: { children: React.ReactNode, style?: StyleProp<TextStyle>, allowFontScaling?: boolean }) {
  return (
    <RNText style={style} allowFontScaling={false} {...props}>{children}</RNText>
  );
}