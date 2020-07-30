
import React, { useContext , useEffect} from 'react';
import { StyleSheet, Text, View, Image, FlatList, Alert} from 'react-native';
import { Card, FAB, Button, Title} from 'react-native-paper';
import {myContext} from '../reducers/reducer';

const Home = ({navigation}) => {
    const {state, dispatch} = useContext(myContext);
    const {data, loading} = state;

    useEffect(() => {
        fetchData()
    }, [])

    const ngrok_url = "http://19b2a2951b40.ngrok.io"

    const fetchData = () => {
        fetch(`${ngrok_url}`)
        .then(res =>res.json())
        .then(results => {
            // setData(results)
            dispatch({type:"ADD_DATA", payload:results})
        })
        .catch((err) => {Alert.alert("Could not load data from server.")})
        .finally(() => (
            //setLoading(false)
            dispatch({type:"SET_LOADING", payload:false})
            ))
    }

    const renderList = ((item) => {
        return (
            <Card
              style={styles.myCard}
              key={item._id.toString()}
              onPress={() => {navigation.navigate("RoadProfile", {item})}}
            >
                <View style={styles.flexRow}>
                    <View style={styles.cardView}>
                        <View style={styles.oneUnit}>
                            <Image source={{uri: item.imageUrls[0]}} 
                                style= {{width: 70, height: 70, borderRadius: 35}}
                            />
                            <Text style={styles.text}>{item.roadName}</Text>
                        </View>
                    </View>
                    <View style={{margin: 15}}>
                        <Text>Road Number: {item.roadNumber}</Text>
                        <Text>Chainage From: {item.fromChainage} To: {item.toChainage}</Text>
                        <Text>PCI: {item.pci}</Text>
                    </View>
                </View>
            </Card>
        )
    })
    return (
        <View style={{flex:1}}>
            <FlatList 
              data={data}
              renderItem={({item}) =>{
                  return renderList(item)
              }}
              keyExtractor={item => item._id.toString()}
              refreshing={loading}
              onRefresh={() => fetchData()}
            />
            <Button theme={theme} style={styles.Button} small={false}
                            // icon="camera" 

                            mode="contained" onPress={() => navigation.navigate("Create")}>
                                Upload
            </Button>
        </View>
    );
}


const theme = {
    colors:{
        primary: "#000",
    }
}

const styles = StyleSheet.create({
    myCard: {
        margin: 5,
        padding: 5,
        backgroundColor: '#fff'
    },
    cardView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flexRow: {
        flexDirection: 'row'
    },
    text: {
        color: 'black',
        fontWeight:'bold'
    },
    oneUnit: {
        marginLeft: 10,
        justifyContent: 'center'
    },
    fab: {
        position: 'absolute',
        margin: 25,
        right: 0,
        bottom: 0,
        backgroundColor: "#000"
    },
    Button:{
        position: 'relative',
        margin: 25,
        right:0,
        left:0,
        backgroundColor: "#000"
    }
})
export default Home;