import React, {useState} from 'react';
import ImageView from 'react-native-image-viewing';

export default ViewImage = ({navigation, route}) => {
    const images = route.params.images;
    const [visible, setVisible] = useState(false);
    return(
        <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        />
    )
}