import { View } from "react-native";
import { GreetAll } from "./../components/Greetings";

export default function Index() {
  return (
    <View>
      <App/>
    </View>
  );
}

const App = () => {
  const names: string[] = ["John", "Jack", "Jill", "Bill", "Belle", "Joan", "Bob"];

  return (
    <GreetAll names={names} />
  )
}