/**
 * Copyright 2016. Intellect Design Arena Limited. All rights reserved. 
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

import java.util.ArrayList;
import java.util.HashMap;

/**
 * This is a read-only wrapper for a ColumnDefinition that ensures that the data of a ColumnDefinition provided cannot
 * be modified accidentally
 */
public class ColumnDefinitionWrapper extends ColumnDefinition
{
	private ColumnDefinition parent = null;
	/**
	 * Internal Constant for serialization purposes
	 */
	private static final long serialVersionUID = -2529972445778918925L;

	private String colDisplayName = null;
	private int colPosition = -1;
	private Boolean colVisible = null;

	/**
	 * 
	 */
	public ColumnDefinitionWrapper(ColumnDefinition theParent)
	{
		parent = theParent;
	}

	/**
	 * Override the base class implementation to return the reference to the underlying Definition
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#intern()
	 */
	public ColumnDefinition intern()
	{
		return parent;
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getColumnDefinitionAsMap()
	 */
	@Override
	public HashMap getColumnDefinitionAsMap()
	{
		return parent.getColumnDefinitionAsMap();
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getFilterEnableInd()
	 */
	@Override
	public String getFilterEnableInd()
	{
		return parent.getFilterEnableInd();
	}

	/**
	 * @param filterEnableInd
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setFilterEnableInd(java.lang.String)
	 */
	@Override
	public void setFilterEnableInd(String filterEnableInd)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getXSeriesInd()
	 */
	@Override
	public String getXSeriesInd()
	{
		return parent.getXSeriesInd();
	}

	/**
	 * @param seriesInd
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setXSeriesInd(java.lang.String)
	 */
	@Override
	public void setXSeriesInd(String seriesInd)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getYSeriesInd()
	 */
	@Override
	public String getYSeriesInd()
	{
		return parent.getYSeriesInd();
	}

	/**
	 * @param seriesInd
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setYSeriesInd(java.lang.String)
	 */
	@Override
	public void setYSeriesInd(String seriesInd)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getDataSeriedInd()
	 */
	@Override
	public String getDataSeriedInd()
	{
		return parent.getDataSeriedInd();
	}

	/**
	 * @param dataSeriedInd
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setDataSeriedInd(java.lang.String)
	 */
	@Override
	public void setDataSeriedInd(String dataSeriedInd)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getFilterHandlerId()
	 */
	@Override
	public String getFilterHandlerId()
	{
		return parent.getFilterHandlerId();
	}

	/**
	 * @param filterHandlerId
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setFilterHandlerId(java.lang.String)
	 */
	@Override
	public void setFilterHandlerId(String filterHandlerId)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getFilterDataType()
	 */
	@Override
	public String getFilterDataType()
	{
		return parent.getFilterDataType();
	}

	/**
	 * @param filterDataType
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setFilterDataType(java.lang.String)
	 */
	@Override
	public void setFilterDataType(String filterDataType)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isSearchAllowed()
	 */
	@Override
	public boolean isSearchAllowed()
	{
		return parent.isSearchAllowed();
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrSearchAllowed()
	 */
	@Override
	public String getStrSearchAllowed()
	{
		return parent.getStrSearchAllowed();
	}

	/**
	 * @param strSearchAllowed
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrSearchAllowed(java.lang.String)
	 */
	@Override
	public void setStrSearchAllowed(String strSearchAllowed)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getSearchOrder()
	 */
	@Override
	public int getSearchOrder()
	{
		return parent.getSearchOrder();
	}

	/**
	 * @param searchOrder
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSearchOrder(int)
	 */
	@Override
	public void setSearchOrder(int searchOrder)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getSearchDataType()
	 */
	@Override
	public String getSearchDataType()
	{
		return parent.getSearchDataType();
	}

	/**
	 * @param searchDataType
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSearchDataType(java.lang.String)
	 */
	@Override
	public void setSearchDataType(String searchDataType)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getCodeValViewId()
	 */
	@Override
	public String getCodeValViewId()
	{
		return parent.getCodeValViewId();
	}

	/**
	 * @param codeValViewId
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setCodeValViewId(java.lang.String)
	 */
	@Override
	public void setCodeValViewId(String codeValViewId)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getCodeValCodeCol()
	 */
	@Override
	public String getCodeValCodeCol()
	{
		return parent.getCodeValCodeCol();
	}

	/**
	 * @param codeValCodeCol
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setCodeValCodeCol(java.lang.String)
	 */
	@Override
	public void setCodeValCodeCol(String codeValCodeCol)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getCodeValDisplayCol()
	 */
	@Override
	public String getCodeValDisplayCol()
	{
		return parent.getCodeValDisplayCol();
	}

	/**
	 * @param codeValDisplayCol
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setCodeValDisplayCol(java.lang.String)
	 */
	@Override
	public void setCodeValDisplayCol(String codeValDisplayCol)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getViewId()
	 */
	@Override
	public String getViewId()
	{
		return parent.getViewId();
	}

	/**
	 * @param viewId
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setViewId(java.lang.String)
	 */
	@Override
	public void setViewId(String viewId)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getColumnId()
	 */
	@Override
	public String getColumnId()
	{
		return parent.getColumnId();
	}

	/**
	 * @param columnId
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setColumnId(java.lang.String)
	 */
	@Override
	public void setColumnId(String columnId)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getColumnDisplayNameKey()
	 */
	@Override
	public String getColumnDisplayNameKey()
	{
		if (colDisplayName != null)
			return colDisplayName;
		return parent.getColumnDisplayNameKey();
	}

	/**
	 * @param columnDisplayNameKey
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setColumnDisplayNameKey(java.lang.String)
	 */
	@Override
	public void setColumnDisplayNameKey(String columnDisplayNameKey)
	{
		colDisplayName = columnDisplayNameKey;
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getPosition()
	 */
	@Override
	public int getPosition()
	{
		if (colPosition != -1)
			return colPosition;
		return parent.getPosition();
	}

	/**
	 * @param position
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setPosition(int)
	 */
	@Override
	public void setPosition(int position)
	{
		colPosition = position;
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isPositionFixed()
	 */
	@Override
	public boolean isPositionFixed()
	{
		return parent.isPositionFixed();
	}

	/**
	 * @param positionFixed
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setPositionFixed(boolean)
	 */
	@Override
	public void setPositionFixed(boolean positionFixed)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isMandatory()
	 */
	@Override
	public boolean isMandatory()
	{
		return parent.isMandatory();
	}

	/**
	 * @param mandatory
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setMandatory(boolean)
	 */
	@Override
	public void setMandatory(boolean mandatory)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isVisible()
	 */
	@Override
	public boolean isVisible()
	{
		if (colVisible != null)
			return colVisible.booleanValue();
		return parent.isVisible();
	}

	/**
	 * @param visible
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setVisible(boolean)
	 */
	@Override
	public void setVisible(boolean visible)
	{
		colVisible = Boolean.valueOf(visible);
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isSortRequired()
	 */
	@Override
	public boolean isSortRequired()
	{
		return parent.isSortRequired();
	}

	/**
	 * @param sortRequired
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSortRequired(boolean)
	 */
	@Override
	public void setSortRequired(boolean sortRequired)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getSortPosition()
	 */
	@Override
	public int getSortPosition()
	{
		return parent.getSortPosition();
	}

	/**
	 * @param sortPosition
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSortPosition(int)
	 */
	@Override
	public void setSortPosition(int sortPosition)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getSortOrder()
	 */
	@Override
	public String getSortOrder()
	{
		return parent.getSortOrder();
	}

	/**
	 * @param sortOrder
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSortOrder(java.lang.String)
	 */
	@Override
	public void setSortOrder(String sortOrder)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getDataType()
	 */
	@Override
	public String getDataType()
	{
		return parent.getDataType();
	}

	/**
	 * @param dataType
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setDataType(java.lang.String)
	 */
	@Override
	public void setDataType(String dataType)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isFilterRequired()
	 */
	@Override
	public boolean isFilterRequired()
	{
		return parent.isFilterRequired();
	}

	/**
	 * @param filterRequired
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setFilterRequired(boolean)
	 */
	@Override
	public void setFilterRequired(boolean filterRequired)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getListFilters()
	 */
	@Override
	public ArrayList getListFilters()
	{
		return parent.getListFilters();
	}

	/**
	 * @param listFilters
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setListFilters(java.util.ArrayList)
	 */
	@Override
	public void setListFilters(ArrayList listFilters)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrPositionFixed()
	 */
	@Override
	public String getStrPositionFixed()
	{
		return parent.getStrPositionFixed();
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getCurrencyAppend()
	 */
	@Override
	public String getCurrencyAppend()
	{
		return parent.getCurrencyAppend();
	}

	/**
	 * @param strCurrencyAppend
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setCurrencyAppend(java.lang.String)
	 */
	@Override
	public void setCurrencyAppend(String strCurrencyAppend)
	{
		// Read-only
	}

	/**
	 * @param strPositionFixed
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrPositionFixed(java.lang.String)
	 */
	@Override
	public void setStrPositionFixed(String strPositionFixed)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrMandatory()
	 */
	@Override
	public String getStrMandatory()
	{
		return parent.getStrMandatory();
	}

	/**
	 * @param strMandatory
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrMandatory(java.lang.String)
	 */
	@Override
	public void setStrMandatory(String strMandatory)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrVisible()
	 */
	@Override
	public String getStrVisible()
	{
		return parent.getStrVisible();
	}

	/**
	 * @param strVisible
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrVisible(java.lang.String)
	 */
	@Override
	public void setStrVisible(String strVisible)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrSortPosition()
	 */
	@Override
	public String getStrSortPosition()
	{
		return parent.getStrSortPosition();
	}

	/**
	 * @param strSortPosition
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrSortPosition(java.lang.String)
	 */
	@Override
	public void setStrSortPosition(String strSortPosition)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getPRIMARY_IND()
	 */
	@Override
	public String getPRIMARY_IND()
	{
		return parent.getPRIMARY_IND();
	}

	/**
	 * @param PRIMARY_IND
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setPRIMARY_IND(java.lang.String)
	 */
	@Override
	public void setPRIMARY_IND(String PRIMARY_IND)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getSECONDARY_1()
	 */
	@Override
	public String getSECONDARY_1()
	{
		return parent.getSECONDARY_1();
	}

	/**
	 * @param SECONDARY_1
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSECONDARY_1(java.lang.String)
	 */
	@Override
	public void setSECONDARY_1(String SECONDARY_1)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getSECONDARY_2()
	 */
	@Override
	public String getSECONDARY_2()
	{
		return parent.getSECONDARY_2();
	}

	/**
	 * @param SECONDARY_2
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSECONDARY_2(java.lang.String)
	 */
	@Override
	public void setSECONDARY_2(String SECONDARY_2)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#hidden()
	 */
	@Override
	public String hidden()
	{
		return parent.hidden();
	}

	/**
	 * @param strPosition
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrPosition(java.lang.String)
	 */
	@Override
	public void setStrPosition(String strPosition)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isHidden()
	 */
	@Override
	public boolean isHidden()
	{
		return parent.isHidden();
	}

	/**
	 * @param hidden
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setHidden(boolean)
	 */
	@Override
	public void setHidden(boolean hidden)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrHidden()
	 */
	@Override
	public String getStrHidden()
	{
		return parent.getStrHidden();
	}

	/**
	 * @param strHidden
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrHidden(java.lang.String)
	 */
	@Override
	public void setStrHidden(String strHidden)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isSortable()
	 */
	@Override
	public boolean isSortable()
	{
		return parent.isSortable();
	}

	/**
	 * @param sortable
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSortable(boolean)
	 */
	@Override
	public void setSortable(boolean sortable)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrSortable()
	 */
	@Override
	public String getStrSortable()
	{
		return parent.getStrSortable();
	}

	/**
	 * @param strSortable
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrSortable(java.lang.String)
	 */
	@Override
	public void setStrSortable(String strSortable)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isGroupable()
	 */
	@Override
	public boolean isGroupable()
	{
		return parent.isGroupable();
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrGroupable()
	 */
	@Override
	public String getStrGroupable()
	{
		return parent.getStrGroupable();
	}

	/**
	 * @param groupable
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrGroupable(java.lang.String)
	 */
	@Override
	public void setStrGroupable(String groupable)
	{
		// Read-only
	}

	/**
	 * @param groupable
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setGroupable(boolean)
	 */
	@Override
	public void setGroupable(boolean groupable)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrGroupRelativePosition()
	 */
	@Override
	public String getStrGroupRelativePosition()
	{
		return parent.getStrGroupRelativePosition();
	}

	/**
	 * @param groupRelativePosition
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrGroupRelativePosition(java.lang.String)
	 */
	@Override
	public void setStrGroupRelativePosition(String groupRelativePosition)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isMandatoryInGroup()
	 */
	@Override
	public boolean isMandatoryInGroup()
	{
		return parent.isMandatoryInGroup();
	}

	/**
	 * @param mandatoryInGroup
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setMandatoryInGroup(boolean)
	 */
	@Override
	public void setMandatoryInGroup(boolean mandatoryInGroup)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrMandatoryInGroup()
	 */
	@Override
	public String getStrMandatoryInGroup()
	{
		return parent.getStrMandatoryInGroup();
	}

	/**
	 * @param mandatoryInGroup
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrMandatoryInGroup(java.lang.String)
	 */
	@Override
	public void setStrMandatoryInGroup(String mandatoryInGroup)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isGrouped()
	 */
	@Override
	public boolean isGrouped()
	{
		return parent.isGrouped();
	}

	/**
	 * @param grouped
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setGrouped(boolean)
	 */
	@Override
	public void setGrouped(boolean grouped)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrGrouped()
	 */
	@Override
	public String getStrGrouped()
	{
		return parent.getStrGrouped();
	}

	/**
	 * @param grouped
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrGrouped(java.lang.String)
	 */
	@Override
	public void setStrGrouped(String grouped)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getGroupPosition()
	 */
	@Override
	public int getGroupPosition()
	{
		return parent.getGroupPosition();
	}

	/**
	 * @param groupPos
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setGroupPosition(int)
	 */
	@Override
	public void setGroupPosition(int groupPos)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#isDrilldownRequired()
	 */
	@Override
	public boolean isDrilldownRequired()
	{
		return parent.isDrilldownRequired();
	}

	/**
	 * @param drilldownRequired
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setDrilldownRequired(boolean)
	 */
	@Override
	public void setDrilldownRequired(boolean drilldownRequired)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrDrilldownRequired()
	 */
	@Override
	public String getStrDrilldownRequired()
	{
		return parent.getStrDrilldownRequired();
	}

	/**
	 * @param drilldownRequired
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrDrilldownRequired(java.lang.String)
	 */
	@Override
	public void setStrDrilldownRequired(String drilldownRequired)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getLinkedSourceAmt()
	 */
	@Override
	public String getLinkedSourceAmt()
	{
		return parent.getLinkedSourceAmt();
	}

	/**
	 * @param linkedSourceAmt
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setLinkedSourceAmt(java.lang.String)
	 */
	@Override
	public void setLinkedSourceAmt(String linkedSourceAmt)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getLinkedSourceCcy()
	 */
	@Override
	public String getLinkedSourceCcy()
	{
		return parent.getLinkedSourceCcy();
	}

	/**
	 * @param linkedSourceCcy
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setLinkedSourceCcy(java.lang.String)
	 */
	@Override
	public void setLinkedSourceCcy(String linkedSourceCcy)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getStrDisabled()
	 */
	@Override
	public String getStrDisabled()
	{
		return parent.getStrDisabled();
	}

	/**
	 * @param strDisabled
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setStrDisabled(java.lang.String)
	 */
	@Override
	public void setStrDisabled(String strDisabled)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getLookupFilterExtParams()
	 */
	@Override
	public String getLookupFilterExtParams()
	{
		return parent.getLookupFilterExtParams();
	}

	/**
	 * @param lookupFilterExtParams
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setLookupFilterExtParams(java.lang.String)
	 */
	@Override
	public void setLookupFilterExtParams(String lookupFilterExtParams)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getParentColumnId()
	 */
	@Override
	public String getParentColumnId()
	{
		return parent.getParentColumnId();
	}

	/**
	 * @param parentColumnId
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setParentColumnId(java.lang.String)
	 */
	@Override
	public void setParentColumnId(String parentColumnId)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getSummaryType()
	 */
	@Override
	public String getSummaryType()
	{
		return parent.getSummaryType();
	}

	/**
	 * @param summaryType
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setSummaryType(java.lang.String)
	 */
	@Override
	public void setSummaryType(String summaryType)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getCustomTooltext()
	 */
	@Override
	public String getCustomTooltext()
	{
		return parent.getCustomTooltext();
	}

	/**
	 * @param customTooltext
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setCustomTooltext(java.lang.String)
	 */
	@Override
	public void setCustomTooltext(String customTooltext)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getLinkedDataSeries()
	 */
	@Override
	public String getLinkedDataSeries()
	{
		return parent.getLinkedDataSeries();
	}

	/**
	 * @param linkedDataSeries
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setLinkedDataSeries(java.lang.String)
	 */
	@Override
	public void setLinkedDataSeries(String linkedDataSeries)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getChannelId()
	 */
	@Override
	public String getChannelId()
	{
		return parent.getChannelId();
	}

	/**
	 * @param channelId
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setChannelId(java.lang.String)
	 */
	@Override
	public void setChannelId(String channelId)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getPriority()
	 */
	@Override
	public String getPriority()
	{
		return parent.getPriority();
	}

	/**
	 * @param priority
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setPriority(java.lang.String)
	 */
	@Override
	public void setPriority(String priority)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getTemplateConfig()
	 */
	@Override
	public String getTemplateConfig()
	{
		return parent.getTemplateConfig();
	}

	/**
	 * @param templateConfig
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setTemplateConfig(java.lang.String)
	 */
	@Override
	public void setTemplateConfig(String templateConfig)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getTemplateId()
	 */
	@Override
	public String getTemplateId()
	{
		return parent.getTemplateId();
	}

	/**
	 * @param templateId
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setTemplateId(java.lang.String)
	 */
	@Override
	public void setTemplateId(String templateId)
	{
		// Read-only
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#getColumnWidth()
	 */
	@Override
	public String getColumnWidth()
	{
		return parent.getColumnWidth();
	}

	/**
	 * @param columnWidth
	 * @see com.intellectdesign.canvas.viewdefinition.ColumnDefinition#setColumnWidth(java.lang.String)
	 */
	@Override
	public void setColumnWidth(String columnWidth)
	{
		// Read-only
	}

}
