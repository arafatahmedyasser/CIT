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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is for view definition implements serializable and cloneable interfaces
 * 
 * @version 1.0
 */
public class ViewDefinition implements Serializable, Cloneable
{
	/**
	 * Internal constant for serialization purposes
	 */

	/**
	 * Convert individual params to HashMap Call method on each column definition to convert it into Hashmaps Convert
	 * individual params to HashMap Convert Filters to HashMap Convert Sort criteria to HashMap HashMap VDF: NAME_KEY:
	 * VIEW_ID PARENT_VIEW_ID //View doesnt need this so dont put it in Hashmap: instructionClassName, sqlParamMapID
	 * RECORDS_PER_PAGE USER_NO GCIF PRODUCT SUB_PRODUCT DEFAULT_VIEW_IND OVERRIDDEN_VIEW_IND SYSTEM_VIEW_ID COLUMNS: [
	 * COLUMN_ID COLUMN_DISPLAY_NAME_KEY POSITION POSITION_FIXED_IND MANDATORY_IND VISIBLE_IND SORT_POSITION SORT_ORDER
	 * SORTABLE_IND DATA_TYPE //View doesnt need this so dont put it in Hashmap: filterRequired ] FILTERS: [
	 * FLD_COLUMN_ID FILTER_ID FILTER_TYPE FLD_DATA_TYPE FILTER_VALUES: #VALUES# ]
	 */

	/**
	 * Create a clone of this object. Here we ensure that we do a full deep clone of all attributes of a view
	 * definition.
	 * 
	 * @return A clone of this current object
	 * @exception Thrown if this class cannot be cloned. Since this class implements Cloneable, this should never occur.
	 */
	public Object clone() throws CloneNotSupportedException
	{
		ViewDefinition clonedVDF = (ViewDefinition) super.clone();
		// In the object, the following are collections for which we need to do a deep clone. So create the same
		// accordingly.
		// listColumns, viewPreferences. mapColumns need not be copied as when the list columns is set, it
		// will take care of recreating this map. Similarly listFilters needs not be copied as the same is initialized
		// from the ColumnDefinition

		// Step 1: handle column Definition list - listColumns
		ArrayList clonedList = null;
		if (clonedVDF.getListColumns() != null)
		{
			clonedList = new ArrayList();
			// Ensure that each filter in the list is also cloned.
			Iterator<ColumnDefinition> colsIterator = clonedVDF.getListColumns().iterator();
			while (colsIterator.hasNext())
				clonedList.add(colsIterator.next().intern().clone());
			// Set the cloned list back into this column Definition.
			clonedVDF.setListColumns(clonedList);
		}
		// Step 2: Handle the view preferences
		if (clonedVDF.getViewPreferences() != null)
		{
			clonedVDF.setViewPreferences((ViewDefinitionPreferences) clonedVDF.getViewPreferences().clone());
		}
		return clonedVDF;
	}

	/**
	 * Create a map of ViewDefinition
	 * 
	 * @return map of ViewDefinition
	 */

	public HashMap getViewDefinitionAsMap()
	{

		HashMap vdf = new HashMap();

		vdf.put(ViewDefinitionConstants.FLD_VIEW_ID, viewId);
		vdf.put(ViewDefinitionConstants.FLD_VIEW_NAME, viewName);
		vdf.put(ViewDefinitionConstants.FLD_PARENT_VIEW_ID, parentViewId);
		vdf.put(ViewDefinitionConstants.FLD_RECORDS_PER_PAGE, "" + recordsPerPage);
		vdf.put(ViewDefinitionConstants.FLD_OD_USER_NO, userNumber);
		vdf.put(ViewDefinitionConstants.FLD_OD_GCIF, GCIF);
		vdf.put(ViewDefinitionConstants.FLD_PRODUCT_CODE, product);
		vdf.put(ViewDefinitionConstants.FLD_SUB_PRODUCT_CODE, subProduct);

		vdf.put(ViewDefinitionConstants.FLD_FUNCTION, functionCode);

		vdf.put(ViewDefinitionConstants.FLD_DEFAULT, strDefaultView);
		vdf.put(ViewDefinitionConstants.FLD_SYSTEM_VIEW_ID, systemViewID);
		vdf.put(ViewDefinitionConstants.FLD_OVERRIDDEN_VIEW_IND, (overriddenView ? ViewDefinitionConstants.VAL_BOOL_YES
				: ViewDefinitionConstants.VAL_BOOL_NO));
		// Pass the flag to indicate whether filter is enabled for this view.
		vdf.put(ViewDefinitionConstants.FLD_FILTER_ENABLED, getStrFilterEnabled());
		// Pass the flag to indicate whether column reordering is enabled for this view.
		vdf.put(ViewDefinitionConstants.FLD_COLUMN_ORDERING_ENABLED, getStrColumnOrderingEnabled());
		// Pass the Widget Id for the View.
		vdf.put(ViewDefinitionConstants.FLD_WIDGET_ID, getWidgetId());
		// Pass the flag to indicate whether grouping is enabled for this view.
		vdf.put(ViewDefinitionConstants.FLD_GROUPED_IND, getStrGroupingEnabled());
		vdf.put(ViewDefinitionConstants.FLD_VIEW_TYPE, getViewType());
		vdf.put(ViewDefinitionConstants.FLD_START_UP_MODE, getStartUpMode());
		vdf.put(ViewDefinitionConstants.FLD_CHART_TYPE, getChartType());

		vdf.put(ViewDefinitionConstants.FLD_DATA_SRC_ID, getDataSrcId());
		vdf.put(ViewDefinitionConstants.FLD_AUTOLOAD_IND, getGetAutoLoadInd());

		vdf.put(ViewDefinitionConstants.FLD_INIT_COLLAPSED, getInitCollapsed());

		// The Flag to say whether to display the total count information below the listview panel
		vdf.put(ViewDefinitionConstants.FLD_TOTAL_RESULT_IND, getTotalResultInd());

		vdf.put(ViewDefinitionConstants.FLD_DETAIL_ACTION_IND, getDetailActionInd());
		vdf.put(ViewDefinitionConstants.FLD_CONTEXT_ACTION_IND, getContextActionInd());
		// The Flag to say whether to display the context column for live/paging/grouping grid
		vdf.put(ViewDefinitionConstants.FLD_CONTEXT_COLUMN, getContextColumn());
		vdf.put(ViewDefinitionConstants.FLD_EQCCY_EXIST_IND, getEqCCyColumnExistsInd());
		vdf.put(ViewDefinitionConstants.FLD_HIGHLIGHT_IND, getHighlightInd());
		vdf.put(ViewDefinitionConstants.FLD_SELECTION_TYPE, getSelectionType());
		// Get the set of tools that are available for this view definition.
		if (getAllTools() != null)
			vdf.put(ViewDefinitionConstants.FLD_TOOLS_LIST, getAllTools());
		// adding bbar buttons map to the view definition, if applicable
		// Custom tools in VDF.
		if (getCustomTools() != null)
		{
			vdf.put(ViewDefinitionConstants.FLD_CUSTOM_TOOLS_LIST, getCustomTools());
		}

		if (null != getBbarButtonsMap())
		{
			vdf.put(ViewDefinitionConstants.FLD_BBAR_BUTTONS, getBbarButtonsMap());
		}

		if (null != getTbarButtonsMap())
		{
			vdf.put(ViewDefinitionConstants.FLD_TBAR_BUTTONS, getTbarButtonsMap());
		}

		ArrayList columns = new ArrayList();
		Collections.sort(listColumns, new ColumnPositionComparator());
		for (int i = 0; i < listColumns.size(); ++i)
			columns.add(((ColumnDefinition) listColumns.get(i)).getColumnDefinitionAsMap());
		vdf.put(ViewDefinitionConstants.FLD_COLUMN_LIST, columns);

		ArrayList filters = null;
		HashMap filter = null;
		ArrayList listFilters = getListFilters();
		if (listFilters != null)
		{
			filters = new ArrayList();
			for (int i = 0; i < listFilters.size(); ++i)
			{
				filter = ((ColumnFilter) listFilters.get(i)).getColumnFilterAsMap();
				filters.add(filter);
			}
			vdf.put(ViewDefinitionConstants.FLD_FILTERS, filters);
		} else
			vdf.put(ViewDefinitionConstants.FLD_FILTERS, ViewDefinitionConstants.NO_FILTER);

		vdf.put(ViewDefinitionConstants.FLD_POSSIBLE_DATE_FILTERS, getPossibleDateFilters());
		vdf.put(ViewDefinitionConstants.FLD_DATE_FILTERS_RANGE, getDateFilterRange());

		vdf.put(ViewDefinitionConstants.FLD_GLOBAL_DATE_FILTER_IND, getGlobalDateFitlerInd());

		vdf.put(ViewDefinitionConstants.FLD_GROUP_HEADER_REQD, getGroupingHeaderReqd());
		vdf.put(ViewDefinitionConstants.FLD_IS_DATA_CACHED, getIsDataCached());

		vdf.put(ViewDefinitionConstants.FLD_CHART_Y_MIN, getChartYAxisMin());
		vdf.put(ViewDefinitionConstants.FLD_CHART_Y_MAX, getChartYAxisMax());
		vdf.put(ViewDefinitionConstants.FLD_CHART_NO_TREAD_LINES, getChartNoTreadLines());

		vdf.put(ViewDefinitionConstants.FLD_GROUPABLE_COLUMNS, getAllGroupableColumns());
		vdf.put(ViewDefinitionConstants.FLD_IS_GROUP_MODIFIABLE, getIsGroupModifiable());
		vdf.put(ViewDefinitionConstants.FLD_INIT_GROUP_STAGE, getInitGroupStage());
		vdf.put(ViewDefinitionConstants.FLD_IS_SUMMARY_REQUIRED, getIsSummaryReqd());
		vdf.put(ViewDefinitionConstants.FLD_GROUPING_COLUMNS, getGroupingColumns());

		vdf.put(ViewDefinitionConstants.FLD_DETAIL_MSG_IND, getDetailMsgInd());
		vdf.put(ViewDefinitionConstants.FLD_DETAIL_MSG_LBL, getDetailMsgLbl());

		vdf.put(ViewDefinitionConstants.FLD_LOGO_URL, getLogoUrl());
		vdf.put(ViewDefinitionConstants.FLD_LOGO_PROPERTY, getLogoProperty());
		vdf.put(ViewDefinitionConstants.FLD_BORDER_IND, getBorderInd());
		vdf.put(ViewDefinitionConstants.FLD_SWITCHING_CHARTS, getSwitchingCharts());
		vdf.put(ViewDefinitionConstants.FLD_RESPONSIVE_TEMPLATE, getResponsiveTemplate());
		vdf.put(ViewDefinitionConstants.FLD_BUNDLE_KEY, getBundleKey());

		// Add the view definition preferences to the view details.
		vdf.put(ViewDefinitionConstants.FLD_INITIAL_RECORDS_COUNT, getIninitailNumberOfRecords());
		ViewDefinitionPreferences prefs = getViewPreferences();
		if (prefs == null)
		{
			// Send the default preference configuration which says that there are no preferences required for this
			// view.
			prefs = new ViewDefinitionPreferences();
		}
		ArrayList prefsList = new ArrayList();
		prefsList.add(prefs.getPreferenceAsMap());
		vdf.put(ViewDefinitionConstants.FLD_PREFERENCES, prefsList);
		vdf.put(ViewDefinitionConstants.FLD_DATA_CACHE_SCOPE, getDataCacheScope());
		vdf.put(ViewDefinitionConstants.TEMPLATE_ID, getTemplateId());
		vdf.put(ViewDefinitionConstants.TEMPLATE_CONFIG, getTemplateConfig());

		return vdf;
	}

