import { CATEGORIES, CONFECTIONS, LOCATIONS, RIPENESS } from '../../constants/ingredientProperties';
import { useIngredients } from '../../context/IngredientContext';
import { Ingredient, IngredientCategory, IngredientConfection, IngredientLocation } from '../../types/ingredient';
import { Picker } from '@react-native-picker/picker';
import React, { ReactNode, useMemo, useState } from 'react';
import { FlatList, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import renderIngredientItem from '../../components/renderIngredient';
import dayDifference from '../../constants/timeDifference';
import CommonStyles from '../../constants/commonStyle';
import { ItemSeparator, ListEmpty, SectionHeader } from '../../components/listComponents';

type QueryType = 'missingData' | 'recentlyAdded' | 'location' | 'category' | 'confectionType' | 'ripenessCheck' | 'all';
type Filter = IngredientCategory | IngredientConfection | IngredientLocation | undefined;

export default function QueryScreen(): ReactNode {
    const { ingredients } = useIngredients();
    // type of query
    const [queryType, setQueryType] = useState<QueryType>('all');
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
                result = [...ingredients].sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime()).filter(item => dayDifference(item.addedDate) <= 4); // only show items added in the past 2 days
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
                result = ingredients.sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime());
        }
        return result.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));
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
            all: (() => 'Unassigned')
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
    const filterPicker = {
        ['location']:
        <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}>
            <Picker.Item label='No Location Filter' value='' />
            {LOCATIONS.map(location => <Picker.Item key={location} label={location} value={location} />)}
        </Picker>,
        ['category']:
        <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}>
            <Picker.Item label='No Category Filter' value='' />
            {CATEGORIES.map(category => <Picker.Item key={category} label={category} value={category} />)}
        </Picker>,
        ['confectionType']:
        <Picker selectedValue={filter} onValueChange={itemValue => setFilter(itemValue)}>
            <Picker.Item label='No Confection Filter' value='' />
            {CONFECTIONS.map(confection => <Picker.Item key={confection} label={confection} value={confection} />)}
        </Picker>,
        ['missingData']: null, ['recentlyAdded']: null, ['ripenessCheck']: null, ['all']: null
    };

    // listing element
    const RenderIngredientList = () => {
        // if querytype has subcategories and no filter has been chosen, show section list with all items
        if (filter === '' && queryType != 'missingData' && queryType != 'recentlyAdded' && queryType != 'ripenessCheck' && queryType != 'all' ) {
            return <SectionList
                style={CommonStyles.list}
                sections={groupItemsByField()}
                keyExtractor={(item) => item.id}
                renderItem={renderIngredientItem}
                renderSectionHeader={SectionHeader}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={ListEmpty}
            />
        } else {
            return <FlatList
                style={CommonStyles.list}
                data={filteredIngredients}
                keyExtractor={item => item.id}
                renderItem={renderIngredientItem}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={ListEmpty}
            />
        }
    };

    // renders the whole page
    return (
        <View style={CommonStyles.pageContainer}>
            <Picker selectedValue={queryType} onValueChange={(itemValue: QueryType) => { setQueryType(itemValue); setFilter(''); }}>
                <Picker.Item label="Ripeness Check due" value="ripenessCheck" />
                <Picker.Item label="Most Recently Added" value='recentlyAdded' />
                <Picker.Item label="Missing Data" value="missingData" />
                <Picker.Item label="By Location" value="location" />
                <Picker.Item label="By Category" value="category" />
                <Picker.Item label="By Confection Type" value="confectionType" />
            </Picker>
            { filterPicker[queryType] }
             <TextInput
                style={CommonStyles.input}
                placeholder="Search ingredients..."
                value={search}
                onChangeText={setSearch}
            />
            <RenderIngredientList/>
        </View>
    );
}