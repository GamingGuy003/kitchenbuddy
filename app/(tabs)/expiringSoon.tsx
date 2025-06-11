import { EXPIRY_THRESHOLDS } from '@/constants/ingredientProperties';
import { useIngredients } from '@/context/IngredientContext';
import { Ingredient } from '@/types';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function ExpiringSoonScreen() {
    const { ingredients } = useIngredients();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [daysThreshold, setDaysThreshold] = useState<number>(EXPIRY_THRESHOLDS[1].value); // Default to 7 days

    const expiringIngredients = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

        return ingredients
            .filter(i => {
                if (!i.expirationDate) return false;
                const expiryDate = new Date(i.expirationDate);
                expiryDate.setHours(0,0,0,0); // Normalize expiry date

                const diffTime = expiryDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (daysThreshold === -1) { // Overdue
                    return diffDays < 0;
                }
                return diffDays >= 0 && diffDays <= daysThreshold;
            })
            .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => (a.expirationDate?.getTime() || 0) - (b.expirationDate?.getTime() || 0)); // Sort by soonest expiring
    }, [ingredients, search, daysThreshold]);

    const renderIngredientItem = ({ item }: { item: Ingredient }) => (
        <TouchableOpacity onPress={() => router.push(`/ingredient-details/${item.id}`)}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text>Expires: {item.expirationDate ? item.expirationDate.toLocaleDateString() : 'N/A'}</Text>
                <Text>Added: {item.addedDate.toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={daysThreshold}
                onValueChange={(itemValue) => setDaysThreshold(itemValue as number)}
            >
                {EXPIRY_THRESHOLDS.map(threshold => (
                    <Picker.Item key={threshold.value} label={threshold.label} value={threshold.value} />
                ))}
            </Picker>
            <TextInput
                style={styles.searchInput}
                placeholder="Search expiring ingredients..."
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={expiringIngredients}
                renderItem={renderIngredientItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No ingredients expiring within this period.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    itemContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    searchInput: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
    emptyText: { textAlign: 'center', marginTop: 20 },
});

export default ExpiringSoonScreen;