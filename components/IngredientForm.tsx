import { EXPIRY_ESTIMATES, ExpiryEstimate, CATEGORIES, LOCATIONS, CONFECTIONS, RIPENESS } from '../constants/ingredientProperties';
import { Ingredient, IngredientAmount, Maturity } from '../types/ingredient'; // Assuming IngredientData is the type for form data
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from 'expo-checkbox';
import Slider from '@react-native-community/slider';
import dayDifference from '../constants/timeDifference';
import AmountSelector from './amountSelector';
import CommonStyles from '../constants/commonStyle';

interface IngredientFormProps {
    initialValues?: Partial<Ingredient>;
    onSubmit: (data: Partial<Ingredient>) => void;
    submitButtonTitle: string;
}

export default function IngredientForm({ initialValues, onSubmit, submitButtonTitle }: IngredientFormProps) {
    const [name, setName] = useState<string | undefined>(initialValues?.name);
    const [category, setCategory] = useState<string | undefined>(initialValues?.category);
    const [location, setLocation] = useState<string | undefined>(initialValues?.location);
    const [confectionType, setConfectionType] = useState<string | undefined>(initialValues?.confectionType);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(initialValues?.expirationDate ? new Date(initialValues.expirationDate) : undefined);
    const [brand, setBrand] = useState<string | undefined>(initialValues?.brand);
    const [open, setOpen] = useState<boolean>(initialValues?.open || false);
    const [maturity, setMaturity] = useState<Maturity>(initialValues?.maturity || { lvl: RIPENESS.NONE, edited: new Date() });
    const [freezeInterval, setFreezeInterval] = useState<number | undefined>(initialValues?.frozen);
    const [amount, setAmount] = useState<IngredientAmount>({ kind: 'Count', value: 1});
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

    useEffect(() => {
        // Update form if initialValues change
        if (initialValues) {
            setName(initialValues.name);
            setCategory(initialValues.category);
            setLocation(initialValues.location);
            setConfectionType(initialValues.confectionType);
            setExpirationDate(initialValues.expirationDate);
            setBrand(initialValues.brand);
            setOpen(initialValues.open || false);
            setMaturity(initialValues.maturity || { lvl: RIPENESS.NONE, edited: new Date ()});
            setAmount({ kind: 'Count', value: 1});
            setFreezeInterval(initialValues.frozen);
        }
    }, [initialValues]);

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
            category,
            location,
            confectionType,
            expirationDate,
            brand,
            open: open || false,
            maturity,
            frozen: freezeInterval,
            amount,
        });
    };

    // converts the enum variants into a readable string
    const getRipenessText = () => {
        return RIPENESS[maturity.lvl].charAt(0) + RIPENESS[maturity.lvl].toLocaleLowerCase().slice(1)
    };

    // when slider moves, modify ripeness as well as edited date
    const setRipenessAndDate = (ripeness: RIPENESS) => {
        setMaturity({ lvl: ripeness, edited: new Date() })
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
            <ScrollView contentContainerStyle={CommonStyles.pageContainer}>
                <View style={CommonStyles.rowView}>
                    <View style={{ flex: 3 }}>
                        <Text style={CommonStyles.label}>Name*</Text>
                        <TextInput style={CommonStyles.input} value={name} onChangeText={setName} placeholder="e.g., Apples" />
                    </View>
                    <View style={styles.checkBoxView}>
                        <Text style={CommonStyles.label}>Open</Text>
                        <CheckBox value={open} onValueChange={handleOpened}/>
                    </View>
                </View>

                <Text style={CommonStyles.label}>Brand</Text>
                <TextInput style={CommonStyles.input} value={brand} onChangeText={setBrand} placeholder="e.g., Nestle" />

                <AmountSelector amountChange={() => {}}/>

                <Text style={CommonStyles.label}>Ripeness: {getRipenessText()} { dayDifference(maturity.edited) >= 3 ? '(Checking required)' : null}</Text>
                <View style={CommonStyles.rowView}>
                    <Slider step={1} minimumValue={-1} maximumValue={3} value={maturity.lvl} onValueChange={setRipenessAndDate} style={{ flex: 1 }}/>
                    <Button title={`Confirm ${getRipenessText()}`} onPress={() => {
                        setRipenessAndDate(maturity.lvl);
                        Alert.alert('Ripeness confirmed', `Ripeness is still ${getRipenessText()}`);
                    }}/>
                </View>

                <Text style={CommonStyles.label}>Category</Text>
                <Picker selectedValue={category} onValueChange={setCategory} placeholder='Sond'>
                    <Picker.Item label="Select Category..." value={undefined} />
                    {CATEGORIES.map(category => <Picker.Item key={category} label={category} value={category} />)}
                </Picker>

                <Text style={CommonStyles.label}>Location</Text>
                <Picker selectedValue={location} onValueChange={setLocation}>
                    <Picker.Item label="Select Location..." value="" />
                    {LOCATIONS.map(location => <Picker.Item key={location} label={location} value={location} />)}
                </Picker>

                <Text style={CommonStyles.label}>Confection Type</Text>
                <View style={CommonStyles.rowView}>
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
                
                <Text style={CommonStyles.label}>Expiration Date</Text>
                <Button title={expirationDate ? `Selected: ${expirationDate.toLocaleDateString()}` : "Pick Exact Date"} onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={expirationDate || new Date()}
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                />

                <Text style={CommonStyles.label}>Or Estimate Expiry:</Text>
                <View style={CommonStyles.rowView}>
                    {EXPIRY_ESTIMATES.map((estimate: ExpiryEstimate) => (
                        <View key={estimate.label} style={styles.estimateButton}>
                            <Button title={estimate.label} onPress={() => handleSelectEstimate(estimate.days)} />
                        </View>
                    ))}
                </View>

                <View style={{ marginTop: 20 }}>
                    <Button title={submitButtonTitle} onPress={handleSubmit} />
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    checkBoxView: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        rowGap: 10
    },
    estimateButton: {
        flex: 1,
    },
});