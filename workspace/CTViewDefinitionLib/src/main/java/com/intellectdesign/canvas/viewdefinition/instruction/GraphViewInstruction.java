/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */

package com.intellectdesign.canvas.viewdefinition.instruction;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionInstruction;

/**
 * This class is responsible for providing data fetched from the data-source 
 * for the chart views. 
 * 
 * @version 1.0
 */
public abstract class GraphViewInstruction extends ListViewsInstruction
{
	/**
	 * This is the method need to be overridden by the developer 
	 * to modify the sqlparamMap id based on the requestParams 
	 * when there is a need for changing the SQL in Interapp communication 
	 * 
	 * @param sqlParamaMapId - String value of the Sql Param Id
	 * @param mapInputParamsc - String value of the Sql Param Id
	 * 
	 * @return sqlParamaMapId - String value of the Action Code for Inter-App communication
	 */
	protected String getUpdatedSqlParamMapId(String sqlParamaMapId, HashMap mapInputParams)
	{
		if (mapInputParams.containsKey(ViewDefinitionConstants.CHART_ACTION_CODE))
		{
			if (mapInputParams.get(ViewDefinitionConstants.CHART_ACTION_CODE).toString().length() > 0)
			{
				sqlParamaMapId = mapInputParams.get(ViewDefinitionConstants.CHART_ACTION_CODE).toString();
			}
		}
		return sqlParamaMapId;
	}

	



	/**
	 * This method is responsible for fetching the data to draw charts 
	 * that have dynamically changing data
	 *  
	 * @param xLabels - String value of the X Label
	 * @param yLbls - ArrayList of one or more Y Labels
	 * @param listViewData - List object that contains the chart X and Y Axis data
	 * @return
	 */
	private List dynamicListViewData(String xLbl, ArrayList yLbls, List listViewData)
	{
		List aList = new ArrayList(), bList = new ArrayList(), xValues = new ArrayList(), yLabels = new ArrayList(), tempList = new ArrayList(), ySeries = new ArrayList();
		HashMap hMap = null, tempMap = null;
		Iterator iter = listViewData.iterator();
		String tempStr = "";
		while (iter.hasNext())
		{
			hMap = new HashMap();
			hMap = (HashMap) iter.next();
			tempMap = new HashMap();
			tempMap.put(xLbl, hMap.get(xLbl));
			// ySeries.add(tempMap);
			yLabels.add(hMap.get(((ArrayList) (yLbls.get(0))).get(0).toString()));
			tempMap.put(hMap.get(((ArrayList) (yLbls.get(0))).get(0).toString()),
					hMap.get(((ArrayList) (yLbls.get(0))).get(1).toString()));

			aList.add(tempMap);
			xValues.add(hMap.get(xLbl));
		}
		Set aListUnique = new HashSet<String>(xValues);
		List uniqueXVal = new ArrayList<String>(aListUnique);
		Collections.sort(uniqueXVal);
		if (uniqueXVal.size() > 0)
		{
			String val = uniqueXVal.get(0).toString();
			if (val.contains(" - "))
			{
				Collections.sort(uniqueXVal, new Comparator<String>()
				{
					DateFormat df = new SimpleDateFormat("dd-MM-yy");

					@Override
					public int compare(String s1, String s2)
					{
						try
						{
							Date d1 = df.parse(s1.split(" - ")[0].trim());
							Date d2 = df.parse(s2.split(" - ")[0].trim());
							return d1.compareTo(d2);
						} catch (ParseException pe)
						{
							return 0;
						}
					}
				});
			}
		}
		Set yLblUnique = new HashSet<String>(yLabels);
		List uniqueYLbl = new ArrayList<String>(yLblUnique);
		iter = uniqueYLbl.iterator();
		while (iter.hasNext())
		{
			tempList = new ArrayList();
			tempList.add(iter.next());
			tempList.add(((ArrayList) (yLbls.get(0))).get(1));
			ySeries.add(tempList);
		}
		for (int i = 0; i < uniqueXVal.size(); i++)
		{
			tempStr = getFormattedXAxisLabel(uniqueXVal.get(i));
			// tempStr = (uniqueXVal.get(i) == null) ? " " : uniqueXVal.get(i).toString();
			tempMap = new HashMap();
			tempMap.put(xLbl, tempStr);
			for (int j = 0; j < aList.size(); j++)
			{
				hMap = new HashMap();
				hMap = (HashMap) aList.get(j);
				if (tempStr.equalsIgnoreCase(getFormattedXAxisLabel(hMap.get(xLbl))))
				{
					Iterator itr = hMap.entrySet().iterator();
					while (itr.hasNext())
					{
						Map.Entry pairs = (Map.Entry) itr.next();
						if (!xLbl.equalsIgnoreCase(pairs.getKey().toString()))
						{
							hMap = new HashMap();
							hMap.put(pairs.getKey(), pairs.getValue());
							tempMap.putAll(hMap);
						}
					}
				}

			}
			iter = uniqueYLbl.iterator();
			while (iter.hasNext())
			{
				tempStr = (String) iter.next();
				if (!tempMap.containsKey(tempStr))
				{
					tempMap.put(tempStr, 0);
				}
			}
			bList.add(tempMap);
		}
		aList = new ArrayList();
		aList.add(bList);
		aList.add(ySeries);
		return aList;
	}

