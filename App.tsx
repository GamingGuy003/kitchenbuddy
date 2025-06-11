import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  return (<StackNavigator/>);
}

const StackNavigator = () => {
  const Stack = createStackNavigator();

  return (<View></View>);
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
