import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export const List = ({content}:{content: string[]}) => {
    const [selected, setSelected] = useState<string|null>(null);

    return (
        <View>
            { selected ? 
                <Pressable onPress={() => setSelected(null)}>
                    <Text>Selected: {selected}</Text>
                </Pressable> :
                content.map((item: string) => (
                    <Pressable onPress={() => setSelected(item)}>
                        <Text>Content: {item}</Text>
                    </Pressable>
                ))
            }
        </View>
    )
}