	private SimpleDateFormat DEFAULT_X_AXIS_DATE_FORMAT = new SimpleDateFormat("dd-MMM-yy");

	/**
	 * This method provides the Formatted Axis Label
	 * 
	 * @param anObject - Class Object that contains the x axis 
	 * @return tempStr - String value of the X Axis Data Label
	 */
	private String getFormattedXAxisLabel(Object anObject)
	{
		String tempStr = " ";
		if (anObject != null)
		{
			if (anObject instanceof java.util.Date)
			{
				tempStr = DEFAULT_X_AXIS_DATE_FORMAT.format(anObject);
			} else
				tempStr = anObject.toString();
		}
		return tempStr;
	}

	/**
	 * This method returns a Map that contains json data of additional chart configurations 
	 * such as reference lines, custom label and color range. 
	 * These values will be sent to the chart's json data to process the configured features.
	 * 
	 * @param vdf - ViewDefinition object containing the view details
	 * @param inputParams - Cached Hashmap of Input Parameters from the client
	 * @return ChartAdditionalData - Hashmap of Reference Line, Language and Color Range configurations
	 *  
	 * @throws ViewDefinitionException - thrown if any error occurs while processing the request
	 */
	protected HashMap getChartAdditionalData(ViewDefinition vdf, HashMap inputParams) throws ViewDefinitionException
	{
		List chartConfigList = null;
		HashMap chartConfigMap = new HashMap();
		ViewDefinitionInstruction vdfIns = new ViewDefinitionInstruction();
		chartConfigList = vdfIns.getChartAddlConfig(vdf.getViewId());
		Iterator itr = chartConfigList.iterator();
		int key = 0;
		while (itr.hasNext())
		{
			chartConfigMap.put(key++,itr.next());
		}
		
		return chartConfigMap;
	}

	/**
	 * This method adds the color range for the Minimum and Maximum values used 
	 * for Custom Label configurations
	 * 
	 * 
	 * @param referenceList - List object that contains the 
	 * @return hm
	 */
	protected HashMap addColorRange(List referenceList)
	{
		HashMap hmReturnMap = new HashMap();

		ArrayList colorList = new ArrayList();
		HashMap aRefPoint = new HashMap();
		logger.ctdebug("CTVDF00258", referenceList);

		for (Iterator iterator = referenceList.iterator(); iterator.hasNext();)
		{
			HashMap mapIt = (HashMap) iterator.next();
			Iterator iter = mapIt.keySet().iterator();
			while (iter.hasNext())
			{
				Object key = iter.next();
				Object value = mapIt.get(key);

				aRefPoint = new HashMap();
				aRefPoint.put(ListViewConstants.minValue, key);
				aRefPoint.put(ListViewConstants.maxValue, value);
				colorList.add(aRefPoint);
			}
		}
		logger.ctdebug("CTVDF00259", aRefPoint);
		logger.ctdebug("CTVDF00260", colorList);
		hmReturnMap.put(ListViewConstants.ColorRange, colorList);

		logger.ctdebug("CTVDF00261", hmReturnMap);
		return hmReturnMap;
	}

