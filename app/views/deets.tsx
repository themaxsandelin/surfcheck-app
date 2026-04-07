// Dependencies
import { useMemo } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { DateTime } from 'luxon';

// Components
import Polygon from '../icons/polygon';

// Types
import { ShouldISurfApiResponse } from '../types/api';

interface DeetsViewProps {
  shouldISurfData: ShouldISurfApiResponse;
  onClose: () => void;
}

export default function DeetsView({ shouldISurfData, onClose }: DeetsViewProps) {
  const dataTime = useMemo(() => {
    if (!shouldISurfData) {
      return '';
    }

    return DateTime.fromISO(shouldISurfData.weatherData.time, { zone: 'UTC' }).toFormat('h:mm a');
  }, [shouldISurfData]);

  const deets = useMemo(() => {
    if (!shouldISurfData) {
      return [];
    }

    return [
      {
        label: 'Location',
        value: shouldISurfData.weatherData.location.name,
      },
      {
        label: 'Wave Height',
        value: `${shouldISurfData.weatherData.waves.height} ${shouldISurfData.weatherData.waves.heightUnit}`,
      },
      {
        label: 'Swell Direction',
        value: shouldISurfData.weatherData.swell.direction,
      },
      {
        label: 'Wind',
        value: `${shouldISurfData.weatherData.wind.speed} ${shouldISurfData.weatherData.wind.speedUnit} ${shouldISurfData.weatherData.wind.direction}`,
      },
      {
        label: 'Weather',
        value: `${shouldISurfData.weatherData.temperature.value} ${shouldISurfData.weatherData.temperature.unit}`,
      },
      {
        label: 'Tide',
        value: `${shouldISurfData.weatherData.tide.height} ${shouldISurfData.weatherData.tide.heightUnit} / ${tideHeight} @ ${dataTime}`,
      },
      {
        label: 'Conditions',
        value: "It'll do",
      }
    ];
  }, [shouldISurfData]);

  const tideHeight = useMemo(() => {
    if (!shouldISurfData) {
      return '';
    }
    if (shouldISurfData.weatherData.tide.height === 0) {
      return 'Even';
    }

    return shouldISurfData.weatherData.tide.height < 0 ? 'Low' : 'High';
  }, [shouldISurfData]);

  const tideRotate = useMemo(() => {
    return tideHeight === 'Low' ? '180deg' : '0deg';
  }, [tideHeight]);

  return (
    <View style={styles.deetsContainer}>
      <View style={styles.deetsCard}>
        <Text style={styles.deetsTitle}>Go get some</Text>
        <FlatList
          scrollEnabled={false}
          data={deets}
          keyExtractor={(item) => item.label}
          renderItem={({ item, index }) => (
            <View style={{ ...styles.deetsItem, borderBottomWidth: index === deets.length - 1 ? 0 : 2 }}>
              <Text style={styles.deetsItemText}>{item.label}</Text>
              <View style={styles.deetsItemTextWrapper}>
                {item.label === 'Tide' && (
                  <Polygon
                    color="#fff"
                    size={10}
                    style={{ transform: [{ rotate: tideRotate }] }}
                  />
                )}
                <Text style={styles.deetsItemText}>{item.value}</Text>
              </View>
            </View>
          )}
        />
        <Pressable
          style={({ pressed }) => {
            return {
              ...styles.deetsButton,
              opacity: pressed ? 0.75 : 1,
            };
          }}
          onPress={onClose}
        >
          <Text style={styles.deetsButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deetsContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    padding: 16
  },
  deetsCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'solid',
    padding: 16,
  },
  deetsTitle: {
    width: '100%',
    fontFamily: 'Abel_400Regular',
    fontSize: 45,
    lineHeight: 58,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 400,
    marginTop: 19,
    marginBottom: 35
  },
  deetsItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    borderStyle: 'solid'
  },
  deetsItemTextWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  deetsItemText: {
    fontFamily: 'Abel_400Regular',
    fontSize: 20,
    lineHeight: 26,
    color: '#fff',
    fontWeight: 400
  },
  deetsButton: {
    width: '100%',
    height: 50,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    marginTop: 32
  },
  deetsButtonText: {
    fontFamily: 'Abel_400Regular',
    fontSize: 20,
    lineHeight: 26,
    color: '#fff',
    fontWeight: 400,
  }
});