cbx.ns("canvas.env.chart"); 
canvas.env.chart.data = {};
(function(){
  var chartViewData = {};
  cbx.apply(canvas.env.chart.data,{
    storeChartViewData : function(viewId,viewData){
      chartViewData[viewId] = viewData;
    },
    getChartViewDataOf : function(viewId){
      return chartViewData[viewId];
    }
  });
  })();
canvas.env.chart.options = {};

 (function() {

  var defaultLibrary = 'FUSION';
  var legendPosition = "bottom";
  var numberPrefix ="";
  var numberSuffix = "";
  var paletteColors = "";       //#6793C2;
  var showToolTip = "1";
  var toolTipBgColor = "#000";
  var hoverEffect ="1";
  var formatNumberScale = "0";
  var numberScaleValue = "1000,100,100";
  var numberScaleUnit = " K, L, C";
  var decimals = "2";
  var forceDecimals = "1";//
  var valueFontColor = "";
  var valueBgColor ="";//
  var valueBgAlpha = "50";//
  var thousandSeparatorPosition = "2,3";
  var rotateLabels = "0";
  var slantLabels = "0";
  var chartProperty = {};
  var primaryChartType = "";
  var secondary1ChartType = "";
  var secondary2ChartType = "";
  var secondary3ChartType = "";
  var primarySeriesName = "";
  var secondary1SeriesName = "";
  var secondary2SeriesName = "";
  var secondary3SeriesName = "";
  var decimalSeparator = "";
  var thousandSeparator = "";
  var showSum = "1";
  var stack100Percent ="0";
  var labelFontBold = "0";
  var pointerRadius = "150";
  var pointerBgColor = "#000000";
  var pivotFillColor = "#5599CC";
  var gaugeOuterRadius = "200";
  var gaugeInnerRadius = "50";
  var plotFillColor = "0075c2";
  var targetColor = "#000000";
  var baseChartMessage = "";
  var typeNotSupportedMessage ="";
  var dataEmptyMessage = "";

  /*
  * Intent is the ultimate output
  * Gesture is way to achieve the intent
  */
  var gestureIntentMap = {
    "SINGLE_CLICK" : "drilldown", //gesture : intent
    "RIGHT_CLICK" : "contextclick"
  };
  cbx.apply(canvas.env.chart.options, {
    /**
     * Application user can use this to specify a different chart library as compared to the default at a chart type level.
     */
    setDefaults : function(userData)//sets the properties defined by the user.
    {
        if(!cbx.isEmpty(userData.defaultChartLib)){
          if(userData.isRecursiveCall !='Y')
            defaultLibrary = userData.defaultChartLib;
        } //sets default chart library

        if(!cbx.isEmpty(userData.legendPosition)){
           if(userData.isRecursiveCall !='Y')
            legendPosition = userData.legendPosition;
        } //sets legend position

        if(!cbx.isEmpty(userData.pointerRadius)){
           if(userData.isRecursiveCall !='Y')
            pointerRadius = userData.pointerRadius;
        }

        if(!cbx.isEmpty(userData.plotFillColor)){
           if(userData.isRecursiveCall !='Y')
            plotFillColor = userData.plotFillColor;
        }

        if(!cbx.isEmpty(userData.baseChartMessage)){
           if(userData.isRecursiveCall !='Y')
            baseChartMessage = userData.baseChartMessage;
        }

        if(!cbx.isEmpty(userData.typeNotSupportedMessage)){
           if(userData.isRecursiveCall !='Y')
            typeNotSupportedMessage = userData.typeNotSupportedMessage;
        }

        if(!cbx.isEmpty(userData.dataEmptyMessage)){
           if(userData.isRecursiveCall !='Y')
            dataEmptyMessage = userData.dataEmptyMessage;
        }
        if(!cbx.isEmpty(userData.targetColor)){
           if(userData.isRecursiveCall !='Y')
            targetColor = userData.targetColor;
        }

        if(!cbx.isEmpty(userData.pointerBgColor)){
           if(userData.isRecursiveCall !='Y')
            pointerBgColor = userData.pointerBgColor;
        }

        if(!cbx.isEmpty(userData.pivotFillColor)){
           if(userData.isRecursiveCall !='Y')
            pivotFillColor = userData.pivotFillColor;
        }
        
        if(!cbx.isEmpty(userData.gaugeOuterRadius)){
           if(userData.isRecursiveCall !='Y')
            gaugeOuterRadius = userData.gaugeOuterRadius;
        }

        if(!cbx.isEmpty(userData.gaugeInnerRadius)){
           if(userData.isRecursiveCall !='Y')
            gaugeInnerRadius = userData.gaugeInnerRadius;
        }

        if(!cbx.isEmpty(userData.numberPrefix)){
           if(userData.isRecursiveCall !='Y')
           numberPrefix =  userData.numberPrefix;
        } //sets number prefix

        if(!cbx.isEmpty(userData.numberSuffix)){
           if(userData.isRecursiveCall !='Y')
          numberSuffix = userData.numberSuffix;
        } // sets number suffix

        if(!cbx.isEmpty(userData.paletteColors)){
           if(userData.isRecursiveCall !='Y')
          paletteColors = userData.paletteColors;
        } // sets palette color   

        if(!cbx.isEmpty(userData.showToolTip)){
           if(userData.isRecursiveCall !='Y')
          showToolTip = userData.showToolTip;
        } // sets the user preference for toolTip

        if(!cbx.isEmpty(userData.toolTipBgColor)){
           if(userData.isRecursiveCall !='Y')
          toolTipBgColor = userData.toolTipBgColor;
        } // sets tooltip background color

        if(!cbx.isEmpty(userData.showHoverEffect)){
           if(userData.isRecursiveCall !='Y')
          showHoverEffect = userData.showHoverEffect;
        }// sets the user preference for hover effect

        if(!cbx.isEmpty(userData.formatNumberScale))
        {
           if(userData.isRecursiveCall !='Y')
          formatNumberScale = userData.formatNumberScale;
        }// this option tells whether FC should show "Ks & Ms"

        if(!cbx.isEmpty(userData.numberScaleValue))
        {
           if(userData.isRecursiveCall !='Y')
          numberScaleValue = userData.numberScaleValue;
        }// Specifies the conversion rate of the number format

        if(!cbx.isEmpty(userData.numberScaleUnit))
        {
          if(userData.isRecursiveCall !='Y')
          numberScaleUnit = userData.numberScaleUnit; 
        }

        if(!cbx.isEmpty(userData.decimals))
        {
          if(userData.isRecursiveCall !='Y')
          decimals = userData.decimals;
        }

        if(!cbx.isEmpty(userData.valueFontColor))
        {
           if(userData.isRecursiveCall !='Y')
          valueFontColor = userData.valueFontColor;
        }

        if(!cbx.isEmpty(userData.thousandSeparatorPosition))
        {
           if(userData.isRecursiveCall !='Y')
          thousandSeparatorPosition = userData.thousandSeparatorPosition;
        }

        if(!cbx.isEmpty(userData.rotateLabels))
        {
           if(userData.isRecursiveCall !='Y')
          rotateLabels = userData.rotateLabels;
        }

        if(!cbx.isEmpty(userData.slantLabels))
        {
           if(userData.isRecursiveCall !='Y')
          slantLabels = userData.slantLabels;
        }

        if(!cbx.isEmpty(userData.primaryChartType))
        {
           if(userData.isRecursiveCall !='Y')
          primaryChartType = userData.primaryChartType;
        }

        if(!cbx.isEmpty(userData.secondary1ChartType))
        {
           if(userData.isRecursiveCall !='Y')
          secondary1ChartType = userData.secondary1ChartType;
        }


        if(!cbx.isEmpty(userData.secondary2ChartType))
        {
           if(userData.isRecursiveCall !='Y')
          secondary2ChartType = userData.secondary2ChartType;
        }

        if(!cbx.isEmpty(userData.secondary3ChartType))
        {
           if(userData.isRecursiveCall !='Y')
          secondary3ChartType = userData.secondary3ChartType;
        }

        if(!cbx.isEmpty(userData.secondary1SeriesName))
        {
           if(userData.isRecursiveCall !='Y')
          secondary1SeriesName = userData.secondary1SeriesName;
        }

        if(!cbx.isEmpty(userData.secondary2SeriesName))
        {
           if(userData.isRecursiveCall !='Y')
          secondary2SeriesName = userData.secondary2SeriesName;
        }

        if(!cbx.isEmpty(userData.secondary3SeriesName))
        {
           if(userData.isRecursiveCall !='Y')
          secondary3SeriesName = userData.secondary3SeriesName;
        }

         if(!cbx.isEmpty(userData.primarySeriesName))
        {
           if(userData.isRecursiveCall !='Y')
          primarySeriesName = userData.primarySeriesName;
        }

         if(!cbx.isEmpty(userData.decimalSeparator))
        {
           if(userData.isRecursiveCall !='Y')
          decimalSeparator = userData.decimalSeparator;
        }

        if(!cbx.isEmpty(userData.thousandSeparator))
        {
           if(userData.isRecursiveCall !='Y')
          thousandSeparator = userData.thousandSeparator;
        }

        if(!cbx.isEmpty(userData.showSum))
        {
           if(userData.isRecursiveCall !='Y')
              showSum = userData.showSum;
        }

        if(!cbx.isEmpty(userData.stack100Percent))
        {
           if(userData.isRecursiveCall !='Y')
          stack100Percent = userData.stack100Percent;
        }


        if(!cbx.isEmpty(userData.labelFontBold))
        {
           if(userData.isRecursiveCall !='Y')
          labelFontBold = userData.labelFontBold;
        }
        
        if(!cbx.isEmpty(userData.gestures))
        {
          var IAGobj;//Intent and gesture object
          for(var i = 0;i<userData.gestures.length;i++)
          {   // checks whether call is recursive.
            if(userData.isRecursiveCall !='Y') 
            {
              IAGobj = userData.gestures[i];
              gestureIntentMap[IAGobj.gesture] = IAGobj.intent;// sets the intent for gestures
            }
            else{
              if(!gestureIntentMap[userData.chartType])
                  gestureIntentMap[userData.chartType] = {};
             gestureIntentMap[userData.chartType][userData.gestures[i].gesture] = userData.gestures[i].intent;
              //sets the intent for gestures for a particular chart type
            }
          }
        }

        if(!cbx.isEmpty(userData.overrides))
        { /* If the user wants to override particular chart type, 
          he has to override the propeties innside overrrides property */
            var chartObj;
            for(var i = 0;i<userData.overrides.length;i++)
            {
                  chartObj = userData.overrides[i];
                  var chartType = userData.overrides[i].chartType;
                  chartProperty[chartType] = userData.overrides[i];
                  if(userData.overrides[i].gestures){
                  //sets the overrided values for a particular chart in chartProperty object
                      userData.overrides[i].isRecursiveCall = "Y";
                      this.setDefaults(userData.overrides[i]);
                    }
            }
        }

    },
    getBaseChartMessage : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].baseChartMessage)
        return chartProperty[chartType].baseChartMessage;
      else
        return baseChartMessage;
    },
    getTypeNotSupportedMessage : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].typeNotSupportedMessage)
        return chartProperty[chartType].typeNotSupportedMessage;
      else
        return typeNotSupportedMessage;
    },
    getDataEmptyMessage : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].dataEmptyMessage)
        return chartProperty[chartType].dataEmptyMessage;
      else
        return dataEmptyMessage;
    },
    getChartLibFor : function(chartType)
    {
      var lib;
      if(chartProperty[chartType])
       lib = chartProperty[chartType].chartLib;
      if(cbx.isEmpty(lib))
       lib = defaultLibrary;
      return lib;
    },
  
    getIntentForGesture : function(gesture,chartType)
    {
      if(gestureIntentMap[chartType] && gestureIntentMap[chartType][gesture])
       return gestureIntentMap[chartType][gesture];
      else if(gestureIntentMap[gesture])
        return gestureIntentMap[gesture];
      else
          return gesture;
      //returns the intent specified for the gesture.
    },

    getLegendPosition : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].legendPosition)
        return chartProperty[chartType].legendPosition;
      else
        return legendPosition;
    },

    getShowSum : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].showSum)
        return chartProperty[chartType].showSum;
      else
        return showSum;
    },

    getTargetColor : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].targetColor)
        return chartProperty[chartType].targetColor;
      else
        return targetColor;
    },

    getPlotFillColor : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].plotFillColor)
        return chartProperty[chartType].plotFillColor;
      else
        return plotFillColor;
    },

    getStack100Percent : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].stack100Percent)
        return chartProperty[chartType].stack100Percent;
      else
        return stack100Percent;
    },

   getLabelFontBold: function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].labelFontBold)
        return chartProperty[chartType].labelFontBold;
      else
        return labelFontBold;
    },

   getPointerRadius: function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].pointerRadius)
        return chartProperty[chartType].pointerRadius;
      else
        return pointerRadius;
    },

   getPointerBgColor: function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].pointerBgColor)
        return chartProperty[chartType].pointerBgColor;
      else
        return pointerBgColor;
    },

   getPivotFillColor: function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].pivotFillColor)
        return chartProperty[chartType].pivotFillColor;
      else
        return pivotFillColor;
    },

   getGaugeOuterRadius: function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].gaugeOuterRadius)
        return chartProperty[chartType].gaugeOuterRadius;
      else
        return gaugeOuterRadius;
    },

   getGaugeInnerRadius: function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].gaugeInnerRadius)
        return chartProperty[chartType].gaugeInnerRadius;
      else
        return gaugeInnerRadius;
    },

    getNumberPreFix : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].numberPrefix)
        return chartProperty[chartType].numberPrefix;
      else
        return numberPrefix;
    },

    getNumberSuffix : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].numberSuffix)
        return chartProperty[chartType].numberSuffix;
      else
        return numberSuffix;
    },

    getPaletteColors : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].paletteColors)
        return chartProperty[chartType].paletteColors;
      else
        return paletteColors; 
    }, 

    getShowToolTip : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].showToolTip)
        return chartProperty[chartType].showToolTip;
      else
        return showToolTip;
    },

    getToolTipBgColor : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].toolTipBgColor)
        return chartProperty[chartType].toolTipBgColor;
      else
        return toolTipBgColor;
    },

    showHoverEffect : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].hoverEffect)
        return chartProperty[chartType].hoverEffect;
      else
        return hoverEffect;
    },

    getNumberScaleUnit : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].numberScaleUnit)
        return chartProperty[chartType].numberScaleUnit;
      else
        return numberScaleUnit;
    },

    getNumberScaleValue : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].numberScaleValue)
        return chartProperty[chartType].numberScaleValue;
      else
        return numberScaleValue;
    },

    formatNumber : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].formatNumberScale)
        return chartProperty[chartType].formatNumberScale;
      else
        return formatNumberScale;
    },

    getDecimals : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].decimals)
        return chartProperty[chartType].decimals;
      else
        return decimals;
    },

    getValueFontColor : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].valueFontColor)
        return chartProperty[chartType].valueFontColor;
      else
        return valueFontColor;
    },

    getThousandSeparatorPosition : function(chartType)
    {
      var amtFormatJSON = iportal.preferences.getAmountFormatJson();
      if(chartProperty[chartType] && chartProperty[chartType].thousandSeparatorPosition)
        return chartProperty[chartType].thousandSeparatorPosition;
      else if(amtFormatJSON){
        return amtFormatJSON.leadingGroupSize+","+amtFormatJSON.groupSize;
      }
      else
        return thousandSeparatorPosition;
    },

    rotateLabel : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].rotateLabels)
        return chartProperty[chartType].rotateLabels;
      else
        return rotateLabels;
    },

    slantLabel :function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].slantLabels)
        return chartProperty[chartType].slantLabels;
      else
        return slantLabels;
    },
    getPrimaryChartType : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].primaryChartType)
        return chartProperty[chartType].primaryChartType;
      else
        return primaryChartType;
    },
    getSecondary1ChartType : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].secondary1ChartType)
        return chartProperty[chartType].secondary1ChartType;
      else
        return secondary1ChartType;
    },
    getSecondary2ChartType : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].secondary2ChartType)
        return chartProperty[chartType].secondary2ChartType;
      else
        return secondary2ChartType;
    },
    getSecondary3ChartType : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].secondary3ChartType)
        return chartProperty[chartType].secondary3ChartType;
      else
        return secondary3ChartType;
    },
    getSecondary1SeriesName : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].secondary1SeriesName)
        return chartProperty[chartType].secondary1SeriesName;
      else
        return secondary1SeriesName;
    },
    getSecondary2SeriesName : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].secondary2SeriesName)
        return chartProperty[chartType].secondary2SeriesName;
      else
        return secondary2SeriesName;
    },
    getSecondary3SeriesName : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].secondary3SeriesName)
        return chartProperty[chartType].secondary3SeriesName;
      else
        return secondary3SeriesName;
    },
    getPrimarySeriesName : function(chartType)
    {
      if(chartProperty[chartType] && chartProperty[chartType].primarySeriesName)
        return chartProperty[chartType].primarySeriesName;
      else
        return primarySeriesName;
    },
    getThousandseparator : function(chartType)
    {
      var amtFormatJSON = iportal.preferences.getAmountFormatJson();
      if(chartProperty[chartType] && chartProperty[chartType].thousandSeparator)
        return chartProperty[chartType].thousandSeparator;
      else if(amtFormatJSON){
        if(amtFormatJSON.groupSeparator == 'S')
           amtFormatJSON.groupSeparator = " ";
        return amtFormatJSON.groupSeparator;
      }
      else
        return thousandSeparator;
    },
    getDecimalSeparator : function(chartType)
    {
      var amtFormatJSON = iportal.preferences.getAmountFormatJson();
      if(chartProperty[chartType] && chartProperty[chartType].decimalSeparator)
        return chartProperty[chartType].decimalSeparator;
      else if(amtFormatJSON){
        return amtFormatJSON.decimalSeparator;
      }
      else
        return decimalSeparator;
    }
  });
})();

