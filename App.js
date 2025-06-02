import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import HomePage from './pages/homePage';
import DenunciaPage from './pages/DenunciaPage';

function TabNavigator() {
  const tabs = [
    {
      name: 'Início',
      component: HomePage,
      icon: 'home',
    }
  ];

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      {tabs.map((tab) => (
        <Stack.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Stack.Navigator>
  );
}

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Denuncia"
          component={DenunciaPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}