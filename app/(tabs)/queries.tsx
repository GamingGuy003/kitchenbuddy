import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useIngredients } from '../../context/IngredientContext';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ingredient } from '../../types/index';
import { CATEGORIES, LOCATIONS, CONFECTION_TYPES } from '../../constants/ingredientProperties';

type QueryType = 'missingData' | 'recentlyAdded' | 'location' | 'category' | 'confectionType';

function QueryScreen() {
    const { ingredients } = useIngredients();
    const router = useRouter();
    const [queryType, setQueryType] = useState<QueryType>('recentlyAdded');
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    const filteredIngredients = useMemo(() => {
        let result: Ingredient[] = [];
        switch (queryType) {
            case 'missingData':
                result = ingredients.filter(i => !i.category || !i.location || !i.confectionType || !i.expirationDate);
                break;
            case 'recentlyAdded':
                result = [...ingredients].sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime()); // Assuming addedDate is already a Date object
                break;
            case 'location':
                result = ingredients.filter(i => i.location === filter);
                break;
            case 'category':
                result = ingredients.filter(i => i.category === filter);
                break;
            case 'confectionType':
                result = ingredients.filter(i => i.confectionType === filter);
                break;
            default:
                result = ingredients;
        }
        return result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    }, [ingredients, queryType, filter, search]);

    const renderFilterPicker = () => {
        switch (queryType) {
            case 'location':
                return <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}><Picker.Item label="Select Location..." value="" />{LOCATIONS.map(l => <Picker.Item key={l} label={l} value={l} />)}</Picker>;
            case 'category':
                return <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}><Picker.Item label="Select Category..." value="" />{CATEGORIES.map(c => <Picker.Item key={c} label={c} value={c} />)}</Picker>;
            case 'confectionType':
                return <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}><Picker.Item label="Select Confection..." value="" />{CONFECTION_TYPES.map(ct => <Picker.Item key={ct} label={ct} value={ct} />)}</Picker>;
            default:
                return null;
        }
    };

    const renderIngredientItem = ({ item }: { item: Ingredient }) => (
        <TouchableOpacity onPress={() => router.push(`/ingredient-details/${item.id}`)} /* Adjust path as needed */ >
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                {item.expirationDate && <Text>Expires: {item.expirationDate.toLocaleDateString()}</Text>}
                <Text>Category: {item.category || 'N/A'}</Text>
                <Text>Added: {item.addedDate.toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Picker selectedValue={queryType} onValueChange={(itemValue: QueryType) => { setQueryType(itemValue); setFilter(''); }}>
                <Picker.Item label="Most Recently Added" value="recentlyAdded" />
                <Picker.Item label="Missing Data" value="missingData" />
                <Picker.Item label="By Location" value="location" />
                <Picker.Item label="By Category" value="category" />
                <Picker.Item label="By Confection Type" value="confectionType" />
            </Picker>
            {renderFilterPicker()}
             <TextInput
                style={styles.searchInput}
                placeholder="Search ingredients..."
                value={search}
                onChangeText={setSearch}
            />
            <FlatList 
                data={filteredIngredients}
                renderItem={renderIngredientItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No ingredients match your query.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        margin: 10,
    }
});

export default QueryScreen;