	/**
	 * default constructor
	 * 
	 */

	public ViewDefinition()
	{
	}

	/**
	 * To get SelectionType
	 * 
	 * @return SelectionType
	 */
	public String getSelectionType()
	{
		return selectionType;
	}

	/**
	 * To set SelectionType
	 * 
	 * @param SelectionType
	 */

	public void setSelectionType(String selectionType)
	{
		this.selectionType = selectionType;
	}

	/**
	 * To get EqCCyColumnExistsInd
	 * 
	 * @return EqCCyColumnExistsInd
	 */
	private String getEqCCyColumnExistsInd()
	{
		if (null != listColumns)
		{
			ColumnDefinition column = null;
			for (Object colObj : listColumns)
			{
				if (null != colObj)
				{
					column = (ColumnDefinition) colObj;
					if (column.getDataType().equals(ViewDefinitionConstants.DATA_TYPE_NUMBER_EQ_AMT))
					{
						return "Y";
					}
				}
			}
		}
		return "N";
	}

	/**
	 * To get BbarButtonsMap
	 * 
	 * @return bbarButtonsMap
	 */
	public Map getBbarButtonsMap()
	{
		return bbarButtonsMap;
	}

	/**
	 * To set BbarButtonsMap
	 * 
	 * @param bbarButtonsMap the buttonMap to set
	 */
	public void setBbarButtonsMap(Map bbarButtonsMap)
	{
		this.bbarButtonsMap = bbarButtonsMap;
	}

	/**
	 * To get TbarButtonsMap
	 * 
	 * @return tbarButtonsMap
	 */
	public Map getTbarButtonsMap()
	{
		return tbarButtonsMap;
	}

	/**
	 * To set TbarButtonsMap
	 * 
	 * @param tbarButtonsMap the buttonMap to set
	 */
	public void setTbarButtonsMap(Map tbarButtonsMap)
	{
		this.tbarButtonsMap = tbarButtonsMap;
	}

	/**
	 * To get DataSrcId
	 * 
	 * @return the dataSrcId
	 */
	public String getDataSrcId()
	{
		return dataSrcId;
	}

	/**
	 * To set DataSrcId
	 * 
	 * @param dataSrcId the dataSrcId to set
	 */
	public void setDataSrcId(String dataSrcId)
	{
		this.dataSrcId = dataSrcId;
	}

	/**
	 * To get AutoLoad
	 * 
	 * @return the autoLoad
	 */
	public String getGetAutoLoadInd()
	{
		return autoLoadInd;
	}

	/**
	 * To set AutoLoad
	 * 
	 * @param AutoLoadInd the AutoLoadInd to set
	 */
	public void setGetAutoLoadInd(String autoLoad)
	{
		this.autoLoadInd = autoLoad;
	}

	/**
	 * To get chartType
	 * 
	 * @return the chartType
	 */
	public String getChartType()
	{
		return chartType;
	}

	/**
	 * To set chartType
	 * 
	 * @param chartType the chartType to set
	 */
	public void setChartType(String chartType)
	{
		this.chartType = chartType;
	}

	/**
	 * To get StartUpMode
	 * 
	 * @return the startUpMode
	 */
	public String getStartUpMode()
	{
		return startUpMode;
	}

