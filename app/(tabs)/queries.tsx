import { CATEGORIES, CONFECTIONS, LOCATIONS, RIPENESS } from '../../constants/ingredientProperties';
import { useIngredients } from '../../context/IngredientContext';
import { Ingredient, IngredientCategory, IngredientConfection, IngredientLocation } from '../../types/ingredient';
import { Picker } from '@react-native-picker/picker';
import React, { useMemo, useState } from 'react';
import { FlatList, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import renderIngredientItem from '../../components/renderIngredient';
import dayDifference from '../../constants/timeDifference';

type QueryType = 'missingData' | 'recentlyAdded' | 'location' | 'category' | 'confectionType' | 'ripenessCheck';
type Filter = IngredientCategory | IngredientConfection | IngredientLocation | undefined;

export default function QueryScreen() {
    const { ingredients } = useIngredients();
    // type of query
    const [queryType, setQueryType] = useState<QueryType>('recentlyAdded');
    // filter selection
    const [filter, setFilter] = useState<Filter>('');
    // search field text
    const [search, setSearch] = useState('');

    // only show ingredients matching the current query and filter
    const filteredIngredients = useMemo(() => {
        let result: Ingredient[] = [];
        switch (queryType) {
            case 'ripenessCheck':
                // only show items with a ripeness status and more than 3 days since last check
                result = ingredients.filter((i) => i.maturity.lvl !== RIPENESS.NONE && dayDifference(i.maturity.edited) >= 3);
                break;
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

    // groups items by the currently selected query type in order to show a section list
    const groupItemsByField = () => {
        const keyExtractor = {
            location: (ingredient: Ingredient) => ingredient.location ?? 'Unassigned',
            category: (ingredient: Ingredient) => ingredient.category ?? 'Unassigned',
            confectionType: (ingredient: Ingredient) => ingredient.confectionType ?? 'Unassigned',
            recentlyAdded: (() => 'Unassigned'),
            missingData: (() => 'Unassigned'),
            ripenessCheck: (() => 'Unassigned'),
        }[queryType];

        const grouped: Record<string, Ingredient[]> = {};
        for (const ingredient of ingredients) {
            const key = keyExtractor(ingredient);
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(ingredient)
        }

        return Object.keys(grouped).map(location => ({
            title: location,
            data: grouped[location],
        }));
    };

    // filterpricker element
    const RenderFilterPicker = () => {
        switch (queryType) {
            case 'location':
                return <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}>
                    <Picker.Item label='No Location Filter' value='' />
                    {LOCATIONS.map(location => <Picker.Item key={location} label={location} value={location} />)}
                </Picker>;
            case 'category':
                return <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}>
                    <Picker.Item label='No Category Filter' value='' />
                    {CATEGORIES.map(category => <Picker.Item key={category} label={category} value={category} />)}
                </Picker>;
            case 'confectionType':
                return <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}>
                    <Picker.Item label='No Confection Filter' value='' />
                    {CONFECTIONS.map(confection => <Picker.Item key={confection} label={confection} value={confection} />)}
                </Picker>;
            default:
                return null;
        }
    };

    // listing element
    const RenderIngredientList = () => {
        // if querytype has subcategories and no filter has been chosen, show section list with all items
        if (filter === '' && queryType != 'missingData' && queryType != 'recentlyAdded' && queryType != 'ripenessCheck') {
            return <SectionList
                sections={groupItemsByField()}
                keyExtractor={(item) => item.id}
                renderItem={renderIngredientItem}
                renderSectionHeader={({section: {title}}) => <Text style={styles.listSectionHeader}>{title}</Text>}
            />
        } else {
            return <FlatList 
                data={filteredIngredients}
                renderItem={renderIngredientItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.listEmptyText}>No ingredients match your query.</Text>}
            />
        }
    };

    // renders the whole page
    return (
        <View style={styles.container}>
            <Picker selectedValue={queryType} onValueChange={(itemValue: QueryType) => { setQueryType(itemValue); setFilter(''); }}>
                <Picker.Item label="Ripeness Check due" value="ripenessCheck" />
                <Picker.Item label="Most Recently Added" value='recentlyAdded' />
                <Picker.Item label="Missing Data" value="missingData" />
                <Picker.Item label="By Location" value="location" />
                <Picker.Item label="By Category" value="category" />
                <Picker.Item label="By Confection Type" value="confectionType" />
            </Picker>
            <RenderFilterPicker/>
             <TextInput
                style={styles.searchInput}
                placeholder="Search ingredients..."
                value={search}
                onChangeText={setSearch}
            />
            <RenderIngredientList/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    listEmptyText: {
        textAlign: 'center',
        marginTop: 20,
    },
    listSectionHeader: {
        fontWeight: 'bold',
        fontSize: 24,
        paddingVertical: 5
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        margin: 10,
    },
});
