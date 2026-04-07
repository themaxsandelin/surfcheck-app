// Dependencies
import { View, StyleSheet } from 'react-native';
import { IconLoader } from '@tabler/icons-react-native';

export default function LoadingView() {
  return (
    <View style={styles.loadingContainer}>
      <IconLoader size={24} stroke="#fff" opacity={0.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});