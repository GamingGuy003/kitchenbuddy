import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <App/>
    </View>
  );
}

const Greet = ({name}:{name:string}) => {
  return (
    <Text>
      Hello {name}
    </Text>
  )
}

const GreetAll = ({names}:{names:string[]}) => {
  return (
    <View>
      { names.map(name => <Greet name={name}/>) }
    </View>
  )
}

const App = () => {
  const names: string[] = ["John", "Jack", "Jill", "Bill", "Belle", "Joan", "Bob"];

  return (
    <GreetAll names={names} />
  )
}