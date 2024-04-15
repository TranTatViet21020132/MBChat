import { COLORS } from '@/constants/Colors';
import {
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NoDataProps = {
  iconName: 'image' | 'link' | 'document',
  noDataTitle: string,
  noDataGuild: string,
}

type NoDataPageProp = {
  noData: NoDataProps
}

const NoDataPage = (props: NoDataPageProp) => {
  const {
    noData
  } = props;

  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: COLORS.light.background 
      }}>
      <Ionicons 
        name={noData.iconName}
        size={50}
        color={COLORS.lightGray}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10, marginBottom: 10 }}>
        {noData.noDataTitle}
      </Text>
      <Text style={{ fontSize: 16 }}>
        {noData.noDataGuild}
      </Text>
    </View>
  )
}

export default NoDataPage