
// React
import React from 'react'
// React Native
import { View, Dimensions } from "react-native"
// External Dependencies
import { LineChart } from 'react-native-chart-kit';
import PieChart from 'react-native-pie-chart';
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView,
  SegmentedControl,
  CardLayout,
  Text,
  Separator,
} from "../../../designSystem"
import { DashBoardViewProps } from "./DashBoardView.model";
import { formatCurrency } from '../../../utils/formatCurrency'
import useDashBoardView from './DashBoardView.controller';

const DashBoardView: React.FC<DashBoardViewProps> = (props) => {

  const {
    totalByNotesFiltered,
    totalRemainingByNotesFiltered,
    percentageDifference,
    mostSoldProduct,
    segmentSelected,
    setSegmentSelected,
    chartData,
    segments,
    theme,
    getTranslatedUnit
  } = useDashBoardView();

  return (
    <ViewLayout>
      <ScrollView isBottomTab>
        <Header copyIDTitle="DASH_HEADER_TITLE" copyIDDescription="DASH_HEADER_DESCRIPTION" />
        <View style={{width: '100%', justifyContent: "center", alignItems: "center", marginTop: "2%"}} >
          <SegmentedControl style={{width: "95%"}} itemSelected={segmentSelected} setItemSelected={setSegmentSelected} items={segments} />
        </View>

        <CardLayout cardStyle={{gap: 2}} style={{marginTop: "4%", width: "95%", alignSelf: "center"}}>
          <Text size='small' copyID="DASH_TOTAL_SALES" color='textLight' bold />
          <Separator />

          <Text  copyID={formatCurrency(totalByNotesFiltered)} size='huge' bold />


          <View style={{flexDirection: "row",  alignItems: "flex-end", gap: 8, }}>
            <Text 
              size='extraSmall' 
              copyID={segmentSelected === segments[0] 
                ? "DASH_COMPARATIVE_DAY" 
                : segmentSelected === segments[1] 
                  ? "DASH_COMPARATIVE_WEEK" 
                  : "DASH_COMPARATIVE_MONTH"
              } 
            />
            <Text color={percentageDifference >= 0 ? 'success' : 'error'} copyID={`${percentageDifference.toFixed(2)}%`} bold />
          </View>
        </CardLayout>
       
        {
            totalRemainingByNotesFiltered + (totalByNotesFiltered - totalRemainingByNotesFiltered) > 0 && (
            
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "4%", marginHorizontal: "4%"}}>
              <PieChart
                series={[
                  {
                    value: totalRemainingByNotesFiltered,
                    color: theme.colors.secondary,
                  },
                  {
                    value: totalByNotesFiltered - totalRemainingByNotesFiltered,
                    color: theme.colors.primary,
    
                  }
                ]}
                widthAndHeight={Dimensions.get("window").width * 0.45}
                cover={0.6}
                padAngle={0.04}
              />
              <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                  <View style={{width: 12, height: 12, borderRadius:6, backgroundColor: theme.colors.primary}} />
                  <Text size='small' copyID="DASH_CHARGED" color='textLight' bold />
                </View>
                <Text size='huge' copyID={formatCurrency(totalByNotesFiltered - totalRemainingByNotesFiltered)} color='textLight' bold />
                <View style={{flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8}}>
                  <View style={{width: 12, height: 12, borderRadius:6, backgroundColor: theme.colors.secondary}} />
                  <Text size='small' copyID="DASH_PENDING" color='textLight' bold />
                </View> 
                <Text size='huge' copyID={formatCurrency(totalRemainingByNotesFiltered)} color='textLight' bold />
              </View> 
            </View>
            
      
            )
        }

       { chartData && chartData.labels.length > 0 &&
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width * 0.9}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: theme.colors.background,
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
            labelColor: (opacity = 1) => theme.colors.text,
            style: {
              borderRadius: 16
            },

          }}
          style={{marginTop: "4%"}}
          bezier
        />
        }
        
        {
          mostSoldProduct && (
            <CardLayout cardStyle={{gap: 2}} style={{marginTop: "4%", width: "95%", alignSelf: "center"}}>
              <Text size='small' copyID="DASH_MOST_SOLD" color='textLight' bold />
              <Separator />
              <Text  copyID={mostSoldProduct?.description ?? ""} size='huge' bold />
              <View style={{flexDirection: "row",  alignItems: "flex-end", gap: 4, }}>
                  <Text size='small' copyID={`DASH_SOLD_UNITS`} />
                  <Text color='success' copyID={`${mostSoldProduct?.quantity} ${mostSoldProduct?.unit ? getTranslatedUnit(mostSoldProduct.unit) : ''}`} bold />
              </View>
            </CardLayout>
          )
        }

      </ScrollView>

    </ViewLayout>
  )
}

export default DashBoardView;

