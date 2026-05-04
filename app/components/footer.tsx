// Dependencies
import { StyleSheet, Pressable } from 'react-native';
import { Linking } from 'react-native';

// Components
import Text from './text';

export default function Footer() {
  return (
    <Pressable
      style={({ pressed }) => {
        return {
          ...styles.footer,
          opacity: pressed ? 0.75 : 1,
        };
      }}
      onPress={() => {
        Linking.openURL("mailto:christophersriggs@gmail.com?subject=Should I Surf Today?");
      }}
    >
      <Text style={styles.footerText}>© {new Date().getFullYear()} Should I Surf Today</Text>
      <Text style={{ ...styles.footerText, ...styles.footerTextHighlight }}>Feedback?</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerText: {
    fontFamily: 'SF Pro Text',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: 400,
    color: '#848484'
  },
  footerTextHighlight: {
    color: '#fff'
  }
});