	/**
	 * To set StartUpMode
	 * 
	 * @param startUpMode the startUpMode to set
	 */
	public void setStartUpMode(String startUpMode)
	{
		this.startUpMode = startUpMode;
	}

	/**
	 * To get ViewType
	 * 
	 * @return the viewType
	 */
	public String getViewType()
	{
		return viewType;
	}

	/**
	 * To set ViewType
	 * 
	 * @param viewType the viewType to set
	 */
	public void setViewType(String viewType)
	{
		this.viewType = viewType;
	}

	/**
	 * To get ViewName
	 * 
	 * @return the ViewName
	 */

	public String getViewName()
	{
		return viewName;
	}

	/**
	 * To set ViewName
	 * 
	 * @param ViewName the ViewName to set
	 */

	public void setViewName(String viewName)
	{
		this.viewName = viewName;
	}

	/**
	 * To get ViewId
	 * 
	 * @return the ViewId
	 */

	public String getViewId()
	{
		return viewId;
	}

	/**
	 * To set ViewId
	 * 
	 * @param ViewId the ViewId to set
	 */

	public void setViewId(String viewId)
	{
		this.viewId = viewId;
	}

	/**
	 * To get ParentViewId
	 * 
	 * @return the ParentViewId
	 */

	public String getParentViewId()
	{
		return parentViewId;
	}

	/**
	 * To set ParentViewId
	 * 
	 * @param ParentViewId to set
	 */

	public void setParentViewId(String parentViewId)
	{
		this.parentViewId = parentViewId;
	}

	/**
	 * To get InstructionClassName
	 * 
	 * @return the InstructionClassName
	 */

	public String getInstructionClassName()
	{
		return instructionClassName;
	}

	/**
	 * To set InstructionClassName
	 * 
	 * @param InstructionClassName to set
	 */

	public void setInstructionClassName(String instructionClassName)
	{
		this.instructionClassName = instructionClassName;
	}

	/**
	 * To get RecordsPerPage
	 * 
	 * @return the RecordsPerPage
	 */

	public int getRecordsPerPage()
	{
		return recordsPerPage;
	}

	/**
	 * To set RecordsPerPage
	 * 
	 * @param RecordsPerPage to set
	 */

	public void setRecordsPerPage(int recordsPerPage)
	{
		this.recordsPerPage = recordsPerPage;
		strRecordsPerPage = String.valueOf(recordsPerPage);
	}

	/**
	 * To get UserNumber
	 * 
	 * @return the UserNumber
	 */

	public String getUserNumber()
	{
		return userNumber;
	}

	/**
	 * To set UserNumber
	 * 
	 * @param UserNumber to set
	 */

	public void setUserNumber(String userNumber)
	{
		this.userNumber = userNumber;
	}

	/**
	 * To get GCIF
	 * 
	 * @return the GCIF
	 */

	public String getGCIF()
	{
		return GCIF;
	}

	/**
	 * To set GCIF
	 * 
	 * @param GCIF to set
	 */

	public void setGCIF(String gcif)
	{
		GCIF = gcif;
	}

	/**
	 * To get Product
	 * 
	 * @return the Product
	 */

	public String getProduct()
	{
		return product;
	}

	/**
	 * To set Product
	 * 
	 * @param Product to set
	 */

	public void setProduct(String product)
	{
		this.product = product;
	}

	/**
	 * To get SubProduct
	 * 
	 * @return the SubProduct
	 */

	public String getSubProduct()
	{
		return subProduct;
	}

	/**
	 * To set SubProduct
	 * 
	 * @param SubProduct to set
	 */

	public void setSubProduct(String subProduct)
	{
		this.subProduct = subProduct;
	}

	/**
	 * To set HighlightInd
	 * 
	 * @param HighlightInd to set
	 */
	public void setHighlightInd(String highlightInd)
	{
		this.highlightInd = highlightInd;
	}

	/**
	 * To get HighlightInd
	 * 
	 * @return the HighlightInd
	 */

	public String getHighlightInd()
	{
		return highlightInd;
	}

	/**
	 * To get DefaultView
	 * 
	 * @return the DefaultView
	 */
	public boolean isDefaultView()
	{
		return defaultView;
	}

	/**
	 * To set DefaultView
	 * 
	 * @param DefaultView to set
	 */

	public void setDefaultView(boolean defaultView)
	{
		this.defaultView = defaultView;
		if (defaultView)
		{
			strDefaultView = "Y";
		} else
		{
			strDefaultView = "N";
		}
	}

	/**
	 * To get ListColumns
	 * 
	 * @return the ListColumns
	 */

	public ArrayList getListColumns()
	{
		return listColumns;
	}

	/**
	 * To set ListColumns
	 * 
	 * @param ListColumns to set
	 */

	public void setListColumns(ArrayList listColumns)
	{
		this.listColumns = listColumns;
		if (listColumns != null && !listColumns.isEmpty())
		{
			mapColumns = new LinkedHashMap();
			for (int i = 0; i < listColumns.size(); i++)
			{
				ColumnDefinition colDefinition = (ColumnDefinition) listColumns.get(i);
				mapColumns.put(colDefinition.getColumnId(), colDefinition);
			}
		}
	}

	/**
	 * To get StrRecordsPerPage
	 * 
	 * @return the StrRecordsPerPage
	 */

	public String getStrRecordsPerPage()
	{
		return strRecordsPerPage;
	}