	/**
	 * ref to method hm addReferencePts
	 * 
	 * @param referenceList
	 * @return hm
	 */
	protected HashMap addReferencePts(List referenceList)
	{
		HashMap hmReturnMap = new HashMap();
		ArrayList refList = new ArrayList();
		HashMap aRefPoint = new HashMap();
		logger.ctdebug("CTVDF00262", referenceList);
		for (Iterator iterator = referenceList.iterator(); iterator.hasNext();)
		{
			HashMap mapIt = (HashMap) iterator.next();
			Iterator iter = mapIt.keySet().iterator();
			while (iter.hasNext())
			{
				Object key = iter.next();
				Object value = mapIt.get(key);
				aRefPoint = new HashMap();
				aRefPoint.put(ListViewConstants.refLabel, key);
				aRefPoint.put(ListViewConstants.refValue, value);
				refList.add(aRefPoint);
			}
		}
		logger.ctdebug("CTVDF00263", aRefPoint);
		logger.ctdebug("CTVDF00264", refList);
		hmReturnMap.put(ListViewConstants.RefPoints, refList);
		logger.ctdebug("CTVDF00265", hmReturnMap);
		return hmReturnMap;
	}

	/**
	 * ref to method hm AddedLegend
	 * 
	 * @param yLegend
	 * @return hm
	 */
	public HashMap addYLegend(String yLegend)
	{
		HashMap hMap = new HashMap();
		hMap.put(ListViewConstants.YLegend, yLegend);
		logger.ctdebug("CTVDF00266", hMap);
		return hMap;
	}
	
