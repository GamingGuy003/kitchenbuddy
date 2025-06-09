import { StyleSheet, Text, View } from 'react-native';
import { Counter } from './components/counter';
import { List } from './components/list/list';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';

export default function App() {
  const names: string[] = ["John", "Jack", "Jill", "Bill", "Belle", "Joan", "Bob"];
  return (
        <View style={styles.container}>
          <Counter/>
          <List content={names}/>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
