import React, {useReducer} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import { reducer, initialState, myContext} from './reducers/reducer.js';
import Home from './screens/Home';
import RoadDetails from './screens/RoadDetails';
import Profile from './screens/Profile';
import ViewImage from './screens/ViewImage'

const Stack = createStackNavigator();

const myOptions = {
  headerTintColor: "#000",
  headerStyle:{
    backgroundColor:"#fff", 
  }   
}

function App() {
  
  return (
      <View
        style={styles.container}
      >
        <Stack.Navigator>
          <Stack.Screen 
            name="Home"
            component={Home}
            options={myOptions}
          />
          <Stack.Screen 
            name="Create"
            component={RoadDetails}
            options={{...myOptions, title: "Road Details"}}
          />
          <Stack.Screen 
            name="RoadProfile"
            component={Profile}
            options={{...myOptions, title: "Road Profile"}}
          />
          <Stack.Screen 
            name="ViewImage"
            component={ViewImage}
            options={{...myOptions, title: "Image Viewer"}}
          />
        </Stack.Navigator>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    < myContext.Provider 
      value={
        {state, dispatch}
      }
    >
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </myContext.Provider>
  )
}