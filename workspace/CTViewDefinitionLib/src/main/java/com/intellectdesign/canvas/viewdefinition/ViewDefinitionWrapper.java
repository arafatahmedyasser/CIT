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

package com.intellectdesign.canvas.viewdefinition;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * This class is for view definition wrapper extends view definition
 * 
 * @version 1.0
 */
public class ViewDefinitionWrapper extends ViewDefinition
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -1589775714158821673L;
	private ViewDefinition parent = null;
	private ArrayList gdfListDateFilters = null;
	private ArrayList gdfDateFilterRanges = null;
	private ArrayList wrappedColumns = null;
	private Date gdfMaxDate = null;
	private String allTools = null;

	private String customTools = null;

	private Map bbarButtonsMap = null;

	/**
	 * The only constructor. Creates a wrapper over the parent view
	 * 
	 * @param parentView
	 */
	public ViewDefinitionWrapper(ViewDefinition parentView)
	{
		parent = parentView;
		wrappedColumns = wrapColumns(parent.getListColumns());
	}

	/**
	 * Returns a copy of the actual View Definition.
	 * 
	 * @return A clone of the original view definition
	 * @throws CloneNotSupportedException
	 */
	public ViewDefinition getClonedViewDefinition() throws CloneNotSupportedException
	{
		return (ViewDefinition) parent.clone();
	}

	/**
	 * This is ref to ArrayListPossible DateFilters
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getPossibleDateFilters()
	 */
	@Override
	public ArrayList getPossibleDateFilters()
	{
		return gdfListDateFilters;
	}

	/**
	 * This is ref to ArrayListPossible DateFilters Ranges
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getDateFilterRange()
	 */
	@Override
	public ArrayList getDateFilterRange()
	{
		return gdfDateFilterRanges;
	}

	/**
	 * This is ref to ArrayList Max DateFilters
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getDateFilterMaxDate()
	 */
	public Date getDateFilterMaxDate()
	{
		return gdfMaxDate;
	}

	/**
	 * This is ref to getViewDefinitionAsHashMap
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getViewDefinitionAsMap()
	 */
	@Override
	public HashMap getViewDefinitionAsMap()
	{
		HashMap viewMap = parent.getViewDefinitionAsMap();
		viewMap.put(ViewDefinitionConstants.FLD_POSSIBLE_DATE_FILTERS, gdfListDateFilters);
		viewMap.put(ViewDefinitionConstants.FLD_DATE_FILTERS_RANGE, gdfDateFilterRanges);
		if (getAllTools() != null)
			viewMap.put(ViewDefinitionConstants.FLD_TOOLS_LIST, getAllTools());

		if (getCustomTools() != null)
		{
			viewMap.put(ViewDefinitionConstants.FLD_CUSTOM_TOOLS_LIST, getCustomTools());
		}

		if (null != getBbarButtonsMap())
		{
			viewMap.put(ViewDefinitionConstants.FLD_BBAR_BUTTONS, getBbarButtonsMap());
		}

		if (null != getTbarButtonsMap())
		{
			viewMap.put(ViewDefinitionConstants.FLD_TBAR_BUTTONS, getTbarButtonsMap());
		}

		return viewMap;
	}

	/**
	 * This is ref tio reset dateFilter
	 * 
	 * @param currDate
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#resetDateFilters(java.util.Date)
	 */
	@Override
	public void resetDateFilters(Date currDate)
	{

		SimpleDateFormat defaultDateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date tmpDate = (currDate == null) ? new Date() : currDate;
		ArrayList listPossibleDateFilters = new ArrayList();
		ArrayList dateFilterRanges = new ArrayList();
		HashMap temp = null;

		HashMap mFilterComboValues = null;
		HashMap mFilterRangeValues = null;
		Calendar now = null;
		Calendar nowTo = null;
		for (int i = 0; i < parent.getDateFilters().size(); i++)
		{
			mFilterComboValues = new HashMap();
			mFilterRangeValues = new HashMap();
			now = Calendar.getInstance();
			now.setTime(tmpDate);

			temp = (HashMap) parent.getDateFilters().get(i);
			mFilterComboValues.put(ViewDefinitionConstants.COLUMN_ID, temp.get(ViewDefinitionConstants.COLUMN_ID));
			mFilterComboValues.put(ViewDefinitionConstants.IS_DEFAULT_FILTER,
					temp.get(ViewDefinitionConstants.IS_DEFAULT_FILTER));
			mFilterComboValues.put(ViewDefinitionConstants.DISPLAY_NM_KEY,
					temp.get(ViewDefinitionConstants.DISPLAY_NM_KEY));
			String filterUnit = (String) temp.get(ViewDefinitionConstants.FILTER_UNIT);
			Integer filterValue = Integer.parseInt((String) temp.get(ViewDefinitionConstants.FILTER_VALUE));

			if (ViewDefinitionConstants.D.equalsIgnoreCase(filterUnit))
			{
				now.add(Calendar.DATE, -filterValue);
			} else if (ViewDefinitionConstants.M.equalsIgnoreCase(filterUnit))
			{
				now.add(Calendar.MONTH, -filterValue);
			} else if (ViewDefinitionConstants.Y.equalsIgnoreCase(filterUnit))
			{
				now.add(Calendar.YEAR, -filterValue);
			}

			else if (ViewDefinitionConstants.W.equalsIgnoreCase(filterUnit))
			{
				now.add(Calendar.DATE, -(7 * filterValue));
			} else if (ViewDefinitionConstants.SM.equalsIgnoreCase(filterUnit))
			{
				now.add(Calendar.DATE, -(now.get(Calendar.DAY_OF_MONTH) - 1));
				now.add(Calendar.MONTH, -filterValue);
			} else if (ViewDefinitionConstants.SY.equalsIgnoreCase(filterUnit))
			{
				now.add(Calendar.DATE, -(now.get(Calendar.DAY_OF_MONTH) - 1));
				now.add(Calendar.MONTH, -(now.get(Calendar.MONTH)));
				now.add(Calendar.YEAR, -filterValue);
			} else if (ViewDefinitionConstants.SW.equalsIgnoreCase(filterUnit))
			{
				now.add(Calendar.DATE, -((now.get(Calendar.DAY_OF_WEEK)) + (7 * filterValue) - 1));
			}

			else if (ViewDefinitionConstants.PD.equalsIgnoreCase(filterUnit))
			{
				if (filterValue == 0)
				{
					continue;
				}
				now.add(Calendar.DATE, -filterValue);
				nowTo = Calendar.getInstance();
				nowTo.setTime(tmpDate);
				nowTo.add(Calendar.DATE, -1);
				mFilterComboValues.put(
						ViewDefinitionConstants.TO_DATE,
						nowTo.get(Calendar.DATE) + "/" + (nowTo.get(Calendar.MONTH) + 1) + "/"
								+ nowTo.get(Calendar.YEAR));
			} else if (ViewDefinitionConstants.PW.equalsIgnoreCase(filterUnit))
			{
				if (filterValue == 0)
				{
					continue;
				}
				now.add(Calendar.DATE, -((now.get(Calendar.DAY_OF_WEEK)) + (7 * filterValue) - 1));
				nowTo = Calendar.getInstance();
				nowTo.setTime(tmpDate);
				nowTo.add(Calendar.DATE, -(nowTo.get(Calendar.DAY_OF_WEEK)));
				mFilterComboValues.put(
						ViewDefinitionConstants.TO_DATE,
						nowTo.get(Calendar.DATE) + "/" + (nowTo.get(Calendar.MONTH) + 1) + "/"
								+ nowTo.get(Calendar.YEAR));
			} else if (ViewDefinitionConstants.PM.equalsIgnoreCase((String) temp
					.get(ViewDefinitionConstants.FILTER_UNIT)))
			{
				if (filterValue == 0)
				{
					continue;
				}
				now.set(Calendar.DATE, 1);
				now.add(Calendar.MONTH, -filterValue);
				// Setting the previous month's last date as to date.
				nowTo = Calendar.getInstance();
				nowTo.setTime(tmpDate);
				nowTo.add(Calendar.MONTH, -1);
				nowTo.set(Calendar.DATE, nowTo.getActualMaximum(Calendar.DAY_OF_MONTH));
				mFilterComboValues.put(
						ViewDefinitionConstants.TO_DATE,
						nowTo.get(Calendar.DATE) + "/" + (nowTo.get(Calendar.MONTH) + 1) + "/"
								+ nowTo.get(Calendar.YEAR));
			} else if (ViewDefinitionConstants.PY.equalsIgnoreCase(filterUnit))
			{
				if (filterValue == 0)
				{
					continue;
				}
				now.set(Calendar.DATE, 1);
				now.set(Calendar.MONTH, Calendar.JANUARY);
				now.add(Calendar.YEAR, -filterValue);
				nowTo = Calendar.getInstance();
				nowTo.setTime(tmpDate);
				nowTo.set(Calendar.DATE, 31);
				nowTo.set(Calendar.MONTH, Calendar.DECEMBER);
				nowTo.add(Calendar.YEAR, -1);
				mFilterComboValues.put(
						ViewDefinitionConstants.TO_DATE,
						nowTo.get(Calendar.DATE) + "/" + (nowTo.get(Calendar.MONTH) + 1) + "/"
								+ nowTo.get(Calendar.YEAR));
			}
			if ((Integer.valueOf(ViewDefinitionConstants.NO_FILTERS).equals(filterValue)))
			{
				mFilterComboValues.put(ViewDefinitionConstants.FROM_DATE, ViewDefinitionConstants.NO_FILTERS);
				mFilterComboValues.put(ViewDefinitionConstants.TO_DATE, ViewDefinitionConstants.NO_FILTERS);
			} else
			{
				if (filterValue < 0)
				{
					mFilterComboValues
							.put(ViewDefinitionConstants.TO_DATE,
									now.get(Calendar.DATE) + "/" + (now.get(Calendar.MONTH) + 1) + "/"
											+ now.get(Calendar.YEAR));
				} else
				{
					mFilterComboValues
							.put(ViewDefinitionConstants.FROM_DATE,
									now.get(Calendar.DATE) + "/" + (now.get(Calendar.MONTH) + 1) + "/"
											+ now.get(Calendar.YEAR));
				}

				if (!(ViewDefinitionConstants.PD.equalsIgnoreCase((String) temp
						.get(ViewDefinitionConstants.FILTER_UNIT)))
						&& !(ViewDefinitionConstants.PW.equalsIgnoreCase((String) temp
								.get(ViewDefinitionConstants.FILTER_UNIT)))
						&& !(ViewDefinitionConstants.PY.equalsIgnoreCase((String) temp
								.get(ViewDefinitionConstants.FILTER_UNIT)))
						&& !(ViewDefinitionConstants.PM.equalsIgnoreCase((String) temp
								.get(ViewDefinitionConstants.FILTER_UNIT))))
				{
					now = Calendar.getInstance();
					now.setTime(tmpDate);
					if (filterValue < 0)
					{
						mFilterComboValues.put(
								ViewDefinitionConstants.FROM_DATE,
								now.get(Calendar.DATE) + "/" + (now.get(Calendar.MONTH) + 1) + "/"
										+ now.get(Calendar.YEAR));
					} else
					{
						mFilterComboValues.put(
								ViewDefinitionConstants.TO_DATE,
								now.get(Calendar.DATE) + "/" + (now.get(Calendar.MONTH) + 1) + "/"
										+ now.get(Calendar.YEAR));
					}
				}
			}
			String minUnit = (String) temp.get(ViewDefinitionConstants.MIN_UNIT);
			Integer minValue = Integer.parseInt((String) temp.get(ViewDefinitionConstants.MIN_VALUE));

			if (i == 0)
			{
				mFilterRangeValues.put(ViewDefinitionConstants.COLUMN_ID, temp.get(ViewDefinitionConstants.COLUMN_ID));

				now = Calendar.getInstance();
				now.setTime(tmpDate);
				if (ViewDefinitionConstants.D.equalsIgnoreCase(minUnit))
				{
					now.add(Calendar.DATE, -minValue);
				} else if (ViewDefinitionConstants.M.equalsIgnoreCase(minUnit))
				{
					now.add(Calendar.MONTH, -minValue);
				} else if (ViewDefinitionConstants.Y.equalsIgnoreCase(minUnit))
				{
					now.add(Calendar.YEAR, -minValue);
				}

				mFilterRangeValues.put(ViewDefinitionConstants.MIN_DATE,
						now.get(Calendar.DATE) + "/" + (now.get(Calendar.MONTH) + 1) + "/" + now.get(Calendar.YEAR));

				now = Calendar.getInstance();
				now.setTime(tmpDate);

				String maxUnit = (String) temp.get(ViewDefinitionConstants.MAX_UNIT);
				Integer maxValue = Integer.parseInt((String) temp.get(ViewDefinitionConstants.MAXI_VALUE));

				if (ViewDefinitionConstants.D.equalsIgnoreCase(maxUnit))
					now.add(Calendar.DATE, maxValue);
				else if (ViewDefinitionConstants.M.equalsIgnoreCase(maxUnit))
					now.add(Calendar.MONTH, maxValue);
				else if (ViewDefinitionConstants.Y.equalsIgnoreCase(maxUnit))
					now.add(Calendar.YEAR, maxValue);

				mFilterRangeValues.put(ViewDefinitionConstants.MAX_DATE,
						now.get(Calendar.DATE) + "/" + (now.get(Calendar.MONTH) + 1) + "/" + now.get(Calendar.YEAR));

				maxUnit = (String) temp.get(ViewDefinitionConstants.MAX_SELECTION_PERIOD_UNIT);
				maxValue = Integer.parseInt((String) temp.get(ViewDefinitionConstants.MAX_SELECTION_PERIOD_VAL));
				if (maxUnit != null)
				{
					mFilterRangeValues.put(ViewDefinitionConstants.MAX_SELECTION_PERIOD_UNIT, maxUnit);
				}
				if (maxValue != null)
				{
					mFilterRangeValues.put(ViewDefinitionConstants.MAX_SELECTION_PERIOD_VAL, maxValue);
				}
				// Identify the global bounds if configured.
				if (temp.get(ViewDefinitionConstants.GLOBAL_PERIOD_UNIT) != null)
				{
					// So unit is configured. Evaluate the proper min date and stamp it in the values.
					now = Calendar.getInstance();
					now.setTime(tmpDate);
					filterUnit = (String) temp.get(ViewDefinitionConstants.GLOBAL_PERIOD_UNIT);
					filterValue = Integer.parseInt((String) temp.get(ViewDefinitionConstants.GLOBAL_PERIOD_VAL));
					if (ViewDefinitionConstants.D.equalsIgnoreCase(filterUnit))
						now.add(Calendar.DATE, -filterValue);
					else if (ViewDefinitionConstants.M.equalsIgnoreCase(filterUnit))
						now.add(Calendar.MONTH, -filterValue);
					else if (ViewDefinitionConstants.Y.equalsIgnoreCase(filterUnit))
						now.add(Calendar.YEAR, -filterValue);
					// Set the value into the filterrange values
					mFilterRangeValues.put(ViewDefinitionConstants.GLOBAL_MIN_DATE,
							defaultDateFormat.format(now.getTime()));
				}
			}

			listPossibleDateFilters.add(mFilterComboValues);
			dateFilterRanges.add(mFilterRangeValues);

		}

		this.gdfListDateFilters = listPossibleDateFilters;
		this.gdfDateFilterRanges = dateFilterRanges;
	}

	/**
	 * this is ref to SelectionType
	 * 
	 * @param selectionType
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setSelectionType(java.lang.String)
	 */
	@Override
	public void setSelectionType(String selectionType)
	{
		// Read-only
	}

	/**
	 * to get dataSrc ID
	 * 
	 * @param dataSrcId
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setDataSrcId(java.lang.String)
	 */
	@Override
	public void setDataSrcId(String dataSrcId)
	{
		// Read-only
	}

	/**
	 * this is ref to setGetAutoLoadInd
	 * 
	 * @param autoLoad
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setGetAutoLoadInd(java.lang.String)
	 */
	@Override
	public void setGetAutoLoadInd(String autoLoad)
	{
		// Read-only
	}

	/**
	 * this is refr to setChartType
	 * 
	 * @param chartType
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setChartType(java.lang.String)
	 */
	@Override
	public void setChartType(String chartType)
	{
		// Read-only
	}

	/**
	 * this is ref to StartUpMode
	 * 
	 * @param startUpMode
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setStartUpMode(java.lang.String)
	 */
	@Override
	public void setStartUpMode(String startUpMode)
	{
		// Read-only
	}

	/**
	 * this is ref to SetViewType
	 * 
	 * @param viewType
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setViewType(java.lang.String)
	 */
	@Override
	public void setViewType(String viewType)
	{
		// Read-only
	}

	/**
	 * this is ref to SetViewType Name
	 * 
	 * @param viewName
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setViewName(java.lang.String)
	 */
	@Override
	public void setViewName(String viewName)
	{
		// Read-only
	}

	/**
	 * this is ref to SetViewType ID
	 * 
	 * @param viewId
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setViewId(java.lang.String)
	 */
	@Override
	public void setViewId(String viewId)
	{
		// Read-only
	}

	/**
	 * this is ref to Set parentViewID
	 * 
	 * @param parentViewId
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setParentViewId(java.lang.String)
	 */
	@Override
	public void setParentViewId(String parentViewId)
	{
		// Read-only
	}

	/**
	 * this is re to SetinstructionClassName
	 * 
	 * @param instructionClassName
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setInstructionClassName(java.lang.String)
	 */
	@Override
	public void setInstructionClassName(String instructionClassName)
	{
		// Read-only
	}

	/**
	 * this is re to SetRecordsPerPage
	 * 
	 * @param recordsPerPage
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setRecordsPerPage(int)
	 */
	@Override
	public void setRecordsPerPage(int recordsPerPage)
	{
		// Read-only
	}

	/**
	 * this is ref to SetUserNum
	 * 
	 * @param userNumber
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setUserNumber(java.lang.String)
	 */
	@Override
	public void setUserNumber(String userNumber)
	{
		// Read-only
	}

	/**
	 * this is ref to setGCIF
	 * 
	 * @param gcif
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setGCIF(java.lang.String)
	 */
	@Override
	public void setGCIF(String gcif)
	{
		// Read-only
	}

	/**
	 * this ref to SetProduct
	 * 
	 * @param product
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setProduct(java.lang.String)
	 */
	@Override
	public void setProduct(String product)
	{
		// Read-only
	}

	/**
	 * this is ref to SubProduct
	 * 
	 * @param subProduct
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setSubProduct(java.lang.String)
	 */
	@Override
	public void setSubProduct(String subProduct)
	{
		// Read-only
	}

	/**
	 * this ius ref to SetHighLightInd
	 * 
	 * @param highlightInd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setHighlightInd(java.lang.String)
	 */
	@Override
	public void setHighlightInd(String highlightInd)
	{
		// Read-only
	}

	/**
	 * this is re to DefaultView
	 * 
	 * @param defaultView
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setDefaultView(boolean)
	 */
	@Override
	public void setDefaultView(boolean defaultView)
	{
		// Read-only
	}

	/**
	 * thix is ref to setStrRecordsPerPage
	 * 
	 * @param strRecordsPerPage
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setStrRecordsPerPage(java.lang.String)
	 */
	@Override
	public void setStrRecordsPerPage(String strRecordsPerPage)
	{
		// Read-only
	}

	/**
	 * thixs is ref to setStrDefaultView
	 * 
	 * @param strDefaultView
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setStrDefaultView(java.lang.String)
	 */
	@Override
	public void setStrDefaultView(String strDefaultView)
	{
		// Read-only
	}

	/**
	 * this ref to setSqlParamMapID
	 * 
	 * @param sqlParamMapID
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setSqlParamMapID(java.lang.String)
	 */
	@Override
	public void setSqlParamMapID(String sqlParamMapID)
	{
		// Read-only
	}

	/**
	 * this ref to setOverriddenView
	 * 
	 * @param overriddenView
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setOverriddenView(boolean)
	 */
	@Override
	public void setOverriddenView(boolean overriddenView)
	{
		// Read-only
	}

	/**
	 * this is ref to setSTROverriddenView
	 * 
	 * @param strOverriddenView
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setStrOverriddenView(java.lang.String)
	 */
	@Override
	public void setStrOverriddenView(String strOverriddenView)
	{
		// Read-only
	}

	/**
	 * this is ref to setStrGroupingEnabled
	 * 
	 * @param strGroupingEnabled
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setStrGroupingEnabled(java.lang.String)
	 */
	@Override
	public void setStrGroupingEnabled(String strGroupingEnabled)
	{
		// Read-only
	}

	/**
	 * this is ref to setSystemViewID
	 * 
	 * @param systemViewID
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setSystemViewID(java.lang.String)
	 */
	@Override
	public void setSystemViewID(String systemViewID)
	{
		// Read-only
	}

	/**
	 * this isa ref to SetfilterEnabled
	 * 
	 * @param filterEnabled
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setStrFilterEnabled(java.lang.String)
	 */
	@Override
	public void setStrFilterEnabled(String filterEnabled)
	{
		// Read-only
	}

	/**
	 * this is ref to setStrColumnOrderingEnabled
	 * 
	 * @param columnOrderingEnabled
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setStrColumnOrderingEnabled(java.lang.String)
	 */
	@Override
	public void setStrColumnOrderingEnabled(String columnOrderingEnabled)
	{
		// Read-only
	}

	/**
	 * this is ref to SetWidgetId
	 * 
	 * @param widgetId
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setWidgetId(java.lang.String)
	 */
	@Override
	public void setWidgetId(String widgetId)
	{
		// Read-only
	}

	/**
	 * this is ref to SetViewPreferences
	 * 
	 * @param viewPreferences
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setViewPreferences(com.intellectdesign.canvas.viewdefinition.ViewDefinitionPreferences)
	 */
	@Override
	public void setViewPreferences(ViewDefinitionPreferences viewPreferences)
	{
		// Read-only
	}

	/**
	 * thisis ref to setPageSize
	 * 
	 * @param pageSize
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setPageSize(java.lang.String)
	 */
	@Override
	public void setPageSize(String pageSize)
	{
		// Read-only
	}

	/**
	 * this is ref to setInitCollapsed
	 * 
	 * @param initCollapsed
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setInitCollapsed(java.lang.String)
	 */
	@Override
	public void setInitCollapsed(String initCollapsed)
	{
		// Read-only
	}

	/**
	 * this is ref to setDetailActionInd
	 * 
	 * @param detailActionInd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setDetailActionInd(java.lang.String)
	 */
	@Override
	public void setDetailActionInd(String detailActionInd)
	{
		// Read-only
	}

	/**
	 * this is ref setContextActionInd
	 * 
	 * @param contextActionInd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setContextActionInd(java.lang.String)
	 */
	@Override
	public void setContextActionInd(String contextActionInd)
	{
		// Read-only
	}

	/**
	 * this is ref to setContextColumn
	 * 
	 * @param contextColumn
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setContextColumn(java.lang.String)
	 */
	@Override
	public void setContextColumn(String contextColumn)
	{
		// Read-only
	}

	/**
	 * this is ref to setTotalResultInd
	 * 
	 * @param totalResultInd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setTotalResultInd(java.lang.String)
	 */
	@Override
	public void setTotalResultInd(String totalResultInd)
	{
		// Read-only
	}

	/**
	 * this is ref to SetDateFilters
	 * 
	 * @param dateFilters
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setDateFilters(java.util.ArrayList)
	 */
	@Override
	public void setDateFilters(ArrayList dateFilters)
	{
		// Read-only
	}

	/**
	 * this is ref to GlobalDateFitlerInd
	 * 
	 * @param globalDateFitlerInd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setGlobalDateFitlerInd(java.lang.String)
	 */
	@Override
	public void setGlobalDateFitlerInd(String globalDateFitlerInd)
	{
		// Read-only
	}

	/**
	 * this is ref to GroupHeaderReqd
	 * 
	 * @param groupingHeaderReqd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setGroupingHeaderReqd(java.lang.String)
	 */
	@Override
	public void setGroupingHeaderReqd(String groupingHeaderReqd)
	{
		// Read-only
	}

	/**
	 * this is ref to SetFunCode
	 * 
	 * @param functionCode
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setFunctionCode(java.lang.String)
	 */
	@Override
	public void setFunctionCode(String functionCode)
	{
		// Read-only
	}

	/**
	 * this is ref to IsDataCacheed
	 * 
	 * @param isDataCached
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setIsDataCached(java.lang.String)
	 */
	@Override
	public void setIsDataCached(String isDataCached)
	{
		// Read-only
	}

	/**
	 * this is ref to IsGroupModifiable
	 * 
	 * @param isGroupModifiable
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setIsGroupModifiable(java.lang.String)
	 */
	@Override
	public void setIsGroupModifiable(String isGroupModifiable)
	{
		// Read-only
	}

	/**
	 * this is ref to GroupingStage
	 * 
	 * @param initGroupStage
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setInitGroupStage(java.lang.String)
	 */
	@Override
	public void setInitGroupStage(String initGroupStage)
	{
		// Read-only
	}

	/**
	 * this is ref to ISSummaryReqd
	 * 
	 * @param isSummaryReqd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setIsSummaryReqd(java.lang.String)
	 */
	@Override
	public void setIsSummaryReqd(String isSummaryReqd)
	{
		// Read-only
	}

	/**
	 * this is ref to SetdetailMsgLbl
	 * 
	 * @param detailMsgInd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setDetailMsgInd(java.lang.String)
	 */
	@Override
	public void setDetailMsgInd(String detailMsgInd)
	{
		// Read-only
	}

	/**
	 * this is ref to detailMsgLbl
	 * 
	 * @param detailMsgLbl
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setDetailMsgLbl(java.lang.String)
	 */
	@Override
	public void setDetailMsgLbl(String detailMsgLbl)
	{
		// Read-only
	}

	/**
	 * this is ref to setChartNoTreadLines
	 * 
	 * @param detailMsgLbl
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setChartNoTreadLines(java.lang.String)
	 */
	@Override
	public void setChartNoTreadLines(String chartNoTreadLines)
	{
		// Read-only
	}

	/**
	 * this is ref to setSwitchingCharts
	 * 
	 * @param switchingCharts
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setSwitchingCharts(java.lang.String)
	 */
	@Override
	public void setSwitchingCharts(String switchingCharts)
	{
		// Read-only
	}

	/**
	 * this is ref to setLogoUrl
	 * 
	 * @param detailMsgLbl
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setLogoUrl(java.lang.String)
	 */
	@Override
	public void setLogoUrl(String logoUrl)
	{
		// Read-only
	}

	/**
	 * this is ref to setLogoProperty
	 * 
	 * @param logoProperty
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setLogoProperty(java.lang.String)
	 */
	@Override
	public void setLogoProperty(String logoProperty)
	{
		// Read-only
	}

	/**
	 * this is ref to setBorderInd
	 * 
	 * @param borderInd
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setBorderInd(java.lang.String)
	 */
	@Override
	public void setBorderInd(String borderInd)
	{
		// Read-only
	}

	/**
	 * this is ref to setChartYAxisMin
	 * 
	 * @param chartYAxisMin
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setChartYAxisMin(java.lang.String)
	 */
	@Override
	public void setChartYAxisMin(String chartYAxisMin)
	{
		// Read-only
	}

	/**
	 * this is ref to setChartYAxisMax
	 * 
	 * @param chartYAxisMax
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setChartYAxisMax(java.lang.String)
	 */
	@Override
	public void setChartYAxisMax(String chartYAxisMax)
	{
		// Read-only
	}

	/**
	 * this is ref to DataScopeCaxche
	 * 
	 * @param dataCacheScope
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setDataCacheScope(java.lang.String)
	 */
	@Override
	public void setDataCacheScope(String dataCacheScope)
	{
		// Read-only
	}

	/**
	 * this is ref to SelectionType
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getSelectionType()
	 */
	@Override
	public String getSelectionType()
	{
		return parent.getSelectionType();
	}

	/**
	 * this is ref to GetbbarButtonsMap
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getBbarButtonsMap()
	 */
	@Override
	public Map getBbarButtonsMap()
	{
		return bbarButtonsMap;
	}

	/**
	 * this is ref to BbarButtonsMap
	 * 
	 * @param bbarButtons
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setBbarButtonsMap(java.util.Map)
	 */
	@Override
	public void setBbarButtonsMap(Map bbarButtons)
	{
		bbarButtonsMap = bbarButtons;
	}

	/**
	 * this is ref to DataSrcID
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getDataSrcId()
	 */
	@Override
	public String getDataSrcId()
	{
		return parent.getDataSrcId();
	}

	/**
	 * this is ref to GetAutoLoadInd
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getGetAutoLoadInd()
	 */
	@Override
	public String getGetAutoLoadInd()
	{
		return parent.getGetAutoLoadInd();
	}

	/**
	 * this is ref to ChartType
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getChartType()
	 */
	@Override
	public String getChartType()
	{
		return parent.getChartType();
	}

	/**
	 * this is ref to StartUpMode
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getStartUpMode()
	 */
	@Override
	public String getStartUpMode()
	{
		return parent.getStartUpMode();
	}

	/**
	 * this is ref to ViewType
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getViewType()
	 */
	@Override
	public String getViewType()
	{
		return parent.getViewType();
	}

	/**
	 * this is ref to ViewName
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getViewName()
	 */
	@Override
	public String getViewName()
	{
		return parent.getViewName();
	}

	/**
	 * this is ref to getViewID
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getViewId()
	 */
	@Override
	public String getViewId()
	{
		return parent.getViewId();
	}

	/**
	 * this is ref to ParentViewID
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getParentViewId()
	 */
	@Override
	public String getParentViewId()
	{
		return parent.getParentViewId();
	}

	/**
	 * this is ref to InstructionClassName
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getInstructionClassName()
	 */
	@Override
	public String getInstructionClassName()
	{
		return parent.getInstructionClassName();
	}

	/**
	 * this is ref to RecordsPerPage
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getRecordsPerPage()
	 */
	@Override
	public int getRecordsPerPage()
	{
		return parent.getRecordsPerPage();
	}

	/**
	 * this is ref to GetUserNum
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getUserNumber()
	 */
	@Override
	public String getUserNumber()
	{
		return parent.getUserNumber();
	}

	/**
	 * this is ref to GETGCIF
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getGCIF()
	 */
	@Override
	public String getGCIF()
	{
		return parent.getGCIF();
	}

	/**
	 * this is ref to GetProduct
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getProduct()
	 */
	@Override
	public String getProduct()
	{
		return parent.getProduct();
	}

	/**
	 * this is ref to GetSubProduct
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getSubProduct()
	 */
	@Override
	public String getSubProduct()
	{
		return parent.getSubProduct();
	}

	/**
	 * this is ref to getHighlightIn
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getHighlightInd()
	 */
	@Override
	public String getHighlightInd()
	{
		return parent.getHighlightInd();
	}

	/**
	 * this is ref to DefaultView
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#isDefaultView()
	 */
	@Override
	public boolean isDefaultView()
	{
		return parent.isDefaultView();
	}

	/**
	 * this is ref to GetListColumn
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getListColumns()
	 */
	@Override
	public ArrayList getListColumns()
	{
		return wrappedColumns;
	}

	/**
	 * this is ref to listColumns
	 * 
	 * @param listColumns
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setListColumns(java.util.ArrayList)
	 */
	@Override
	public void setListColumns(ArrayList listColumns)
	{
		// Read-only
	}

	/**
	 * this ref to getStrRecordsPerPage
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getStrRecordsPerPage()
	 */
	@Override
	public String getStrRecordsPerPage()
	{
		return parent.getStrRecordsPerPage();
	}

	/**
	 * this is ref to getStrDefaultView
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getStrDefaultView()
	 */
	@Override
	public String getStrDefaultView()
	{
		return parent.getStrDefaultView();
	}

	/**
	 * this is ref to getSqlParamMapID
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getSqlParamMapID()
	 */
	@Override
	public String getSqlParamMapID()
	{
		return parent.getSqlParamMapID();
	}

	/**
	 * this is ref to IsOverriddenView
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#isOverriddenView()
	 */
	@Override
	public boolean isOverriddenView()
	{
		return parent.isOverriddenView();
	}

	/**
	 * this is ref to getStrOverriddenView
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getStrOverriddenView()
	 */
	@Override
	public String getStrOverriddenView()
	{
		return parent.getStrOverriddenView();
	}

	/**
	 * this is ref to GroupingEnabled
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#isGroupingEnabled()
	 */
	@Override
	public boolean isGroupingEnabled()
	{
		return parent.isGroupingEnabled();
	}

	/**
	 * this is ref to getStrGroupingEnabled
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getStrGroupingEnabled()
	 */
	@Override
	public String getStrGroupingEnabled()
	{
		return parent.getStrGroupingEnabled();
	}

	/**
	 * this is ref to GetSystemViewId
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getSystemViewID()
	 */
	@Override
	public String getSystemViewID()
	{
		return parent.getSystemViewID();
	}

	/**
	 * this is ref to FilterEnabled
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#isFilterEnabled()
	 */
	@Override
	public boolean isFilterEnabled()
	{
		return parent.isFilterEnabled();
	}

	/**
	 * this is ref to getStrFilterEnabled
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getStrFilterEnabled()
	 */
	@Override
	public String getStrFilterEnabled()
	{
		return parent.getStrFilterEnabled();
	}

	/**
	 * this iis ref to ColumnOrderingEnabled
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#isColumnOrderingEnabled()
	 */
	@Override
	public boolean isColumnOrderingEnabled()
	{
		return parent.isColumnOrderingEnabled();
	}

	/**
	 * this is ref to getStrColumnOrderingEnabled
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getStrColumnOrderingEnabled()
	 */
	@Override
	public String getStrColumnOrderingEnabled()
	{
		return parent.getStrColumnOrderingEnabled();
	}

	/**
	 * this ref to GetWidget
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getWidgetId()
	 */
	@Override
	public String getWidgetId()
	{
		return parent.getWidgetId();
	}

	/**
	 * this is ref to GetAllTools
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getAllTools()
	 */
	@Override
	public String getAllTools()
	{
		return allTools;
	}

	/**
	 * this is ref to SetAllTools
	 * 
	 * @param tools
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setAllTools(java.lang.String)
	 */
	@Override
	public void setAllTools(String tools)
	{
		allTools = tools;
	}

	/**
	 * this is ref to ViewDefinitionPreference
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getViewPreferences()
	 */
	@Override
	public ViewDefinitionPreferences getViewPreferences()
	{
		return parent.getViewPreferences();
	}

	/**
	 * this is ref to Get PageSize
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getPageSize()
	 */
	@Override
	public String getPageSize()
	{
		return parent.getPageSize();
	}

	/**
	 * this is ref to GetInitCollapsed
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getInitCollapsed()
	 */
	@Override
	public String getInitCollapsed()
	{
		return parent.getInitCollapsed();
	}

	/**
	 * this is ref to GetDetailActionInd
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getDetailActionInd()
	 */
	@Override
	public String getDetailActionInd()
	{
		return parent.getDetailActionInd();
	}

	/**
	 * this is ref to ActionIndContext
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getContextActionInd()
	 */
	@Override
	public String getContextActionInd()
	{
		return parent.getContextActionInd();
	}

	/**
	 * this ref to GetColumnContext
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getContextColumn()
	 */
	@Override
	public String getContextColumn()
	{
		return parent.getContextColumn();
	}

	/**
	 * this is ref to GetTotalresultInd
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getTotalResultInd()
	 */
	@Override
	public String getTotalResultInd()
	{
		return parent.getTotalResultInd();
	}

	/**
	 * this is ref to String Column
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getColumnNames()
	 */
	@Override
	public String[] getColumnNames()
	{
		return parent.getColumnNames();
	}

	/**
	 * this is ref to ColumnDef
	 * 
	 * @param sColumnId
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getColumnDefnForColumn(java.lang.String)
	 */
	@Override
	public ColumnDefinition getColumnDefnForColumn(String sColumnId)
	{
		ColumnDefinition parentColumn = parent.getColumnDefnForColumn(sColumnId);
		return parentColumn != null ? new ColumnDefinitionWrapper(parentColumn) : null;
	}

	/**
	 * this is ref to GetSortOrder Defi
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getOrderedSortDefinition()
	 */
	@Override
	public ArrayList getOrderedSortDefinition()
	{
		return parent.getOrderedSortDefinition();
	}

	/**
	 * this ref to get OrderedGroupColumn
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getOrderedGroupColumns()
	 */
	@Override
	public ArrayList<ColumnDefinition> getOrderedGroupColumns()
	{
		return wrapColumns(parent.getOrderedGroupColumns());
	}

	/**
	 * this is ref to GetgroupingColumns
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getGroupingColumns()
	 */
	@Override
	public ArrayList<String> getGroupingColumns()
	{
		return parent.getGroupingColumns();
	}

	/**
	 * this ref to getAllGroupableColumns to ArrayList
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getAllGroupableColumns()
	 */
	@Override
	public ArrayList<Map> getAllGroupableColumns()
	{
		return parent.getAllGroupableColumns();
	}

	/**
	 * this is ref to GroupingModel
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getGroupingModel()
	 */
	@Override
	public GroupingModel getGroupingModel()
	{
		return parent.getGroupingModel();
	}

	/**
	 * this ref to arraylist to getAllNonHiddenColumns
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getAllNonHiddenColumns()
	 */
	@Override
	public ArrayList<ColumnDefinition> getAllNonHiddenColumns()
	{
		return wrapColumns(parent.getAllNonHiddenColumns());
	}

	/**
	 * this is ref to ArrayList to getAllvisibleColumn
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getAllVisibleColumns()
	 */
	@Override
	public ArrayList<ColumnDefinition> getAllVisibleColumns()
	{
		return wrapColumns(parent.getAllVisibleColumns());
	}

	/**
	 * this is ref to ArrayList to getAllSearchableColumn
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getAllSearchableColumns()
	 */
	@Override
	public ArrayList<ColumnDefinition> getAllSearchableColumns()
	{
		return wrapColumns(parent.getAllSearchableColumns());
	}

	/**
	 * this is ref to getArrayListFilters
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getListFilters()
	 */
	@Override
	public ArrayList getListFilters()
	{
		return parent.getListFilters();
	}

	/**
	 * this is ref to getGraphicalViewSeriesColumns
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getGraphicalViewSeriesColumns()
	 */
	@Override
	public HashMap getGraphicalViewSeriesColumns()
	{
		return parent.getGraphicalViewSeriesColumns();
	}

	/**
	 * this is ref to preDefinedView
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#isPreDefinedView()
	 */
	@Override
	public boolean isPreDefinedView()
	{
		return parent.isPreDefinedView();
	}

	/**
	 * this is refv to GetDate Filters
	 * 
	 * @return
	 */
	@Override
	public ArrayList getDateFilters()
	{
		return parent.getDateFilters();
	}

	/**
	 * this is ref to getGlobalDateFitlerInd
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getGlobalDateFitlerInd()
	 */
	@Override
	public String getGlobalDateFitlerInd()
	{
		return parent.getGlobalDateFitlerInd();
	}

	/**
	 * this is ref to getGroupingHeaderReqd
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getGroupingHeaderReqd()
	 */
	@Override
	public String getGroupingHeaderReqd()
	{
		return parent.getGroupingHeaderReqd();
	}

	/**
	 * this is ref to GetFunction
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getFunctionCode()
	 */
	@Override
	public String getFunctionCode()
	{
		return parent.getFunctionCode();
	}

	/**
	 * this is ref to getIsDataCached
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getIsDataCached()
	 */
	@Override
	public String getIsDataCached()
	{
		return parent.getIsDataCached();
	}

	/**
	 * this is ref to getIsGroupModifiable
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getIsGroupModifiable()
	 */
	@Override
	public String getIsGroupModifiable()
	{
		return parent.getIsGroupModifiable();
	}

	/**
	 * this is ref to InitGroupStage
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getInitGroupStage()
	 */
	@Override
	public String getInitGroupStage()
	{
		return parent.getInitGroupStage();
	}

	/**
	 * this is ref to GetCustomTool
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getCustomTools()
	 */
	@Override
	public String getCustomTools()
	{
		return customTools;
	}

	/**
	 * this is ref to SetCustomTool
	 * 
	 * @param tools
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#setCustomTools(java.lang.String)
	 */
	@Override
	public void setCustomTools(String tools)
	{
		customTools = tools;
	}

	/**
	 * this is ref to GetIsSummaryReqd
	 * 
	 * @return
	 */
	@Override
	public String getIsSummaryReqd()
	{
		return parent.getIsSummaryReqd();
	}

	/**
	 * this is ref to getDetailMsgInd
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getDetailMsgInd()
	 */
	@Override
	public String getDetailMsgInd()
	{
		return parent.getDetailMsgInd();
	}

	/**
	 * this is redf to getDetailMsgLbl
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getDetailMsgLbl()
	 */
	@Override
	public String getDetailMsgLbl()
	{
		return parent.getDetailMsgLbl();
	}

	/**
	 * this is ref to String to str
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#toString()
	 */
	@Override
	public String toString()
	{
		return parent.toString();
	}

	/**
	 * this ref to getDataCacheScope
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getDataCacheScope()
	 */
	@Override
	public String getDataCacheScope()
	{
		return parent.getDataCacheScope();
	}

	/**
	 * this is ref to getChartYAxisMax
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getChartYAxisMax()
	 */
	@Override
	public String getChartYAxisMax()
	{
		return parent.getChartYAxisMax();
	}

	/**
	 * this is ref to getChartYAxisMin
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getChartYAxisMin()
	 */
	@Override
	public String getChartYAxisMin()
	{
		return parent.getChartYAxisMin();
	}

	/**
	 * this is ref to getLogoProperty
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getLogoProperty()
	 */
	@Override
	public String getLogoProperty()
	{
		return parent.getLogoProperty();
	}

	/**
	 * this is ref to getChartNoTreadLines
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getChartNoTreadLines()
	 */
	@Override
	public String getChartNoTreadLines()
	{
		return parent.getChartNoTreadLines();
	}

	/**
	 * this is ref to getSwitchingCharts
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getSwitchingCharts()
	 */
	@Override
	public String getSwitchingCharts()
	{
		return parent.getSwitchingCharts();
	}

	/**
	 * this is ref to getBorderInd
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getBorderInd()
	 */
	@Override
	public String getBorderInd()
	{
		return parent.getBorderInd();
	}

	/**
	 * this is used to get LogoUrl
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ViewDefinition#getLogoUrl()
	 */
	@Override
	public String getLogoUrl()
	{
		return parent.getLogoUrl();
	}

	/**
	 * this ref to getBundleKey()
	 * 
	 * @return the bundleKey
	 */
	@Override
	public String getBundleKey()
	{
		return parent.getBundleKey();
	}

	/**
	 * Helper method to convert the list of columns into read only wrapp
	 * 
	 * @param allColumns
	 * @return
	 */
	private ArrayList<ColumnDefinition> wrapColumns(ArrayList allColumns)
	{
		ArrayList<ColumnDefinition> result = new ArrayList<ColumnDefinition>();
		for (Object aColumn : allColumns)
		{
			result.add(new ColumnDefinitionWrapper((ColumnDefinition) aColumn));
		}
		return result;
	}
}
