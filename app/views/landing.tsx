// Dependencies
import { useMemo } from 'react';
import { View, Pressable, Dimensions, StyleSheet } from 'react-native';
import { IconPinned } from '@tabler/icons-react-native';

// Components
import Text from '../components/text';

// Types
import { ApiLocation } from '../types/api';

interface LandingViewProps {
  shouldISurfPress: () => void;
  selectedLocation: ApiLocation | null;
  setShowLocationPicker: (show: boolean) => void;
}

export default function LandingView({ shouldISurfPress, selectedLocation, setShowLocationPicker }: LandingViewProps) {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  
  const homeTextDetails = useMemo(() => {
    if (SCREEN_WIDTH < 400) {
      return {
        fontSize: 95,
        lineHeight: 105,
      };
    }
    return {
      fontSize: 110,
      lineHeight: 120,
    };
  }, [SCREEN_WIDTH]);


  return (
    <View style={styles.homeView}>
      <View style={{ width: '100%', flex: 1 }}></View>
      <Pressable
        style={({ pressed }) => {
          return {
            opacity: pressed ? 0.75 : 1,
          };
        }}
        onPress={shouldISurfPress}
      >
        <Text style={{ ...styles.homeText, ...homeTextDetails }}>
          Should{"\n"}I surf{"\n"}today?
        </Text>
      </Pressable>
      <View style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 43 }}>
        {selectedLocation && (
          <Pressable
            style={({ pressed }) => {
              return {
                ...styles.homeLocationButton,
                opacity: pressed ? 0.75 : 1,
              };
            }}
            onPress={() => {
              setShowLocationPicker(true);
            }}
          >
            <View style={{ width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <IconPinned size={18} stroke="#fff" />
            </View>
            <Text style={styles.homeLocationButtonText}>{selectedLocation.name}</Text>
            <View style={{ width: 40, height: 40 }}></View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeView: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  homeText: {
    width: '100%',
    maxWidth: 270,
    textDecorationLine: 'underline',
    fontFamily: 'BebasNeue_400Regular',
    color: '#fff',
    textAlign: 'center',
  },
  homeLocationButton: {
    width: '100%',
    maxWidth: 250,
    height: 40,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  homeLocationButtonText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Abel_400Regular',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 400,
    color: '#fff'
  },
});