	/**
	 * To set StrRecordsPerPage
	 * 
	 * @param StrRecordsPerPage
	 */
	public void setStrRecordsPerPage(String strRecordsPerPage)
	{
		String PageSize = "";
		this.strRecordsPerPage = strRecordsPerPage;
		if (strRecordsPerPage != null && !"".equals(strRecordsPerPage) && !"null".equals(strRecordsPerPage))
		{
			recordsPerPage = Integer.parseInt(strRecordsPerPage);
		}
		else
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			PageSize = configMgr.getCompPrefDescriptor().getListViewPageSize();
			this.strRecordsPerPage = PageSize;
			recordsPerPage = Integer.parseInt(this.strRecordsPerPage);
		}
	}

	/**
	 * To get StrDefaultView
	 * 
	 * @return the StrDefaultView
	 */
	public String getStrDefaultView()
	{
		return strDefaultView;
	}

	/**
	 * To set StrDefaultView
	 * 
	 * @param StrDefaultView to set
	 */

	public void setStrDefaultView(String strDefaultView)
	{
		this.strDefaultView = strDefaultView;
		if (ViewDefinitionConstants.VAL_BOOL_YES.equals(strDefaultView))
			defaultView = true;
		else
			defaultView = false;
	}

	/**
	 * To get SqlParamMapID
	 * 
	 * @return the SqlParamMapID
	 */

	public String getSqlParamMapID()
	{
		return sqlParamMapID;
	}

	/**
	 * To set SqlParamMapID
	 * 
	 * @param SqlParamMapID to set
	 */

	public void setSqlParamMapID(String sqlParamMapID)
	{
		this.sqlParamMapID = sqlParamMapID;
	}

	/**
	 * To get OverriddenView
	 * 
	 * @return the OverriddenView
	 */

	public boolean isOverriddenView()
	{
		return overriddenView;
	}

	/**
	 * To set OverriddenView
	 * 
	 * @param OverriddenView to set
	 */

	public void setOverriddenView(boolean overriddenView)
	{
		this.overriddenView = overriddenView;
		if (overriddenView)
		{
			strOverriddenView = ViewDefinitionConstants.VAL_BOOL_YES;
		} else
		{
			strOverriddenView = ViewDefinitionConstants.VAL_BOOL_NO;
		}
	}

	/**
	 * To get StrOverriddenView
	 * 
	 * @return StrOverriddenView
	 */

	public String getStrOverriddenView()
	{
		return strOverriddenView;
	}

	/**
	 * To set StrOverriddenView
	 * 
	 * @param StrOverriddenView to set
	 */

	public void setStrOverriddenView(String strOverriddenView)
	{
		this.strOverriddenView = strOverriddenView;
		if (ViewDefinitionConstants.VAL_BOOL_YES.equals(strOverriddenView))
			overriddenView = true;
		else
			overriddenView = false;
	}

	/**
	 * Returns true if Grouping is enabled for this view
	 * 
	 * @return true if grouping is enabled. false otherwise
	 */
	public boolean isGroupingEnabled()
	{
		return ViewDefinitionConstants.VAL_BOOL_YES.equals(getStrGroupingEnabled());
	}

	/**
	 * To get StrGroupingEnabled
	 * 
	 * @return the strGroupingEnabled
	 */
	public String getStrGroupingEnabled()
	{
		return strGroupingEnabled;
	}

	/**
	 * To set strGroupingEnabled
	 * 
	 * @param strGroupingEnabled the strGroupingEnabled to set
	 */
	public void setStrGroupingEnabled(String strGroupingEnabled)
	{
		this.strGroupingEnabled = strGroupingEnabled;
	}

	/**
	 * To get SystemViewID
	 * 
	 * @return the SystemViewID
	 */

	public String getSystemViewID()
	{
		return systemViewID;
	}

	/**
	 * To set SystemViewID
	 * 
	 * @param SystemViewID the SystemViewID to set
	 */

	public void setSystemViewID(String systemViewID)
	{
		this.systemViewID = systemViewID;
	}

	/**
	 * To get isFilterEnabled
	 * 
	 * @return true if filter is enabled for this view.
	 */
	public boolean isFilterEnabled()
	{
		return ViewDefinitionConstants.VAL_BOOL_YES.equals(strFilterEnabled);
	}

	/**
	 * To get the StrFilterEnabled
	 * 
	 * @return the strFilterEnabled
	 */
	public String getStrFilterEnabled()
	{
		return strFilterEnabled;
	}

	/**
	 * To set StrFilterEnabled
	 * 
	 * @param filterEnabled the strFilterEnabled to set
	 */
	public void setStrFilterEnabled(String filterEnabled)
	{
		strFilterEnabled = filterEnabled;
	}

	/**
	 * To check whether ColumnOrdering is enabled
	 * 
	 * @return true if column ordering is enabled for this view.
	 */
	public boolean isColumnOrderingEnabled()
	{
		return ViewDefinitionConstants.VAL_BOOL_YES.equals(strColumnOrderingEnabled);
	}

	/**
	 * To get StrColumnOrderingEnabled
	 * 
	 * @return the strColumnOrderingEnabled
	 */
	public String getStrColumnOrderingEnabled()
	{
		return strColumnOrderingEnabled;
	}

	/**
	 * To set StrColumnOrderingEnabled
	 * 
	 * @param columnOrderingEnabled the strColumnOrderingEnabled to set
	 */
	public void setStrColumnOrderingEnabled(String columnOrderingEnabled)
	{
		strColumnOrderingEnabled = columnOrderingEnabled;
	}

	/**
	 * To get WidgetId
	 * 
	 * @return the WidgetId
	 */
	public String getWidgetId()
	{
		return mWidgetId;
	}

	/**
	 * To set WidgetId
	 * 
	 * @param widgetId the WidgetId to set
	 */
	public void setWidgetId(String widgetId)
	{
		mWidgetId = widgetId;
	}

	/**
	 * To get AllTools
	 * 
	 * @return the allTools
	 */
	public String getAllTools()
	{
		return allTools;
	}

	/**
	 * To set allTools
	 * 
	 * @param allTools the allTools to set
	 */
	public void setAllTools(String allTools)
	{
		this.allTools = allTools;
	}

	/**
	 * To get ViewPreferences
	 * 
	 * @return the viewPreferences
	 */
	public ViewDefinitionPreferences getViewPreferences()
	{
		return viewPreferences;
	}

	/**
	 * To set ViewPreferences
	 * 
	 * @param viewPreferences the viewPreferences to set
	 */
	public void setViewPreferences(ViewDefinitionPreferences viewPreferences)
	{
		this.viewPreferences = viewPreferences;
	}

	/**
	 * To get PageSize
	 * 
	 * @return the PageSize
	 */

	public String getPageSize()
	{
		return pageSize;
	}

	/**
	 * To set PageSize
	 * 
	 * @param PageSize the PageSize to set
	 */

	public void setPageSize(String pageSize)
	{
		this.pageSize = pageSize;
	}

	/**
	 * To get InitCollapsed
	 * 
	 * @return the InitCollapsed
	 */

	public String getInitCollapsed()
	{
		return initCollapsed;
	}

	/**
	 * To set InitCollapsed
	 * 
	 * @param InitCollapsed the InitCollapsed to set
	 */

	public void setInitCollapsed(String initCollapsed)
	{
		this.initCollapsed = initCollapsed;
	}

	/**
	 * To get DetailActionInd
	 * 
	 * @return the DetailActionInd
	 */
	public String getDetailActionInd()
	{
		return detailActionInd;
	}

	/**
	 * To set DetailActionInd
	 * 
	 * @param DetailActionInd the DetailActionInd to set
	 */

	public void setDetailActionInd(String detailActionInd)
	{
		this.detailActionInd = detailActionInd;
	}

	/**
	 * To get ContextActionInd
	 * 
	 * @return the ContextActionInd
	 */

	public String getContextActionInd()
	{
		return contextActionInd;
	}

	/**
	 * To set ContextActionInd
	 * 
	 * @param ContextActionInd the ContextActionInd to set
	 */

	public void setContextActionInd(String contextActionInd)
	{
		this.contextActionInd = contextActionInd;
	}

	/**
	 * To get ContextColumn
	 * 
	 * @return the contextColumn
	 */
	public String getContextColumn()
	{
		return contextColumn;
	}

	/**
	 * To set ContextColumn
	 * 
	 * @param contextColumn the contextColumn to set
	 */
	public void setContextColumn(String contextColumn)
	{
		this.contextColumn = contextColumn;
	}

	/**
	 * To get TotalResultInd
	 * 
	 * @return totalResultInd
	 */
	public String getTotalResultInd()
	{
		return totalResultInd;
	}

	/**
	 * To set TotalResultInd
	 * 
	 * @param totalResultInd
	 */
	public void setTotalResultInd(String totalResultInd)
	{
		this.totalResultInd = totalResultInd;
	}

	/**
	 * Helper method that returns a String Array, where each element is the column name
	 * 
	 * @return String[] of ColumnNames
	 */
	public String[] getColumnNames()
	{
		String[] sColumnNames = null;
		if (listColumns != null && !listColumns.isEmpty())
		{
			sColumnNames = new String[listColumns.size()];
			for (int i = 0; i < listColumns.size(); i++)
			{
				ColumnDefinition colDefinition = (ColumnDefinition) listColumns.get(i);
				sColumnNames[i] = colDefinition.getColumnDisplayNameKey();
			}
		}
		return sColumnNames;
	}

	/**
	 * Helper method which gives the column definition for the given columnKey
	 * 
	 * @param sColumnNameKey
	 * @return ColumnDefinition
	 */
	public ColumnDefinition getColumnDefnForColumn(String sColumnId)
	{
		return (mapColumns != null) ? (ColumnDefinition) mapColumns.get(sColumnId) : null;
	}

	/**
	 * Helper method which gives the list of sort definitions ordered according to their position
	 * 
	 * @return list of sort definitions
	 */
	public ArrayList getOrderedSortDefinition()
	{
		ArrayList listSortDefinitions = new ArrayList();
		for (int i = 0; i < listColumns.size(); i++)
		{
			ColumnDefinition columnDefinition = (ColumnDefinition) listColumns.get(i);
			if (columnDefinition.isSortRequired())
			{
				SortDefinition sortDefinition = new SortDefinition();
				sortDefinition.setColumnID(columnDefinition.getColumnId());
				sortDefinition.setSortOrder(columnDefinition.getSortOrder());
				sortDefinition.setSortPosition(columnDefinition.getSortPosition());
				sortDefinition.setActualColumnID(columnDefinition.getColumnId());
				listSortDefinitions.add(sortDefinition);
			}
		}
		logger.ctdebug("CTVDF00397", listSortDefinitions);
		Collections.sort(listSortDefinitions, new SortPositionComparator());
		logger.ctdebug("CTVDF00398", listSortDefinitions);
		return listSortDefinitions;
	}

	/**
	 * This method returns the list of all columns that have been selected by the user for grouping data in this view.
	 * 
	 * @return The grouped columns list.
	 */
	public ArrayList<ColumnDefinition> getOrderedGroupColumns()
	{
		ArrayList<ColumnDefinition> groupedColumns = new ArrayList<ColumnDefinition>();
		Iterator<ColumnDefinition> listIterator = listColumns.iterator();
		ColumnDefinition aColumn;
		while (listIterator.hasNext())
		{
			aColumn = listIterator.next();
			if (aColumn.isGrouped())
				groupedColumns.add(aColumn);
		}
		Collections.sort(groupedColumns, new ColumnGroupComparator());

		return groupedColumns;
	}

	/**
	 * The method brings the information about the grouping columns of that view.
	 * 
	 * @return The grouped columns list.
	 */
	public ArrayList<String> getGroupingColumns()
	{
		ArrayList<String> groupedColumns = new ArrayList<String>();
		Iterator<ColumnDefinition> listIterator = listColumns.iterator();
		ColumnDefinition aColumn;
		while (listIterator.hasNext())
		{
			aColumn = listIterator.next();
			if (aColumn.isGrouped())
				groupedColumns.add(aColumn.getColumnId());
		}
		return groupedColumns;
	}

	/**
	 * This method returns the list of all columns that can be used for grouping
	 * 
	 * @return The groupable columns list
	 */
	public ArrayList<Map> getAllGroupableColumns()
	{
		ArrayList<Map> groupableColumns = new ArrayList<Map>();
		Iterator<ColumnDefinition> listIterator = listColumns.iterator();
		ColumnDefinition aColumn;
		Map column = null;
		while (listIterator.hasNext())
		{
			aColumn = listIterator.next();
			if (aColumn.isGroupable())
			{
				column = new HashMap();
				column.put(ViewDefinitionConstants.COLUMN_ID, aColumn.getColumnId());
				column.put(ViewDefinitionConstants.FLD_COLUMN_DISPLAY_NAME_KEY, aColumn.getColumnDisplayNameKey());
				groupableColumns.add(column);
			}
		}

		return groupableColumns;
	}

	/**
	 * The method brings the information about the grouping columns as grouping model
	 * 
	 * @return GroupingModel
	 */
	public GroupingModel getGroupingModel()
	{
		GroupingModel groupingModel = new GroupingModel();
		groupingModel.setGroupedColumn(getOrderedGroupColumns());
		SummaryDefinition summaryDefinition = new SummaryDefinition();

		ArrayList<SummaryDefinition> summaryDefinitions = new ArrayList<SummaryDefinition>();
		for (int i = 0; i < listColumns.size(); i++)
		{
			ColumnDefinition columnDefinition = (ColumnDefinition) listColumns.get(i);

			if (columnDefinition.getSummaryType() != null && !"".equals(columnDefinition.getSummaryType()))
			{

				summaryDefinition = new SummaryDefinition();

				summaryDefinition.setColumnDatatype(columnDefinition.getDataType());
				summaryDefinition.setColumnID(columnDefinition.getColumnId());
				summaryDefinition.setSummarytype(columnDefinition.getSummaryType());
				summaryDefinitions.add(summaryDefinition);

			}
		}

		groupingModel.setSummaryDefinition(summaryDefinitions);

		return groupingModel;
	}

	/**
	 * This method returns the list of all columns that the user has selected as visible in the view
	 * 
	 * @return The nonHidden columns list
	 */
	public ArrayList<ColumnDefinition> getAllNonHiddenColumns()
	{
		ArrayList<ColumnDefinition> nonHiddenColumns = new ArrayList<ColumnDefinition>();
		Iterator<ColumnDefinition> listIterator = listColumns.iterator();
		ColumnDefinition aColumn;
		while (listIterator.hasNext())
		{
			aColumn = listIterator.next();
			if (!aColumn.isHidden())
				nonHiddenColumns.add(aColumn);
		}

		// Sort the columns by the column position comparator
		Collections.sort(nonHiddenColumns, new ColumnPositionComparator());

		return nonHiddenColumns;
	}

	/**
	 * This method returns the list of all columns that the user has selected as visible in the view
	 * 
	 * @return The visible columns list
	 */
	public ArrayList<ColumnDefinition> getAllVisibleColumns()
	{
		ArrayList<ColumnDefinition> visibleColumns = new ArrayList<ColumnDefinition>();
		Iterator<ColumnDefinition> listIterator = listColumns.iterator();
		ColumnDefinition aColumn;
		while (listIterator.hasNext())
		{
			aColumn = listIterator.next();
			if (aColumn.isVisible())
				visibleColumns.add(aColumn);
		}

		// Sort the columns by the column position comparator
		Collections.sort(visibleColumns, new ColumnPositionComparator());

		return visibleColumns;
	}

	/**
	 * This method returns the list of all columns that are marked as searchable
	 * 
	 * @return The searchable columns list
	 */
	public ArrayList<ColumnDefinition> getAllSearchableColumns()
	{
		ArrayList<ColumnDefinition> searchableColumns = new ArrayList<ColumnDefinition>();
		Iterator<ColumnDefinition> listIterator = listColumns.iterator();
		ColumnDefinition aColumn;
		while (listIterator.hasNext())
		{
			aColumn = listIterator.next();
			if (aColumn.isSearchAllowed())
				searchableColumns.add(aColumn);
		}

		// Sort the columns by the search order position comparator
		Collections.sort(searchableColumns, new SearchOrderPositionComparator());

		return searchableColumns;
	}

	/**
	 * Helper method which returns the list of filters applicable for all the columns in this view Returns an empty
	 * ArrayList if there are no filters for any columns in the view
	 * 
	 * @return ArrayList of filters
	 */
	public ArrayList getListFilters()
	{
		ColumnDefinition columnDefinition = null;
		ArrayList listColumnFilters = null;
		ColumnFilter columnFilter = null;
		ArrayList listFilters = new ArrayList();
		for (int i = 0; i < listColumns.size(); i++)
		{
			columnDefinition = (ColumnDefinition) listColumns.get(i);
			listColumnFilters = columnDefinition.getListFilters();
			if (listColumnFilters != null && !listColumnFilters.isEmpty())
			{
				for (int j = 0; j < listColumnFilters.size(); j++)
				{
					columnFilter = (ColumnFilter) listColumnFilters.get(j);
					listFilters.add(columnFilter);
				}
			}
		}
		logger.ctdebug("CTVDF00399", listFilters);
		return listFilters;
	}

	/**
	 * Helper method which returns a map of all applicable columns with column Key for X-Series, Y-Series and Data
	 * Series of a chart.
	 * 
	 * @return Map of X-Series, Y-Series and Data Series columns.
	 */
	public HashMap getGraphicalViewSeriesColumns()
	{
		ArrayList<ColumnDefinition> xSeriesColumns = new ArrayList<ColumnDefinition>();
		ColumnDefinition ySeriesColumn = null;
		ColumnDefinition seriesIdentifier = null;
		Iterator<ColumnDefinition> listIterator = listColumns.iterator();
		ColumnDefinition aColumn;

		while (listIterator.hasNext())
		{
			aColumn = listIterator.next();
			if (ViewDefinitionConstants.VAL_BOOL_YES.equalsIgnoreCase(aColumn.getXSeriesInd()))
			{
				xSeriesColumns.add(aColumn);
			} else if (ViewDefinitionConstants.VAL_BOOL_YES.equalsIgnoreCase(aColumn.getYSeriesInd()))
			{
				ySeriesColumn = aColumn;
			} else if (ViewDefinitionConstants.VAL_BOOL_YES.equalsIgnoreCase(aColumn.getDataSeriedInd()))
			{
				seriesIdentifier = aColumn;
			}
		}
		HashMap graphColumnsMap = new HashMap();
		graphColumnsMap.put(ViewDefinitionConstants.FLD_X_SERIES_COLUMNS, xSeriesColumns);
		graphColumnsMap.put(ViewDefinitionConstants.FLD_Y_SERIES_COLUMN, ySeriesColumn);
		graphColumnsMap.put(ViewDefinitionConstants.FLD_DATA_SERIES_COLUMN, seriesIdentifier);

		return graphColumnsMap;
	}

	/**
	 * Helper method which returns a map of all applicable columns
	 * 
	 * @param vdf
	 * 
	 * @return Map of X-Series, Y-Series and Data Series columns.
	 */
	public HashMap getChartColumns(List listViewData, ArrayList cols)
	{
		ArrayList xSeriesColumns = new ArrayList();
		ArrayList ySeriesColumn = new ArrayList();
		ArrayList xSeriesColumnsDName = new ArrayList();
		ArrayList ySeriesColumnsDName = new ArrayList();
		ArrayList seriesIdentifier = new ArrayList(), dataSeriesColumnsDName = new ArrayList();
		Iterator<ColumnDefinition> listIterator = cols.iterator();
		ColumnDefinition aColumn;
		ArrayList linkedDataSeries = null;
		HashMap graphColumnsMap = new HashMap();
		while (listIterator.hasNext())
		{
			aColumn = listIterator.next();
			linkedDataSeries = new ArrayList();
			if (ViewDefinitionConstants.VAL_BOOL_YES.equalsIgnoreCase(aColumn.getXSeriesInd()))
			{
				xSeriesColumns.add(aColumn.getColumnId());
				xSeriesColumnsDName.add(aColumn.getColumnDisplayNameKey());
			} else if ("D".equalsIgnoreCase(aColumn.getYSeriesInd())
					|| ViewDefinitionConstants.VAL_BOOL_YES.equalsIgnoreCase(aColumn.getYSeriesInd()))
			{
				if ("D".equalsIgnoreCase(aColumn.getYSeriesInd()))
				{
					graphColumnsMap.put(ViewDefinitionConstants.DYNAMIC_YCOLS, ViewDefinitionConstants.DYNAMIC_YCOLS);
				}
				linkedDataSeries.add(aColumn.getColumnId());
				if (aColumn.getLinkedDataSeries() != null && aColumn.getLinkedDataSeries() != "")
				{
					linkedDataSeries.add(aColumn.getLinkedDataSeries());
				}
				ySeriesColumn.add(linkedDataSeries);
				ySeriesColumnsDName.add(aColumn.getColumnDisplayNameKey());
			} else if (ViewDefinitionConstants.VAL_BOOL_YES.equalsIgnoreCase(aColumn.getDataSeriedInd()))
			{
				dataSeriesColumnsDName.add(aColumn.getColumnDisplayNameKey());
				seriesIdentifier.add(aColumn.getColumnId());
			}
		}

		graphColumnsMap.put(ViewDefinitionConstants.FLD_X_SERIES_COLUMNS, xSeriesColumns);
		graphColumnsMap.put(ViewDefinitionConstants.FLD_Y_SERIES_COLUMN, ySeriesColumn);
		graphColumnsMap.put(ViewDefinitionConstants.FLD_DATA_SERIES_COLUMN, seriesIdentifier);
		graphColumnsMap.put(ViewDefinitionConstants.FLD_X_SERIES_COLUMNS_DNAME, xSeriesColumnsDName);
		graphColumnsMap.put(ViewDefinitionConstants.FLD_Y_SERIES_COLUMNS_DNAME, ySeriesColumnsDName);
		graphColumnsMap.put(ViewDefinitionConstants.FLD_DATA_SERIES_COLUMNS_DNAME, dataSeriesColumnsDName);
		return graphColumnsMap;
	}

	/**
	 * The function to check whether this view is a user defined view or predefined view
	 * 
	 * @return boolean
	 */
	public boolean isPreDefinedView()
	{
		return ((ViewDefinitionConstants.DATA_ALL_CORPORATES.equals(this.getGCIF())) && (ViewDefinitionConstants.DATA_ALL_USERS
				.equals(this.getUserNumber())));
	}

	/**
	 * This method returns whether paging is applicable for this view. This is evaluated based on the nature of view
	 * that is configured
	 * 
	 * @return true, if paging is applicable; false otherwise
	 */
	public boolean isPagingEnabledForView()
	{
		return "CHART".equals(getViewType()) || "GROUP".equals(getViewType()) || "TREE".equals(getViewType())
				|| "ORG".equals(getViewType()) || "ADS".equals(getViewType()) || "IFRAME".equals(getViewType());
	}

	/**
	 * Used to return the list of date filering range.
	 * 
	 * @return dateFilterRanges
	 */
	public ArrayList getDateFilterRange()
	{
		return dateFilterRanges;
	}

	/**
	 * Used to return the list of possible date filter's types.
	 * 
	 * @return listPossibleDateFilters
	 */
	public ArrayList getPossibleDateFilters()
	{
		return listPossibleDateFilters;
	}

	/**
	 * This new method has been introduced to get the maximum date i.e the current business date. The actuall
	 * implementation has been done in the wrapper class
	 */
	public Date getDateFilterMaxDate()
	{
		// This method is added here purely to support the ViewDefinitionWrapper handle the transient nature of this
		// field. The actual maintenance is done by the ViewDefinitionWrapper
		return null;
	}

	/**
	 * This new method has been introduced to set the date filter parameters dynamically The actuall implementation has
	 * been done in the wrapper class
	 */

	public void resetDateFilters(Date currDate)
	{
		// Nothing will be done here as this API will change the state of the view every time. Instead this will be
		// routed to the ViewDefinitionWrapper that will enable the per request based modification of the data
	}

	/**
	 * The method setDateFilters will be set the DateFilters. The manipulation of the date filter panel parameters will
	 * be done dynamically using ViewDefinitionWrapper which will be called everytime dynamically from ViewManager
	 * 
	 */
	/**
	 * Used to calculate and set the date to the params accoding to the filter types.
	 * 
	 * @param dateFilters
	 */

	public void setDateFilters(ArrayList dateFilters)
	{
		this.dateFilters = dateFilters;
	}

	/**
	 * Used to get the date filter params.
	 * 
	 * @return dateFilters
	 */
	public ArrayList getDateFilters()
	{
		return dateFilters;
	}

	/**
	 * Used to return the global date filter indicator.
	 * 
	 * @return globalDateFitlerInd
	 */
	public String getGlobalDateFitlerInd()
	{
		return globalDateFitlerInd;
	}

	/**
	 * Used to set the global date filter indicator.
	 * 
	 * @param globalDateFitlerInd
	 */
	public void setGlobalDateFitlerInd(String globalDateFitlerInd)
	{
		this.globalDateFitlerInd = globalDateFitlerInd;
	}

	/**
	 * Used to get the grouing header is required for the particular view.
	 */
	public String getGroupingHeaderReqd()
	{
		return groupingHeaderReqd;
	}

	/**
	 * Used to set the grouing header is required for the particular view.
	 * 
	 * @param groupingHeaderReqd
	 */
	public void setGroupingHeaderReqd(String groupingHeaderReqd)
	{
		this.groupingHeaderReqd = groupingHeaderReqd;

	}

	/**
	 * Used to get the function code
	 * 
	 * @return FunctionCode
	 */
	public String getFunctionCode()
	{
		return functionCode;
	}

	/**
	 * Used to set the function code
	 * 
	 * @param functionCode
	 */
	public void setFunctionCode(String functionCode)
	{
		if (!functionCode.equals(null) && !functionCode.equals(""))
			this.functionCode = functionCode;
	}

	/**
	 * Used to get the IninitailNumberOfRecords
	 * 
	 * @return IninitailNumberOfRecords
	 */
	public String getIninitailNumberOfRecords()
	{
		return initialRecordCount;
	}

	/**
	 * Used to set the IninitailNumberOfRecords
	 * 
	 * @param IninitailNumberOfRecords to set
	 */
	public void setIninitailNumberOfRecords(String initialRecordCount)
	{
		this.initialRecordCount = initialRecordCount;

	}

	/**
	 * @return the wheteher the widget has to be cached
	 */

	/**
	 * @return the wheteher the widget has to be cached
	 */
	public String getIsDataCached()
	{
		return isDataCached;
	}

	/**
	 * Used to set the isDataCached
	 * 
	 * @param isDataCached the isDataCached to set
	 */
	public void setIsDataCached(String isDataCached)
	{
		this.isDataCached = isDataCached;
	}

	/**
	 * Used to get the IsGroupModifiable
	 * 
	 * @return the IsGroupModifiable
	 */
	public String getIsGroupModifiable()
	{
		return isGroupModifiable;
	}

	/**
	 * Used to set the IsGroupModifiable
	 * 
	 * @param isGroupModifiable the isGroupModifiable to set
	 */
	public void setIsGroupModifiable(String isGroupModifiable)
	{
		this.isGroupModifiable = isGroupModifiable;
	}

	/**
	 * Used to get the InitGroupStage
	 * 
	 * @return the initGroupStage
	 */
	public String getInitGroupStage()
	{
		return initGroupStage;
	}

	/**
	 * Used to set the InitGroupStage
	 * 
	 * @param initGroupStage the initGroupStage to set
	 */
	public void setInitGroupStage(String initGroupStage)
	{
		this.initGroupStage = initGroupStage;
	}

	/**
	 * Used to get the CustomTools
	 * 
	 * @return the CustomTools
	 */

	public String getCustomTools()
	{
		return customTools;
	}

	/**
	 * Used to set the CustomTools
	 * 
	 * @param CustomTools the CustomTools to set
	 */

	public void setCustomTools(String customTools)
	{
		this.customTools = customTools;
	}

	/**
	 * Used to get the IsSummaryReqd
	 * 
	 * @return the IsSummaryReqd
	 */
	public String getIsSummaryReqd()
	{
		return isSummaryReqd;
	}

	/**
	 * Used to set the IsSummaryReqd
	 * 
	 * @param isSummaryReqd the isSummaryReqd to set
	 */
	public void setIsSummaryReqd(String isSummaryReqd)
	{
		this.isSummaryReqd = isSummaryReqd;
	}

	/**
	 * Used to get the DetailMsgInd
	 * 
	 * @return the DetailMsgInd
	 */
	public String getDetailMsgInd()
	{
		return detailMsgInd;
	}

	/**
	 * @return the chartYAxisMax
	 */
	public String getChartYAxisMax()
	{
		return chartYAxisMax;
	}

	/**
	 * @param chartYAxisMax the chartYAxisMax to set
	 */
	public void setChartYAxisMax(String chartYAxisMax)
	{
		this.chartYAxisMax = chartYAxisMax;
	}

	/**
	 * @return the chartYAxisMin
	 */
	public String getChartYAxisMin()
	{
		return chartYAxisMin;
	}

	/**
	 * @param chartYAxisMin the chartYAxisMin to set
	 */
	public void setChartYAxisMin(String chartYAxisMin)
	{
		this.chartYAxisMin = chartYAxisMin;
	}

	/**
	 * @return the chartNoTreadLines
	 */
	public String getChartNoTreadLines()
	{
		return chartNoTreadLines;
	}

	/**
	 * @param chartNoTreadLines the chartNoTreadLines to set
	 */
	public void setChartNoTreadLines(String chartNoTreadLines)
	{
		this.chartNoTreadLines = chartNoTreadLines;
	}

	/**
	 * @return the borderInd
	 */
	public String getBorderInd()
	{
		return borderInd;
	}

	/**
	 * @param borderInd the borderInd to set
	 */
	public void setBorderInd(String borderInd)
	{
		this.borderInd = borderInd;
	}

	/**
	 * @return the logoUrl
	 */
	public String getLogoUrl()
	{
		return logoUrl;
	}

	/**
	 * @param logoUrl the logoUrl to set
	 */
	public void setLogoUrl(String logoUrl)
	{
		this.logoUrl = logoUrl;
	}

	/**
	 * @return the logoProperty
	 */
	public String getLogoProperty()
	{
		return logoProperty;
	}

	/**
	 * @param logoProperty the logoProperty to set
	 */
	public void setLogoProperty(String logoProperty)
	{
		this.logoProperty = logoProperty;
	}

	/**
	 * @return the switchingCharts
	 */
	public String getSwitchingCharts()
	{
		return switchingCharts;
	}

	/**
	 * @param switchingCharts the switchingCharts to set
	 */
	public void setSwitchingCharts(String switchingCharts)
	{
		this.switchingCharts = switchingCharts;
	}

	/**
	 * Used to set the DetailMsgInd
	 * 
	 * @param DetailMsgInd the DetailMsgInd to set
	 */

	public void setDetailMsgInd(String detailMsgInd)
	{
		this.detailMsgInd = detailMsgInd;
	}

	/**
	 * Used to get the DetailMsgLbl
	 * 
	 * @return the DetailMsgLbl
	 */

	public String getDetailMsgLbl()
	{
		return detailMsgLbl;
	}

	/**
	 * Used to set the DetailMsgLbl
	 * 
	 * @param DetailMsgLbl the DetailMsgLbl to set
	 */

	public void setDetailMsgLbl(String detailMsgLbl)
	{
		this.detailMsgLbl = detailMsgLbl;
	}

	public String getResponsiveTemplate()
	{
		return responsiveTemplate;
	}

	public void setResponsiveTemplate(String responsiveTemplate)
	{
		this.responsiveTemplate = responsiveTemplate;
	}

	/**
	 * Used to get the DataCacheScope
	 * 
	 * @return the dataCacheScope
	 */
	public String getDataCacheScope()
	{
		return dataCacheScope;
	}

	/**
	 * Used to set the DataCacheScope
	 * 
	 * @param dataCacheScope the dataCacheScope to set
	 */
	public void setDataCacheScope(String dataCacheScope)
	{
		this.dataCacheScope = dataCacheScope;
	}

	/**
	 * @return the bundleKey
	 */
	public String getBundleKey()
	{
		return bundleKey;
	}

	/**
	 * @param bundleKey the bundleKey to set
	 */
	public void setBundleKey(String bundleKey)
	{
		String fwBundleKey = "canvas-default";

		if ("canvas".equals(bundleKey))
		{
			bundleKey = fwBundleKey;
		}
		this.bundleKey = bundleKey;
	}

	/**
	 * 
	 * @return
	 */
	public String getTemplateConfig()
	{
		return templateConfig;
	}

	/**
	 * 
	 * @param templateConfig
	 */
	public void setTemplateConfig(String templateConfig)
	{
		this.templateConfig = templateConfig;
	}

	/**
	 * 
	 * @return
	 */
	public String getTemplateId()
	{
		return templateId;
	}

	/**
	 * 
	 * @param templateId
	 */
	public void setTemplateId(String templateId)
	{
		this.templateId = templateId;
	}

	/**
	 * @return The String representation of this view.
	 */
	public String toString()
	{
		return new StringBuffer("View ID : ").append(viewId).append(", Parent View Id: ").append(parentViewId)
				.append(", View Name: ").append(viewName).append(", Instruction Class name: ")
				.append(instructionClassName).append(", User Number: ").append(userNumber).append(", GCIF: ")
				.append(GCIF).append(", Default View: ").append(defaultView).append(", Product: ").append(product)
				.append(", SubProduct: ").append(subProduct).append(", List Columns: ").append(listColumns)
				.append(", Map Columns : ").append(mapColumns).append(", Records Per Page : ").append(recordsPerPage)
				.append(", SQL Param Map ID : ").append(sqlParamMapID).append(", Overridden Flag : ")
				.append(overriddenView).append(", System View ID : ").append(systemViewID).append(", View Type : ")
				.append(viewType).append(", StartUp Mode : ").append(startUpMode).append(", Chart Type: ")
				.append(chartType).append(", Total Result Ind: ").append(totalResultInd)
				.append(", Global Date Filters: ").append(dateFilters).append(", Global Date Filter Ind: ")
				.append(globalDateFitlerInd).append(",Detail Action Indicator: ").append(", Context Column Ind: ")
				.append(contextColumn).append(", ").append(detailActionInd).append(",Context Action Indicator: ")
				.append(contextActionInd).append(", Highlight Ind: ").append(highlightInd)
				.append(",GroupingHeaderReqd : ").append(groupingHeaderReqd).append(", Function Code: ")
				.append(functionCode).append(", isDataCached: ").append(isDataCached).append(", initGroupStage: ")
				.append(initGroupStage).append(", isSummaryReqd: ").append(isSummaryReqd)
				.append(", isGroupModifiable: ").append(isGroupModifiable).append(", chartYAxisMax : ")
				.append(chartYAxisMax).append(", chartYAxisMin: ").append(chartYAxisMin)
				.append(", chartNoTreadLines: ").append(chartNoTreadLines).append(" , logoUrl: ").append(logoUrl)
				.append(" , logoProperty: ").append(logoProperty).append(" , borderInd: ").append(borderInd)
				.append(" , SwitchingCharts: ").append(switchingCharts).append(", detailMsgInd: ").append(detailMsgInd)
				.append(", detailMsgLbl: ").append(detailMsgLbl).append(", responsiveTemplate: ")
				.append(responsiveTemplate).append(", bundleKey: ").append(bundleKey).append(", dataCacheScope: ")
				.append(dataCacheScope).append(", templateId:").append(templateId).append(", templateConfig :")
				.append(templateConfig).append(", autoLoadInd:").append(autoLoadInd).toString();
	}

	private static final long serialVersionUID = -2267384806364983819L;// The internal ID used for serialization
	private String viewName = null;
	private String viewId = null;
	private String parentViewId = null;
	private String instructionClassName = null;
	private int recordsPerPage = 0;// Will implement recordsPerPage later as this is not required for Portal.
	private String userNumber = null;
	private String GCIF = null;
	private String product = null;
	private String subProduct = null;
	private String functionCode = "VSBLTY";
	private boolean defaultView = false;
	private boolean overriddenView = false;
	private ArrayList listColumns = null;// List of ColumnDefinition Objects
	private LinkedHashMap mapColumns = null;// Key is the column id and value is the column definition object.
	private String strRecordsPerPage = String.valueOf(0);// String representation of recordsPerPage. Used by sql-map
	private String strDefaultView = "N";// String representation of defaultView. Used by sql-map
	private String strOverriddenView = "N";// String representation of overrideView. Used by sql-map
	private String sqlParamMapID = null;
	private String systemViewID = null;
	private String strFilterEnabled = "Y";// String representation of Filter enabled flag. Used by sql-map
	private String strColumnOrderingEnabled = "Y";// String representation of column ordering enabled flag. Used by
	// sql-map
	private String strGroupingEnabled = "N";// String representation of grouping enabled flag. Used by sql-map
	private String mWidgetId = null;
	private String allTools = null;
	private ViewDefinitionPreferences viewPreferences = null;
	private String startUpMode = null;
	private String viewType = null;
	private String chartType = null;
	private String dataSrcId = null;
	private String autoLoadInd = null;
	private Map bbarButtonsMap = null;
	private Map tbarButtonsMap = null;
	private String pageSize = null;
	private String initCollapsed = null;
	private String totalResultInd = "N";
	private String detailActionInd = null;
	private String contextActionInd = null;
	private String contextColumn = null;
	private String selectionType = null;

	private ArrayList dateFilters = null;
	private ArrayList listPossibleDateFilters = null;
	private ArrayList dateFilterRanges = null;
	private String globalDateFitlerInd = null;

	private String highlightInd = null;

	private String groupingHeaderReqd = null;

	private String isDataCached = "N";

	private String dataCacheScope = "INSTANCE";

	private String customTools = null;

	private String isGroupModifiable = "N";
	private String initGroupStage = "CA";
	private String isSummaryReqd = "N";

	/** To Set the configuration Y Axiz Max value , Y Axiz Min value, No of Tread Lines **/

	private String chartYAxisMax = null;
	private String chartYAxisMin = null;
	private String chartNoTreadLines = null;

	private String detailMsgInd = "N";
	private String detailMsgLbl = null;

	private String logoUrl = null;
	private String borderInd = null;
	private String logoProperty = null;
	private String switchingCharts = null;
	private String responsiveTemplate = "";

	private String initialRecordCount = null;
	private String bundleKey = null;
	private String templateId = "NONE";
	private String templateConfig = null;
	// An instance of Logger
	private transient Logger logger = Logger.getLogger(ViewDefinition.class);
}
