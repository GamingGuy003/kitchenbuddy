import { useIngredients } from '../../context/IngredientContext';
import { Ingredient } from '../../types/ingredient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import debounce from 'lodash.debounce';

export default function ExpiringSoonScreen() {
    const { ingredients } = useIngredients();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [daysThreshold, setDaysThreshold] = useState<number>(0); // Defaults to what spoils today (in 0 days)

    const expiringIngredients = useMemo(() => {        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

        // remove any ingredients not matching the chosen expiry time
        const filteredIngredients = ingredients.filter((ingredient) => {
            // if no expiration date set
            if (!ingredient.expirationDate) return false;
            // if not matching search term
            if (!ingredient.name.toLocaleLowerCase().includes(search.toLowerCase())) return false;

            const expiryDate = new Date(ingredient.expirationDate);
            expiryDate.setHours(0,0,0,0); // Normalize expiry date
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // check which items
            return (daysThreshold !== null) ? diffDays <= daysThreshold : false;
        });

        // group items with same due date
        const groups: Record<string, Ingredient[]> = {};
        for (const ingredient of filteredIngredients) {
            if (!ingredient.expirationDate) continue;
            const dateKey = ingredient.expirationDate.toDateString();
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(ingredient);
        }

        //console.log(groups);

        return Object.entries(groups).map((group) => {
            const expiryDate = new Date(group[0]);
            console.log(expiryDate)
            expiryDate.setHours(0,0,0,0); // Normalize expiry date
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
                title: diffDays,
                data: group[1]
            }}).sort((a, b) => a.title - b.title)
            .map((group) => ({ title: group.title.toString(), data: group.data }));
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

    const debounceUpdate = useCallback(
        debounce((value: number) => {
            setDaysThreshold(value)
        }, 100),
        []
    )

    return (
        <View style={styles.container}>
            <Text style={styles.listSectionHeader}>Items expiring within {daysThreshold} days</Text>
            <Slider onValueChange={debounceUpdate} minimumValue={0} maximumValue={30} value={daysThreshold} step={1} StepMarker={(props) => props.index % 5 == 0 ? <Text style={styles.sliderMarker}>{props.index}</Text> : null} style={styles.slider}/>
            <TextInput style={styles.searchInput} placeholder="Search expiring ingredients..." value={search} onChangeText={setSearch}/>
            <SectionList
                sections={expiringIngredients}
                keyExtractor={(item) => item.id}
                renderItem={renderIngredientItem}
                renderSectionHeader={({section: {title}}) => <Text style={styles.listSectionHeader}>Expiring in {title} days</Text>}
            />
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
        fontSize: 24,
    },
    sliderMarker: {
        paddingTop: 15,
    },
    slider: {
        margin: 20
    }
});