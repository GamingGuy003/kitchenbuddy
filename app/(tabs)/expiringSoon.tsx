import { EXPIRY_THRESHOLDS } from '../../constants/ingredientProperties';
import { useIngredients } from '../../context/IngredientContext';
import { Ingredient } from '../../types/ingredient';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpiringSoonScreen() {
    const { ingredients } = useIngredients();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [daysThreshold, setDaysThreshold] = useState<number>(EXPIRY_THRESHOLDS[1].value); // Default to 7 days

    const groupExpiringIngredients = () => {
        // translate all possible expiration categories to sections
        const grouped: { title: string, data: Ingredient[], value: number | undefined, range?: [number, number] }[] = EXPIRY_THRESHOLDS.map((threshold) => { return {
            title: threshold.label,
            data: [],
            value: threshold.value,
            range: threshold.range
        }});
        // add section for no expiration date
        grouped.push({
            title: 'No expiration',
            data: [],
            value: undefined,
            range: undefined
        });

        // get current date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let group: Ingredient[] | undefined = [];
        for (const ingredient of ingredients) {
            // if no expiration date is set, add to no expiration section
            if (!ingredient.expirationDate) {
                group = grouped.find((group) => group.value === undefined)?.data;
            } else {
                // calculate amount of days until ingredient expires
                const expiryDate = new Date(ingredient.expirationDate);
                expiryDate.setHours(0,0,0,0);
                const diffTime = expiryDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                // if amount of days until expiration falls within range
                group = grouped.find((group) => group.range ? (diffDays >= group.range[0] && diffDays <= group.range[1]) : false)?.data
            }
            group ? group.push(ingredient) : {};
        }
        // remove unneeded fields and filter to only return actual data
        return grouped.map((group) => { return {
            title: group.title,
            data: group.data
        }}).filter((group) => group.data.length > 0);
    }

    const expiringIngredients = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

        return ingredients
            .filter(ingredient => {
                // if no expiration date do not try to sort
                if (!ingredient.expirationDate) return false;

                const expiryDate = new Date(ingredient.expirationDate);
                expiryDate.setHours(0,0,0,0); // Normalize expiry date
                const diffTime = expiryDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // if overdue check if item is also overdue, otherwhise check if item falls into category
                return daysThreshold === -1 ? diffDays < 0 : diffDays >= 0 && diffDays >= daysThreshold;
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
            <Picker selectedValue={daysThreshold} onValueChange={(itemValue) => setDaysThreshold(itemValue as number)}>
                <Picker.Item label='All' value={null}/>
                {EXPIRY_THRESHOLDS.map(threshold => (<Picker.Item key={threshold.value} label={threshold.label} value={threshold.value}/>))}
            </Picker>
            <TextInput style={styles.searchInput} placeholder="Search expiring ingredients..." value={search} onChangeText={setSearch}/>
            {daysThreshold !== null ?
            <FlatList
                data={expiringIngredients}
                renderItem={renderIngredientItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No ingredients expiring within this period.</Text>}
            /> : 
            <SectionList
                sections={groupExpiringIngredients()}
                keyExtractor={(item) => item.id}
                renderItem={renderIngredientItem}
                renderSectionHeader={({section: {title}}) => (
                    <Text style={styles.listSectionHeader}>{title}</Text>
                )}
            />}
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20
    },
    listSectionHeader: {
        fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center'
    },
});