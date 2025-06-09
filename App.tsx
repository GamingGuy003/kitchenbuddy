import { StyleSheet, Text, View } from 'react-native';
import { Counter } from './components/Counter';
import { List } from './components/List/List';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  return (<StackNavigator/>);
}

const StackNavigator = () => {
  const Stack = createStackNavigator();

  return (<NavigationContainer>
      <Stack.Navigator screenOptions={{headerTintColor: 'yellow'}}>
        <Stack.Screen name='count' component={Counter} options={{title: 'cuuunter'}}/>
        <Stack.Screen name='hirnlist' component={List} options={{title: 'Teiglische list'}}/>
      </Stack.Navigator>
    </NavigationContainer>);
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
