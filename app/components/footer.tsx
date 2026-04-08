// Dependencies
import { StyleSheet, Pressable } from 'react-native';

// Components
import Text from './text';

interface FooterProps {
  onPress: () => void;
}

export default function Footer({ onPress }: FooterProps) {
  return (
    <Pressable
      style={({ pressed }) => {
        return {
          ...styles.footer,
          opacity: pressed ? 0.75 : 1,
        };
      }}
      onPress={onPress}
    >
      <Text style={styles.footerText}>© {new Date().getFullYear()} Should I Surf Today</Text>
      <Text style={{ ...styles.footerText, ...styles.footerTextHighlight }}>Powered by Optimism</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerText: {
    fontFamily: 'SF Pro Text',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: 400,
    color: '#848484'
  },
  footerTextHighlight: {
    color: '#fff'
  }
});