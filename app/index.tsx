import { Counter } from '@/components/counter';
import { List } from '@/components/list/list';
import { View } from 'react-native';

export default function Index() {
  const names: string[] = ["John", "Jack", "Jill", "Bill", "Belle", "Joan", "Bob"];
  return (
    <View>
      <Counter/>
      <List content={names}/>
    </View>
  );
}