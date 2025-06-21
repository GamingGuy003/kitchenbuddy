import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ItemSeparator } from './listComponents';
import { FontAwesome5 } from '@expo/vector-icons';
import CommonStyles from '../constants/commonStyle';

type IconName = keyof typeof FontAwesome5.glyphMap;

interface CustomMultiSelectProps {
  data: string[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
}


const CustomMultiSelect = ({ data, selectedItems, onSelectionChange }: CustomMultiSelectProps) => {
  // handleSelect now works with a simple string item.
  const handleSelect = (item: string) => {
    // If the item is already selected, remove, otherwise add it.
    onSelectionChange((selectedItems.includes(item)) ? selectedItems.filter((selectedItem) => selectedItem !== item) : [...selectedItems, item]);
  };

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = selectedItems.includes(item);
    const checkbox: IconName = 'check';
    return (
      <TouchableOpacity
        style={[CommonStyles.item, isSelected && { borderColor: '#999' }]}
        onPress={() => handleSelect(item)}
      >
        <Text style={[{fontSize: 16}, isSelected && { fontWeight: '500' }]}>{item}</Text>
        <View style={styles.checkbox}>
          {isSelected && <FontAwesome5 name={checkbox} color={'#3596DE'}/>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={ data }
      renderItem={renderItem}
      keyExtractor={(item) => item}
      ItemSeparatorComponent={ItemSeparator}
      extraData={selectedItems}
    />
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomMultiSelect;