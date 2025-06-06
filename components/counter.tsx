import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export const Counter = () => {
    const [count, setCount] = useState<number>(0);
    const inc = () => setCount(count + 1);
    const dec = () => setCount(count - 1);

    return (
        <View>
            <Text>Count is {count}</Text>
            <Button title='+' onPress={inc}/>
            <Button title='-' onPress={dec}/>
        </View>
    )
}