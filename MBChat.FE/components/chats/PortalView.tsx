import { Text } from "react-native"
import { View } from "react-native"

const PortalView = ({ messageCordiantes }: any) => {
    return (<View style={{position: "absolute", top: messageCordiantes.y}}>
        <Text>PortalView</Text>
    </View>)
};

export default PortalView;