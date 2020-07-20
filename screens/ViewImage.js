import React, {Component, useState} from 'react';
// import ImageView from 'react-native-image-viewing';
// import Gallery from 'react-native-image-gallery'
import { StyleSheet, Text, View, Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';


export default class ViewImage extends Component {

    render(){
        const imagesUrl = this.props.route.params.imageUrls;

        let images = []

        if (imagesUrl){
            imagesUrl.forEach(image => {
            images.push({url: image})
            })
        } else {
            console.log("empty")
        }

        console.log(images.length)
        return (
            <ImageViewer imageUrls={images}/>
        );
    }
}


const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
})