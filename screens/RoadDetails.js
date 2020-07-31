import React, {useState} from 'react';
import { StyleSheet, View, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const RoadDetails = ({navigation, route}) => {

    const [modal, setModal] = useState(false);
    const [enableShift, setEnableShift] = useState(false);
    
    const ngrok_url = "http://6a18323803af.ngrok.io"
    const flask_url = "http://632a0311e4c4.ngrok.io/predict"
    const getDetails = (type) => {
        if(route.params){
            switch(type){
                case "roadName":
                    return route.params.roadName
                case "roadNumber":
                    return route.params.roadNumber
                case "fromChainage":
                    return route.params.fromChainage
                case "toChainage":
                    return route.params.toChainage
                case "roadLength":
                    return route.params.roadLength
                case "from":
                    return route.params.from
                case "to":
                    return route.params.to
                case "pci":
                    return route.params.pci
                case "location":
                    return route.params.location
                case "numImage":
                    return route.params.numImage
                case "timeCreated":
                    return route.params.timeCreated
                case "timeModified":
                    return route.params.timeModified
                case "imageUrls":
                    return route.params.imageUrls
                case "damageImageUrls":
                    return route.params.damageImageUrls
            }
        }
        else{
            switch (type) {
                case "roadName":
                    return ""
                case "roadNumber":
                    return ""
                case "fromChainage":
                    return ''
                case "toChainage":
                    return ''
                case "roadLength":
                    return ''
                case "from":
                    return ""
                case "to":
                    return ""
                case "pci":
                    return 1
                case "location":
                    return []
                case "numImage":
                    return 0
                case "timeCreated":
                    return ""
                case "timeModified":
                    return ""
                case "imageUrls":
                    return []
                case "damageImageUrls":
                    return []
            }
        }
    }
    const [roadNumber, setRoadNumber] = useState(getDetails('roadNumber'));
    const [roadName, setRoadName] = useState(getDetails('roadName'));
    const [toChainage, setToChainage] = useState(getDetails('toChainage'));
    const [fromChainage, setFromChainage] = useState(getDetails('fromChainage'));
    const [roadLength, setRoadLength] = useState(getDetails('roadLength'));
    const [from, setFrom] = useState(getDetails('from'));
    const [to, setTo] = useState(getDetails('to'));
    const [pci, setPCI] = useState(getDetails('pci'));
    const [location, setLocation] = useState(getDetails('location'));
    const [imageUrls, setImageUrls] = useState(getDetails('imageUrls'));
    const [damageImageUrls, setDamageImageUrls] = useState(getDetails('damageImageUrls'));
    const [numImage, setNumImage] = useState(getDetails('numImage'));

    const updateDetails = () => {
        fetch(`${ngrok_url}/update`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                _id: route.params._id,
                roadNumber,
                roadName, 
                fromChainage: parseFloat(fromChainage), 
                toChainage: parseFloat(toChainage), 
                roadLength: parseFloat(roadLength), 
                from, 
                to, 
                pci, 
                location, 
                numImage, 
                imageUrls,
                damageImageUrls, 
                timeCreated: Date.now(), 
                timeModified: Date.now()
            })
        })
        .then(res=>res.json())
        .then(data=>{
            Alert.alert("Road details updated.")
            navigation.navigate("Home")
        })
        .catch(err=>{Alert.alert("Couldn't update. Try again later!")}) 
    }

    const submitData = () => {
        fetch(`${ngrok_url}/send-data`, {
            method: "POST",
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify({
                roadNumber,
                roadName, 
                fromChainage, 
                toChainage, 
                roadLength, 
                from, 
                to, 
                pci, 
                location, 
                numImage, 
                imageUrls, 
                damageImageUrls,
                timeCreated: Date.now(), 
                timeModified: Date.now()
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleUpload = (image) => {
        const data = new FormData();
        const imgUrls = imageUrls;
        const damageImgUrls = damageImageUrls
        data.append('file', image);
        data.append('upload_preset', 'employeeApp');
        data.append('cloud_name', 'pathtut');

        fetch("https://api.cloudinary.com/v1_1/pathtut/image/upload",{
           method: "POST",
           body: data
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            imgUrls.push(data.url)
            setImageUrls(imgUrls);
            setNumImage(numImage+1)
            fetch(flask_url, {
                method:"POST",
                body: JSON.stringify({'imageUrl':data.url}),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(res=>res.json())
            .then(flaskData=>{
                console.log(flaskData)
                damageImgUrls.push(flaskData.damageImageUrl)
                setDamageImageUrls(damageImgUrls)
                setPCI(flaskData.pci)
                console.log(damageImageUrls)
                setModal(false);
                Alert.alert("Image uploaded and analysis done.")
            })
            .catch(err=>console.log(err))
            console.log(imageUrls)
            console.log(damageImageUrls)
            
        })
        .catch((err) => {
                console.log(err)
                Alert.alert("Error while uploading the file")
        })
        
    }

    const pickFromCamera = async ()=>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA).catch(err => console.log(err));
        const {status} = await Location.requestPermissionsAsync();
        const currentLoc = location;
        if (granted&&status=='granted') {
            let loc = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest, minimumAge:1}).catch(
            err => console.log(err)
            );
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect:[1,1],
                quality: 0.5,
                exif: true
            });
            currentLoc.push(loc);
            setLocation(currentLoc);
            console.log(location)
            if(!data.cancelled){
                let newFile = {
                    uri: data.uri,
                    type: `image/${data.uri.split(".")[1]}`,
                    name: `test.${data.uri.split(",")[1]}`
                }

                handleUpload(newFile);
            }
        }
        else{
            Alert.alert(
                { message: "Allow to take images using camera." }
            )
        }
    }

    return(
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableShift}>
            <View >
                    <TextInput 
                        style={styles.inputStyle}
                        mode="outlined"
                        label='Road Number'
                        onChangeText={text=> setRoadNumber(text)}
                        value={`${roadNumber}`}
                        onFocus={() => {setEnableShift(false)}}
                        theme={theme}
                    />
                    <TextInput 
                        style={styles.inputStyle}
                        mode="outlined"
                        label='Road Name'
                        onChangeText={text => setRoadName(text)}
                        value={roadName}
                        onFocus={() => {setEnableShift(false)}}
                        theme={theme}
                    />
                    <TextInput 
                        style={styles.inputStyle}
                        mode="outlined"
                        label='From Chainage'
                        onChangeText={(text) => {setFromChainage(text)}}
                        value={`${fromChainage}`}
                        onFocus={() => {setEnableShift(false)}}
                        keyboardType='numeric'
                        theme={theme}
                    />
                    <TextInput 
                        style={styles.inputStyle}
                        mode="outlined"
                        label='To Chainage'
                        onChangeText={(text) => {setToChainage((text))}}
                        value={`${toChainage}`}
                        onFocus={() => {setEnableShift(false)}}
                        keyboardType='numeric'
                        theme={theme}
                    />
                    <TextInput 
                        style={styles.inputStyle}
                        mode="outlined"
                        label='Road Length'
                        onChangeText={(text) => {setRoadLength((text))}}
                        value={`${roadLength}`}
                        onFocus={() => {setEnableShift(false)}}
                        keyboardType='numeric'
                        theme={theme}
                    />
                    <TextInput 
                        style={styles.inputStyle}
                        mode="outlined"
                        label='From'
                        onChangeText={(text) => {setFrom(text)}}
                        value={from}
                        onFocus={() => {setEnableShift(false)}}
                        theme={theme}
                    />
                    <TextInput 
                        style={styles.inputStyle}
                        mode="outlined"
                        label='To'
                        onChangeText={(text => setTo((text)))}
                        value={to}
                        onFocus={() => {setEnableShift(true)}}
                        theme={theme}
                    />
                    
                    <Button theme={theme} style={styles.inputStyle } 
                    // icon= "upload"
                    mode="contained" onPress={() => setModal(true)}>
                        Upload Image
                    </Button>
                    {
                        route.params?
                        <Button theme={theme} style={styles.inputStyle } 
                        // icon="content-save" 
                        mode="contained" onPress={() => {
                        updateDetails()
                        Alert.alert("Road Details updated");
                        navigation.navigate("Home");
                        }}>
                            Update Details
                        </Button> 
                        :
                    <Button theme={theme} style={styles.inputStyle } 
                    // icon="content-save" 
                    mode="contained" onPress={() => {
                    submitData( );
                    Alert.alert("Road Details Added");
                    navigation.navigate("Home");
                    }}>
                        Save
                    </Button>
                    }
                <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => setModal(false)}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalButtonView}>
                            <Button theme={theme} style={{width: "80%"}}
                            // icon="camera" 
                            mode="contained" onPress={() => {
                                console.log("Camera Pressed")
                                return pickFromCamera();
                                }}>
                                Camera
                            </Button>
                        </View>
                        <Button theme={theme} 
                        // icon="close-circle" 
                        onPress={() => setModal(false)}>
                            Cancel
                        </Button>
                    </View> 
                </Modal>
            </View>
        </KeyboardAvoidingView>
    )
}

const theme = {
    colors:{
        primary: "#000",
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    inputStyle: {
        fontSize: 18,
        borderColor: '#000',
        margin: 3,
        height: 40
    },
    modalButtonView:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    modalView:{
        position: 'absolute',
        bottom: 4,
        width: "100%",
        backgroundColor:"#ddd"
    }
})

export default RoadDetails;