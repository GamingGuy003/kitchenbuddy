import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';


interface CustomMultiSelectProps {
  data: string[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
}


const CustomMultiSelect = ({ data, selectedItems, onSelectionChange }: CustomMultiSelectProps) => {
  // handleSelect now works with a simple string item.
  const handleSelect = (item: string) => {
    let newSelectedItems;

    if (selectedItems.includes(item)) {
      // If the item is already selected, remove it.
      newSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== item);

    } else {
        // If the item is not selected, add it.
      newSelectedItems = [...selectedItems, item];

    }
    onSelectionChange(newSelectedItems);
  };

  // renderItem now expects a string.
  const renderItem = ({ item }: { item: string }) => {
    const isSelected = selectedItems.includes(item);
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleSelect(item)}
      >
        <Text style={[styles.title, isSelected && styles.selectedTitle]}>{item}</Text>
        <View style={[styles.checkbox, isSelected && styles.selectedCheckbox]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={ data }
      renderItem={renderItem}
      keyExtractor={(item) => item}

      extraData={selectedItems}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  checkmark: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
  },
  selectedTitle: {
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: '#6366f1',
    borderColor: '#4f46e5',
  },
});

export default CustomMultiSelect;