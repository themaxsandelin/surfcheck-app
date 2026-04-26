// Dependencies
import { View, StyleSheet, Pressable } from 'react-native';

// Components
import Text from '../components/text';

// Icons
import Cross from '../icons/cross';

interface DisclaimerViewProps {
  onClose: () => void;
}

export default function DisclaimerView({ onClose }: DisclaimerViewProps) {
  return (
    <View style={styles.disclaimerContainer}>
      <View style={styles.disclaimerTopWrapper}></View>
      <View style={styles.disclaimerContentWrapper}>
        <Text style={styles.disclaimerContentText}>
          Can’t believe we have to say this.{"\n\n"}
          Use good judgment.{"\n\n"}
          If it doesn’t feel right, don’t go.
        </Text>
      </View>
      <View style={styles.disclaimerButtonWrapper}>
        <Pressable
          style={({ pressed }) => {
            return {
              ...styles.disclaimerButton,
              opacity: pressed ? 0.75 : 1,
            };
          }}
          onPress={onClose}
        >
          <Cross color="#fff" size={46} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  disclaimerContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerTopWrapper: {
    width: '100%',
    flexGrow: 1,
  },
  disclaimerContentWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  disclaimerContentText: {
    width: '100%',
    maxWidth: 280,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 40,
    lineHeight: 40,
    color: '#666666',
    textAlign: 'center',
  },
  disclaimerButtonWrapper: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  disclaimerButton: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  }
});