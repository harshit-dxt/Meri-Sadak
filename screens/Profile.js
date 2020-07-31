import React from 'react';
import { StyleSheet, Text, View, Image, Platform, Alert } from 'react-native';
import { Title, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialIcons } from '@expo/vector-icons';

const Profile = (props) => {
    const { _id, roadNumber, roadName, fromChainage, toChainage, roadLength, from, to, pci, location, numImage, imageUrls, damageImageUrls, timeCreated, timeModified} = props.route.params.item;
    const ngrok_url = "http://6a18323803af.ngrok.io";
    const deleteRoad = () => {
        fetch(`${ngrok_url}/delete`, {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                _id
            })
        })
        .then(res=>res.json())
        .then(deletedEmp=>{
            console.log(deletedEmp.firstName)
            Alert.alert("Road Details deleted.")
            props.navigation.navigate("Home")
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const images = []
    return(
        <View
        style={styles.root}
        >
            <LinearGradient
            colors={["#333", "#eee"]}
            style={{height: "20%"}}
            />
            <View style={{alignItems:'center'}}>
                <Image 
                    style={{width:100, height:100, marginTop:-100}}
                    source={ { uri:imageUrls[0]}}
                />
            </View>
            <View style={ { alignItems:'center', marginBottom: 15}}>
                <Title>{roadName}</Title>
                <Text>{roadNumber}</Text>
            </View>
            <Card style={styles.myCard}>
                <View style={styles.cardContent}>
                    <Text style={styles.myText}>Road Number: {roadNumber}</Text>
                </View>
            </Card>
            <Card style={styles.myCard}>
                <View style={styles.cardContent}>
                    <Text style={styles.myText}>Road Length: {roadLength}</Text>
                </View>
            </Card>
            <Card style={styles.myCard}>
                <View style={styles.cardContent}>
                    <Text style={styles.myText}>PCI: {pci}</Text>
                </View>
            </Card>
            <Card style={styles.myCard}>
                <View style={styles.cardContent}>
                    <Text style={styles.myText}>Number of Images: {numImage}</Text>
                </View>
            </Card>

            <Card style={styles.myCard} onPress={()=>{
                console.log(imageUrls)
                props.navigation.navigate("ViewImage", {imageUrls})}}>
                <View style={styles.cardContent} >
                    <Text style={styles.myText}>Images Uploaded</Text>
                </View>
            </Card>

            <Card style={styles.myCard} onPress={()=>{
                console.log(damageImageUrls)
                for(var index = 0; index < damageImageUrls.length; index++){
                    images.push({'uri': images[index]});
                }
                console.log(images)
                props.navigation.navigate("ViewImage", {images})
                }}>
                <View style={styles.cardContent} >
                    <Text style={styles.myText}>Damage Inference Images</Text>
                </View>
            </Card>
            <View style={{flexDirection: 'row', justifyContent:'space-around', padding:10}}>
                <Button theme={theme} style={styles.inputStyle } 
                // icon="pencil" 
                mode="contained" 
                onPress={() => {
                    props.navigation.navigate("Create", { _id, roadNumber, roadName, fromChainage, toChainage, roadLength, from, to, pci, location, numImage, imageUrls, damageImageUrls, timeCreated, timeModified })
                    }}
                >
                    Edit
                </Button>
                <Button theme={theme} style={styles.inputStyle } 
                // icon="delete" 
                mode="contained" onPress={() => deleteRoad()}>
                    Delete
                </Button>
            </View>
        </View>
    )
}

const theme = {
    colors:{
        primary: "#000",
    }
}

const styles = StyleSheet.create({
    root:{
        flex: 1,
        backgroundColor:'#eee'
    },
    myCard:{
        margin: 3,
    },
    cardContent:{
        flexDirection:'row',
        padding: 8
    },
    myText:{
        fontSize:18,
        marginTop: 3,
        marginLeft: 5,
    }
})

export default Profile;