	protected HashMap processResponse(List listViewData, ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException
	{
		HashMap responseData = new HashMap();
		HashMap temp = new HashMap();
		String bgColor = setChartBgColor();
		if(bgColor!= null)
			temp.put(ViewDefinitionConstants.CHART_BG_COLOR, bgColor);
		String paletteColors = setPaletteColors();
		if(paletteColors!= null)
			temp.put(ViewDefinitionConstants.PALETTE_COLORS, paletteColors);
		String showToolTip = showToolTip();
		if(showToolTip != null)
			temp.put(ViewDefinitionConstants.SHOW_TOOL_TIP,showToolTip);
		String toolTipBgColor = setToolTipBgColor();
		if(toolTipBgColor != null)
			temp.put(ViewDefinitionConstants.setToolTipBgColor,toolTipBgColor);
		String numberPrefix = setNumberPrefix();
		if(numberPrefix != null)
			temp.put(ViewDefinitionConstants.setNumberPrefix,numberPrefix);
		String numberSuffix = setNumberSuffix();
		if(numberSuffix != null)
			temp.put(ViewDefinitionConstants.setNumberSuffix,numberSuffix);
		String hoverEffect = showHoverEffect();
		if(hoverEffect != null)
			temp.put(ViewDefinitionConstants.showHoverEffect,hoverEffect);
		String legendPosition  = setLegendPosition();
		if(legendPosition!= null)
			temp.put(ViewDefinitionConstants.legendPosition,legendPosition);
		String formatNumberScale = setformatNumberScale();
		if(formatNumberScale != null)
			temp.put(ViewDefinitionConstants.formatNumberScale,formatNumberScale);
		String numberScaleValue = setNumberScaleValue();
		if(numberScaleValue != null)
			temp.put(ViewDefinitionConstants.numberScaleValue, numberScaleValue);
		String numberScaleUnit = setNumberScaleUnit();
		if(numberScaleUnit != null)
			temp.put(ViewDefinitionConstants.numberScaleUnit, numberScaleUnit);
		String decimals = setDecimals();
		if(decimals != null)
			temp.put(ViewDefinitionConstants.decimals, decimals);
		String valueFontColor = setValueFontColor();
		if(valueFontColor != null)
			temp.put(ViewDefinitionConstants.valueFontColor, valueFontColor);
		String kposition = setKposition();
		if(kposition != null)
			temp.put(ViewDefinitionConstants.thousandSeparatorPosition,kposition);
		String rotateLabels = rotateLabel();
		if(rotateLabels != null)
			temp.put(ViewDefinitionConstants.rotateLabels, rotateLabels);
		String slantLabels = slantLabel();
		if(slantLabels != null)
			temp.put(ViewDefinitionConstants.slantLabels, slantLabels);
		String showSum = setShowSum();
		if(showSum != null)
			temp.put(ViewDefinitionConstants.showSum, showSum);
		String stack100Percent = setStack100Percent();
		if(stack100Percent != null)
			temp.put(ViewDefinitionConstants.stack100Percent, stack100Percent);
		String labelFontBold = setLabelFontBold();
		if(labelFontBold != null)
			temp.put(ViewDefinitionConstants.labelFontBold, labelFontBold);
		String pointerRadius = setPointerRadius();
		if(pointerRadius != null)
			temp.put(ViewDefinitionConstants.pointerRadius, pointerRadius);
		String pointerBgColor = setPointerBgColor();
		if(pointerBgColor != null)
			temp.put(ViewDefinitionConstants.pointerBgColor, pointerBgColor);
		String pivotFillColor = setPivotFillColor();
		if(pivotFillColor != null)
			temp.put(ViewDefinitionConstants.pivotFillColor, pivotFillColor);
		String gaugeOuterRadius = setPointerRadius();
		if(gaugeOuterRadius != null)
			temp.put(ViewDefinitionConstants.gaugeOuterRadius, gaugeOuterRadius);
		String gaugeInnerRadius = setPointerRadius();
		if(gaugeInnerRadius != null)
			temp.put(ViewDefinitionConstants.gaugeInnerRadius, gaugeInnerRadius);
		String plotFillColor = setPlotFillColor();
		if(plotFillColor != null)
			temp.put(ViewDefinitionConstants.plotFillColor, plotFillColor);
		String targetColor = setTarsetColor();
		if(targetColor != null)
			temp.put(ViewDefinitionConstants.targetColor, targetColor);
		responseData.put(ViewDefinitionConstants.CHART_PROPERTIES, temp);
		HashMap defaultData = super.processResponse(listViewData, viewDefinition, mapInputParams);
		responseData.put(ViewDefinitionConstants.KEY_ALL_RECORDS, listViewData);
		responseData.put(ViewDefinitionConstants.KEY_TOTAL_NUM_RECORDS,defaultData.get(ViewDefinitionConstants.KEY_TOTAL_NUM_RECORDS));
		responseData.put(ViewDefinitionConstants.CHART_ADDITIONAL_PROPERTIES,getChartAdditionalData(viewDefinition, mapInputParams));
		
		
		return responseData;
		}

	/**
	 * @return
	 */
	private String setTarsetColor()
	{
		// TODO Auto-generated method stub
		return null;
	}





	/**
	 * @return
	 */
	private String setPlotFillColor()
	{
		// TODO Auto-generated method stub
		return null;
	}





	/**
	 * @return
	 */
	private String setPivotFillColor()
	{
		// TODO Auto-generated method stub
		return null;
	}





	/**
	 * @return
	 */
	private String setPointerBgColor()
	{
		// TODO Auto-generated method stub
		return null;
	}





	/**
	 * @return
	 */
	private String setPointerRadius()
	{
		// TODO Auto-generated method stub
		return null;
	}





	/**
	 * @return
	 */
	private String setLabelFontBold()
	{
		// TODO Auto-generated method stub
		return null;
	}





	/**
	 * @return
	 */
	private String setStack100Percent()
	{
		// TODO Auto-generated method stub
		return null;
	}





	/**
	 * @return
	 */
	private String setShowSum()
	{
		// TODO Auto-generated method stub
		return null;
	}





	/*Following methods can be used to override the chart cosmetics defaults.
	 *These methods can be used to edit the chart cosmetics for a 
	 *particular view. 
	 * */
	/**
	 * This method must be overrided to set the background color of the chart
	 * */
	protected String setChartBgColor()
	{
		return null;
	}
	/**
	 * This method must be overrrided to set the palette colors for the chart
	 * */
	protected String setPaletteColors()
	{
		return null;
	}
	
	protected String showToolTip()
	{
		return null;
	}
	protected String setToolTipBgColor()
	{
		return null;
	}
	protected String setNumberPrefix()
	{
		return null;
	}
	protected String setNumberSuffix()
	{
		return null;
	}
	protected String showHoverEffect()
	{
		return null;
	}
	protected String setLegendPosition()
	{
		return null;
	}
	/**
	 * @return
	 */
	protected String slantLabel()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @return
	 */
	protected String rotateLabel()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @return
	 */
	protected String setKposition()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @return
	 */
	protected String setValueFontColor()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @return
	 */
	protected String setDecimals()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @return
	 */
	protected String setNumberScaleUnit()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @return
	 */
	protected String setNumberScaleValue()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @return
	 */
	protected String setformatNumberScale()
	{
		// TODO Auto-generated method stub
		return null;
	}

	private Logger logger = Logger.getLogger(ListViewsInstruction.class);

}
