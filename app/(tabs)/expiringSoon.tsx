import { useIngredients } from '../../context/IngredientContext';
import { Ingredient } from '../../types/ingredient';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';
import debounce from 'lodash.debounce';
import renderIngredientItem from '../../components/renderIngredient';
import dayDifference from '../../constants/timeDifference';
import CommonStyles from '../../constants/commonStyle';
import { ItemSeparator, ListEmpty, SectionHeader } from '../../components/listComponents';

export default function ExpiringSoonScreen(): ReactNode {
    const { ingredients } = useIngredients();
    const [search, setSearch] = useState<string>('');
    const [daysThreshold, setDaysThreshold] = useState<number>(0); // Defaults to what spoils today (in 0 days)

    const expiringIngredients = useMemo(() => {        
        const today = new Date();

        // group items with same due date
        const groups: Record<string, Ingredient[]> = {};
        // add ingredients with ripeness >= ripe to separate group
        for (const ingredient of ingredients) {
            if (ingredient.maturity.lvl >= 1) {
                if (!groups['Ripe']) groups['Ripe'] = [];
                groups['Ripe'].push(ingredient);
                continue;
            }
        }

        // remove any ingredients not matching the chosen expiry time
        const filteredIngredients = ingredients.filter((ingredient) => {
            // if no expiration date set
            if (!ingredient.expirationDate) return false;
            // if no name is set
            if (!ingredient.name) return false;
            // if not matching search term
            if (!ingredient.name.toLocaleLowerCase().includes(search.toLowerCase())) return false;
            // remove ingredients which are already determined to be ripe
            if (ingredient.maturity.lvl >= 1) return false;
            
            const diffDays = dayDifference(ingredient.expirationDate, today);
            // check which items match the threshhold
            return daysThreshold !== null ? diffDays <= daysThreshold : false;
        });

        for (const ingredient of filteredIngredients) {
            if (!ingredient.expirationDate) continue;
            const diff = dayDifference(ingredient.expirationDate, today);
            const key = `Expiring in ${diff} days`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(ingredient);
        }

        return Object.entries(groups)
            .sort((a, b) => parseInt(a[0].match(/\d+/)?.[0] ?? '0', 10) - parseInt(b[0].match(/\d+/)?.[0] ?? '0', 10))
            .map((group) => ({
                title: group[0],
                data: group[1]
            }))
            .map((group) => ({ title: group.title.toString(), data: group.data }));
    }, [ingredients, search, daysThreshold]);

    // debounce such that slider doesnt lag out application
    const debounceUpdate = useCallback(
        debounce((value: number) => {
            setDaysThreshold(value)
        }, 100),
        []
    )

    return (
        <View style={CommonStyles.pageContainer}>
            <Text style={CommonStyles.listSectionHeader}>Items expiring within {daysThreshold} days</Text>
            <Slider onValueChange={debounceUpdate} minimumValue={0} maximumValue={30} value={daysThreshold} step={1} StepMarker={(props) => props.index % 5 == 0 && <Text style={styles.sliderMarker}>{props.index}</Text>} style={styles.slider}/>
            <TextInput style={CommonStyles.input} placeholder="Search expiring ingredients..." value={search} onChangeText={setSearch}/>
            <SectionList
                style={{...CommonStyles.list, height: '85%' }}
                sections={expiringIngredients}
                keyExtractor={(item) => item.id}
                renderItem={renderIngredientItem}
                renderSectionHeader={SectionHeader}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={<ListEmpty text ='No ingredients expiring in this timeframe.'/>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sliderMarker: {
        paddingTop: 15,
    },
    slider: {
        margin: 10,
        marginBottom: 30,
    }
});