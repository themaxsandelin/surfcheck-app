// Dependencies
import { useMemo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { IconSearch } from '@tabler/icons-react-native';
import { FlatList, TextInput } from 'react-native';
import * as Location from 'expo-location';

// Components
import Text from '../components/text';

// Utils
import { getDistanceKm } from '../utils/location';

// Types
import { ApiLocation } from '../types/api';

interface LocationPickerProps {
  locations: ApiLocation[];
  selectedLocation: ApiLocation | null;
  userLocationData: Location.LocationObject | null;
  onSelectLocation: (location: ApiLocation) => void;
}

export default function LocationPickerView({ locations, selectedLocation, userLocationData, onSelectLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const locationsMapped = useMemo(() => {
    if (!locations) {
      return [];
    }
    if (!userLocationData) {
      return locations.filter((location) => location.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return locations.map((location) => {
      const distanceFromUser = getDistanceKm(userLocationData.coords.latitude, userLocationData.coords.longitude, location.lat, location.lon);
      return {
        ...location,
        distanceFromUserKm: distanceFromUser
      };
    }).sort((a, b) => a.distanceFromUserKm - b.distanceFromUserKm).filter((location) => location.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [locations, userLocationData, searchQuery]);
  
  return (
    <View style={styles.locationPickerContainer}>
      <Text style={styles.locationPickerTitle}>Pick a spot</Text>
      <View style={styles.locationPickerSearchWrapper}>
        <IconSearch size={24} stroke="#fff" style={styles.locationPickerSearchIcon} />
        <TextInput
          style={{ ...styles.locationPickerSearchInput }}
          placeholder="Search for a spot"
          placeholderTextColor="#fff"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        horizontal={false}
        style={styles.locationPickerList}
        scrollEnabled={false}
        data={locationsMapped}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <Pressable
            style={({ pressed }) => {
              return {
                ...styles.locationPickerItem,
                marginBottom: index === locations.length - 1 ? 0 : 2,
                backgroundColor: selectedLocation?.name === item.name ? 'rgba(120, 120, 120, 0.3)' : 'rgba(120, 120, 120, 0.2)',
                borderColor: selectedLocation?.name === item.name ? '#fff' : 'transparent',
                opacity: selectedLocation?.name !== item.name && pressed ? 0.75 : 1,
              };
            }}
            onPress={() => {
              if (selectedLocation?.name === item.name) {
                return;
              }
              onSelectLocation(item);
            }}
          >
            <Text style={styles.locationPickerItemText}>{item.name}</Text>
            {item.distanceFromUserKm && (
              <Text style={styles.locationPickerItemDistance}>{`~ ${item.distanceFromUserKm.toFixed(0)}km`}</Text>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  locationPickerContainer: {
    width: '100%',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 27,
  },
  locationPickerTitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 20,
    lineHeight: 25,
    color: '#fff',
    fontWeight: 700,
    marginBottom: 32
  },
  locationPickerSearchWrapper: {
    width: '100%',
    height: 50,
    position: 'relative',
    marginBottom: 20
  },
  locationPickerSearchIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 12,
    top: 13,
    zIndex: 2
  },
  locationPickerSearchInput: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#4B4B4B',
    paddingLeft: 44,
    color: '#fff',
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 400,
    marginBottom: 20
  },
  locationPickerList: {
    width: '100%',
    flexGrow: 0,
    boxSizing: 'border-box'
  },
  locationPickerItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(120, 120, 120, 0.2)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent'
  },
  locationPickerItemText: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 400,
    color: '#fff'
  },
  locationPickerItemDistance: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 400,
    color: '#ccc'
  }
});
