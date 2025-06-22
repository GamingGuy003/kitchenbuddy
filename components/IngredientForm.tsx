import { EXPIRY_ESTIMATES, ExpiryEstimate, CATEGORIES, LOCATIONS, CONFECTIONS, RIPENESS } from '../constants/ingredientProperties';
import { Ingredient, IngredientAmount, IngredientAmountKind, Maturity } from '../types/ingredient'; // Assuming IngredientData is the type for form data
import { Picker } from '@react-native-picker/picker';
import React, { ReactNode, useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from 'expo-checkbox';
import Slider from '@react-native-community/slider';
import dayDifference from '../constants/timeDifference';
import CommonStyles from '../constants/commonStyle';
import FormLock from '../types/formLock';
import AmountPicker from './amountPicker';

interface IngredientFormProps {
    initialValues?: Partial<Ingredient>;
    // if date should be prefilled, yet still modifiable
    datePrefilled?: boolean;
    // callback to run if left submit button gets pressed
    leftButton: { onSubmit: (data: Partial<Ingredient>) => void; title: string };
    // callback to run if right submit button gets pressed. this one is optional and it not present, only left button will be used
    rightButton?: { onSubmit: (data: Partial<Ingredient>) => void; title: string }
}

export default function IngredientForm({ initialValues, datePrefilled, leftButton, rightButton }: IngredientFormProps): ReactNode {
    const [name, setName] = useState<string | undefined>(initialValues?.name);
    const [category, setCategory] = useState<string | undefined>(initialValues?.category);
    const [location, setLocation] = useState<string | undefined>(initialValues?.location);
    const [confectionType, setConfectionType] = useState<string | undefined>(initialValues?.confectionType);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(initialValues?.expirationDate ? new Date(initialValues.expirationDate) : undefined);
    const [brand, setBrand] = useState<string | undefined>(initialValues?.brand);
    const [open, setOpen] = useState<boolean>(initialValues?.open || false);
    const [maturity, setMaturity] = useState<Maturity>(initialValues?.maturity || { lvl: RIPENESS.NONE, edited: new Date() });
    const [freezeInterval, setFreezeInterval] = useState<number | undefined>(initialValues?.frozen);
    const [amountKind, setAmountKind] = useState<IngredientAmountKind>(initialValues?.amount ? initialValues.amount.kind : IngredientAmountKind.COUNT);
    const [amountValue, setAmountValue] = useState<string>(initialValues?.amount ? initialValues.amount.value : '1');
    const [amountUnit, setAmountUnit] = useState<string | undefined>(initialValues?.amount?.kind === IngredientAmountKind.CUSTOM ? initialValues.amount.unit : undefined);
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [locks, setLocks] = useState<FormLock>({
        nameLock: initialValues?.name !== undefined,
        brandLock: initialValues?.brand !== undefined,
        categoryLock: initialValues?.category !== undefined,
        confectionLock: initialValues?.confectionType !== undefined,
        dateLock: !datePrefilled && initialValues?.expirationDate !== undefined,
    });

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
            setAmountKind(initialValues?.amount ? initialValues.amount.kind : IngredientAmountKind.COUNT);
            setAmountValue(initialValues?.amount ? initialValues.amount.value : '1');
            setAmountUnit(initialValues?.amount?.kind === IngredientAmountKind.CUSTOM ? initialValues.amount.unit : undefined);
            setFreezeInterval(initialValues.frozen);
            setLocks({
                nameLock: initialValues?.name !== undefined,
                brandLock: initialValues?.brand !== undefined,
                categoryLock: initialValues?.category !== undefined,
                confectionLock: initialValues?.confectionType !== undefined,
                dateLock: !datePrefilled && initialValues?.expirationDate !== undefined,
            });
        }
    }, [initialValues]);

    // datepicker mechanics
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirmDate = (date: Date) => {
        setExpirationDate(date);
        hideDatePicker();
    };

    // adds the estimated amount of days to todays date
    const handleSelectEstimate = (days: number) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        setExpirationDate(newDate);
    };

    // convert amount into appropriate instance
    const convertAmount = () => {
        switch (amountKind) {
            case (IngredientAmountKind.COUNT): return{ kind: IngredientAmountKind.COUNT, value: amountValue }
            case (IngredientAmountKind.FRACTION): return{ kind: IngredientAmountKind.FRACTION, value: amountValue }
            case (IngredientAmountKind.CUSTOM): return{ kind: IngredientAmountKind.CUSTOM, value: amountValue, unit: amountUnit }
        }
    }

    // will handle the left button press
    const handleButtonLeft = () => {
        leftButton.onSubmit({
            name,
            category,
            location,
            confectionType,
            expirationDate,
            brand,
            open: open || false,
            maturity,
            frozen: freezeInterval,
            amount: convertAmount(),
        })
    }

    // will only handle the right button press if function has been provided
    const handleButtonRight = () => {
        rightButton && rightButton.onSubmit({
            name,
            category,
            location,
            confectionType,
            expirationDate,
            brand,
            open: open || false,
            maturity,
            frozen: freezeInterval,
            amount: convertAmount(),
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

    // unfreeze if confection type changes
    const setConfectionTypeFreeze = (confectionType?: string) => {
        unfreeze();
        setConfectionType(confectionType);
    }

    // alert the user that opened products my not last as long
    const handleOpened = (value: boolean) => {
        // notify only if changed from unopen to open
        if (!open && value) Alert.alert('Notice', 'Opened products may not last as long; Possibly adjust expiration date');
        setLocks({ ...locks, dateLock: false });
        setOpen(value)
    }

    return (
        <KeyboardAwareScrollView>
            <ScrollView>
                <View style={CommonStyles.rowView}>
                    <View style={{ flex: 3 }}>
                        <Text style={CommonStyles.label}>Name*</Text>
                        <TextInput style={locks.nameLock ? CommonStyles.inputInactive : CommonStyles.input} value={name} onChangeText={setName} placeholder="e.g., Apples" editable={!locks.nameLock}/>
                    </View>
                    <View style={styles.checkBoxView}>
                        <Text style={CommonStyles.label}>Open</Text>
                        <CheckBox value={open} onValueChange={handleOpened}/>
                    </View>
                </View>

                <Text style={CommonStyles.label}>Brand</Text>
                <TextInput style={locks.brandLock ? CommonStyles.inputInactive : CommonStyles.input} value={brand} onChangeText={setBrand} placeholder="e.g., Nestle" editable={!locks.brandLock}/>

                <AmountPicker
                    setAmountKind={setAmountKind}
                    setAmountValue={setAmountValue}
                    setAmountUnit={setAmountUnit}
                    amountKind={amountKind}
                    amountValue={amountValue}
                    amountUnit={amountUnit}
                />
                
                <Text style={CommonStyles.label}>Ripeness: {getRipenessText()} { dayDifference(maturity.edited) >= 3 && '(Checking required)'}</Text>
                <View style={CommonStyles.rowView}>
                    <Slider step={1} minimumValue={-1} maximumValue={3} value={maturity.lvl} onValueChange={setRipenessAndDate} style={{ flex: 1 }}/>
                    { initialValues?.maturity && dayDifference(initialValues.maturity.edited) >= 3 && <Button title={`Confirm ${getRipenessText()}`} onPress={() => {
                        setRipenessAndDate(maturity.lvl);
                        Alert.alert('Ripeness confirmed', `Ripeness is still ${getRipenessText()}`);
                    }}/>}
                </View>

                <Text style={CommonStyles.label}>Category</Text>
                <Picker selectedValue={category} onValueChange={setCategory} enabled={!locks.categoryLock}>
                    { !category && <Picker.Item label="Select Category..."/> }
                    {CATEGORIES.map(category => <Picker.Item key={category} label={category} value={category} />)}
                </Picker>

                <Text style={CommonStyles.label}>Location</Text>
                <Picker selectedValue={location} onValueChange={setLocation}>
                    { !location && <Picker.Item label="Select Location..."/> }
                    {LOCATIONS.map(location => <Picker.Item key={location} label={location} value={location} />)}
                </Picker>

                <Text style={CommonStyles.label}>Confection Type</Text>
                <View style={CommonStyles.rowView}>
                    <View style={{ flex: 3 }}>
                        <Picker selectedValue={confectionType} onValueChange={setConfectionTypeFreeze} enabled={!locks.confectionLock}>
                            { !confectionType && <Picker.Item label="Select Confection Type..."/> }
                            {CONFECTIONS.map(confection => <Picker.Item key={confection} label={confection} value={confection} />)}
                        </Picker>
                    </View>
                    { confectionType === 'Fresh' && expirationDate &&
                    <View style={{flex: 1, marginTop: 10 }}>
                        <Button title={freezeInterval ? 'unfreeze' : 'freeze'} onPress={ freezeInterval ? unfreeze : freeze}/>
                    </View>}
                </View>
                
                <Text style={CommonStyles.label}>Expiration Date</Text>
                <Button title={expirationDate ? expirationDate.toLocaleDateString() : "Pick Exact Date"} onPress={showDatePicker} disabled={locks.dateLock}/>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={expirationDate || new Date()}
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                />
                { !locks.dateLock ?
                <View>
                    <Text style={CommonStyles.label}>Or Estimate Expiry:</Text>
                    <View style={CommonStyles.rowView}>
                        {EXPIRY_ESTIMATES.map((estimate: ExpiryEstimate) => (
                            <View key={estimate.label} style={CommonStyles.rowButton}>
                                <Button title={estimate.label} onPress={() => handleSelectEstimate(estimate.days)} />
                            </View>
                        ))}
                    </View>
                </View> : null }

                <View style={{ ...CommonStyles.rowView, ...CommonStyles.bottomButtons}}>
                    <View style={CommonStyles.rowButton}>
                        <Button title={leftButton.title} onPress={handleButtonLeft}/>
                    </View>
                    { rightButton &&
                    <View style={CommonStyles.rowButton}>
                        <Button title={rightButton.title} onPress={handleButtonRight}/>
                    </View>}
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
});