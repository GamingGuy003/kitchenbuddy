import { EXPIRY_ESTIMATES, ExpiryEstimate, CATEGORIES, LOCATIONS, CONFECTIONS, RIPENESS } from '../constants/ingredientProperties';
import { IngredientData, Maturity } from '../types/ingredient'; // Assuming IngredientData is the type for form data
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from 'expo-checkbox';
import Slider from '@react-native-community/slider';
import dayDifference from '../constants/timeDifference';

interface IngredientFormProps {
    initialValues?: Partial<IngredientData>;
    onSubmit: (data: IngredientData) => void;
    submitButtonTitle: string;
}

export default function IngredientForm({ initialValues, onSubmit, submitButtonTitle }: IngredientFormProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [category, setCategory] = useState(initialValues?.category);
    const [location, setLocation] = useState(initialValues?.location);
    const [confectionType, setConfectionType] = useState(initialValues?.confectionType);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(initialValues?.expirationDate ? new Date(initialValues.expirationDate) : undefined);
    const [brand, setBrand] = useState<string | undefined>(initialValues?.brand);
    const [open, setOpen] = useState<boolean>(initialValues?.open || false);
    const [ripeness, setRipeness] = useState<Maturity>(initialValues?.maturity || { lvl: RIPENESS.NONE, edited: new Date() });
    const [freezeInterval, setFreezeInterval] = useState<number | undefined>(initialValues?.frozen);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // datepicker mechanics
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirmDate = (date: Date) => {
        setExpirationDate(date);
        hideDatePicker();
    };

    const handleSelectEstimate = (days: number) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        setExpirationDate(newDate);
    };

    const handleSubmit = () => {
        onSubmit({
            name,
            category: category || undefined,
            location: location || undefined,
            confectionType: confectionType || undefined,
            expirationDate,
            brand: brand || undefined,
            open: open || false,
            maturity: ripeness,
            frozen: freezeInterval
        });
    };

    // converts the enum variants into a readable string
    const getRipenessText = () => {
        return RIPENESS[ripeness.lvl].charAt(0) + RIPENESS[ripeness.lvl].toLocaleLowerCase().slice(1)
    };

    // when slider moves, modify ripeness as well as edited date
    const setRipenessAndDate = (ripeness: RIPENESS) => {
        setRipeness({ lvl: ripeness, edited: new Date() })
    }

    // save the interval between time of freezing and old expiration date
    const freeze = () => {
        if (!expirationDate) return;
        const diffDays = dayDifference(expirationDate);
        setFreezeInterval(diffDays);
        const newExpiration = new Date(expirationDate);
        newExpiration.setMonth(newExpiration.getMonth() + 6);
        setExpirationDate(newExpiration)
    }

    // adds old interval to current date
    const unfreeze = () => {
        if (!expirationDate || !freezeInterval) return;
        const newExpiration = new Date();
        newExpiration.setDate(newExpiration.getDate() + freezeInterval);
        setExpirationDate(newExpiration);
        setFreezeInterval(undefined);
    }

    const setConfectionTypeFreeze = (confectionType?: string) => {
        unfreeze();
        setConfectionType(confectionType);
    }

    // alert the user that opened products my not last as long
    const handleOpened = (value: boolean) => {
        // notify only if changed from unopen to open
        if (!open && value) Alert.alert('Notice', 'Opened products may not last as long; Possibly adjust expiration date');
        setOpen(value)
    }

    return (
        <KeyboardAwareScrollView>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.rowView}>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.label}>Name*</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g., Apples" />
                    </View>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={styles.label}>Open</Text>
                        <CheckBox value={open} onValueChange={handleOpened} style={{ marginTop: 5 }}/>
                    </View>
                </View>
                    

                <Text style={styles.label}>Brand</Text>
                <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="e.g., Nestle" />

                <Text style={styles.label}>Ripeness: {getRipenessText()} { dayDifference(ripeness.edited) >= 3 ? '(Checking required)' : null}</Text>
                <View style={styles.rowView}>
                    <Slider step={1} minimumValue={-1} maximumValue={3} value={ripeness.lvl} onValueChange={setRipenessAndDate} style={{ flex: 1 }}/>
                    <Button title={`Confirm ${getRipenessText()}`} onPress={() => {
                        setRipenessAndDate(ripeness.lvl);
                        Alert.alert('Ripeness confirmed', `Ripeness is still ${getRipenessText()}`);
                    }}/>
                </View>

                <Text style={styles.label}>Category</Text>
                <Picker selectedValue={category} onValueChange={setCategory}>
                    <Picker.Item label="Select Category..." value="" />
                    {CATEGORIES.map(category => <Picker.Item key={category} label={category} value={category} />)}
                </Picker>

                <Text style={styles.label}>Location</Text>
                <Picker selectedValue={location} onValueChange={setLocation}>
                    <Picker.Item label="Select Location..." value="" />
                    {LOCATIONS.map(location => <Picker.Item key={location} label={location} value={location} />)}
                </Picker>

                <Text style={styles.label}>Confection Type</Text>
                <View style={styles.rowView}>
                    <View style={{ flex: 3 }}>
                        <Picker selectedValue={confectionType} onValueChange={setConfectionTypeFreeze}>
                            <Picker.Item label="Select Confection Type..." value="" />
                            {CONFECTIONS.map(confection => <Picker.Item key={confection} label={confection} value={confection} />)}
                        </Picker>
                    </View>
                    { confectionType === 'Fresh' && expirationDate ?
                    <View style={{flex: 1, marginTop: 10 }}>
                        <Button title={freezeInterval ? 'unfreeze' : 'freeze'} onPress={ freezeInterval ? unfreeze : freeze}/>
                    </View> : null }
                </View>
                
                <Text style={styles.label}>Expiration Date</Text>
                <Button title={expirationDate ? `Selected: ${expirationDate.toLocaleDateString()}` : "Pick Exact Date"} onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={expirationDate || new Date()}
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                />

                <Text style={styles.label}>Or Estimate Expiry:</Text>
                <View style={styles.rowView}>
                    {EXPIRY_ESTIMATES.map((estimate: ExpiryEstimate) => (
                        <View key={estimate.label} style={styles.estimateButton}>
                            <Button title={estimate.label} onPress={() => handleSelectEstimate(estimate.days)} />
                        </View>
                    ))}
                </View>

                <View style={styles.submitButtonContainer}>
                    <Button title={submitButtonTitle} onPress={handleSubmit} />
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    label: {
        fontSize: 16,
        margin: 5,
        fontWeight: '500'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        flex: 2
    },
    rowView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignContent: 'flex-end',
        flex: 1,
        gap: 10,
    },
    estimateButton: {
        flex: 1,
    },
    submitButtonContainer: {
        marginTop: 20
    },
});