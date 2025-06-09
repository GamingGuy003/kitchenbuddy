import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export const Counter = () => {
    const [count, setCount] = useState<number>(0);
    const inc = () => setCount(count + 1);
    const dec = () => setCount(count - 1);

    return (
        <View style={{ width: '100%', gap: 5 }}>
            <Text style={style}>Count is {count}</Text>
            <Button title='+' onPress={inc}/>
            <Button title='-' onPress={dec}/>
        </View>
    )
}

const style = {
    color: '#770000',
}