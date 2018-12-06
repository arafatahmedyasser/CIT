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

package com.intellectdesign.canvas.defaultviews;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.data.conversion.util.OnlineJSONToHashmapConverter;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.exceptions.util.JSONConvertorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.ColumnDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.instruction.ListViewsInstruction;

/**
 * This class is for canvas default list view instruction extends list view instruction
 * 
 * @version 1.0
 */
public class CanvasDefaultListViewInstruction extends ListViewsInstruction
{

	/**
	 * this is ref to ViewSpecificFilters get ListViewsInstruction
	 * 
	 * @param hmInputParams
	 * @param dataEntitlements
	 * @return
	 * @throws ViewDefinitionException
	 * @see com.intellectdesign.canvas.viewdefinition.IViewInstruction#getViewSpecificFilters(java.util.HashMap,
	 *      com.intellectdesign.canvas.entitlement.DataEntitlements)
	 */
	@Override
	public HashMap getViewSpecificFilters(HashMap hmInputParams, DataEntitlements dataEntitlements)
			throws ViewDefinitionException
	{
		HashMap mapViewSpecificFilter = new HashMap();
		OnlineJSONToHashmapConverter jsontohMap = new OnlineJSONToHashmapConverter();
		HashMap hMap = new HashMap();
		if(hmInputParams.containsKey("ADDL_FILTERS")){
			try
			{
				int i=0;
				StringBuilder sb = new StringBuilder(1000);
				hMap = jsontohMap.convert(hmInputParams.get("ADDL_FILTERS").toString());
				Iterator it = hMap.entrySet().iterator();
				while (it.hasNext()) {
					Map.Entry pairs = (Map.Entry) it.next();
					if(i>0){
						sb.append(" AND ");
					}
					sb.append(pairs.getKey()+" = '"+pairs.getValue()+"'");
					i = i+1;
				}
				mapViewSpecificFilter.put("ADDL_FILTERS", sb);
			} catch (JSONConvertorException e)
			{
				e.printStackTrace();
			}
		}

		return mapViewSpecificFilter;
	}

	/**
	 * this is ref to UniqueSortFieldName
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getUniqueSortFieldName()
	 */
	@Override
	protected String getUniqueSortFieldName()
	{

		return null;
	}

	/**
	 * this is ref to UniqueSortFielOrder
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getUniqueSortFieldOrder()
	 */
	@Override
	protected String getUniqueSortFieldOrder()
	{

		return null;
	}

	/**
	 * this is ref to hashmap to SortColumnMap
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getSortColumnMap()
	 */
	@Override
	protected HashMap<String, String> getSortColumnMap()
	{

		return null;
	}

	/**
	 * This method gets the all View data for the given view definition
	 * 
	 * @param viewDefinition The view definition
	 * @param mapInputParams - Hashmap containing the input parameters
	 * @return List - the view data
	 * @throws ViewDefinitionException thrown if any error occurs while processing the request
	 */
	public HashMap getViewData(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel)
			throws ViewDefinitionException
	{
		logger.ctdebug("CTVDF00809");
		HashMap sorColMap = new HashMap();
		String uniqueSortFieldName = null;
		String uniqueSortFieldOrder = null;
		List colList = viewDefinition.getListColumns();
		ColumnDefinition colDef = null;
		if (colList != null && colList.size() > 0)
		{
			for (Object colObject : colList)
			{
				colDef = (ColumnDefinition) colObject;
				sorColMap.put(colDef.getColumnId(), colDef.getColumnId());
				if (colDef.getSortPosition() == 1)
				{
					uniqueSortFieldName = colDef.getColumnId();
					uniqueSortFieldOrder = colDef.getSortOrder();
				}
			}
		}
		return getViewData(viewDefinition, mapInputParams, pmModel, sorColMap, uniqueSortFieldName,
				uniqueSortFieldOrder);
	}

	/**
	 * this is ref to fetchDataQueryForView to Database
	 * 
	 * @param viewDefinition
	 * @return db
	 */
	/*
	 * private String fetchDataQueryForView(ViewDefinition viewDefinition){ logger.ctdebug("CTVDF00810"); String
	 * dataQuery = null; DatabaseRequest dbRequest = null; DatabaseResult dbResult = null; try { dbRequest = new
	 * DatabaseRequest(); dbRequest.setOperation(DatabaseConstants.SELECT);
	 * dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
	 * dbRequest.setOperationExtension(ViewDefinitionConstants.FETCH_DATA_QUERY_FOR_VIEW);
	 * dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, viewDefinition.getSystemViewID()); dbResult =
	 * dbRequest.execute(); if(dbResult.getReturnedList().size()>0 ){ dataQuery = (String) ((HashMap)
	 * dbResult.getReturnedList().get(0)).get("DATA_QUERY"); } } catch (DatabaseException e) {
	 * logger.cterror("CTVDF00811", e); } logger.ctdebug("CTVDF00812"); return dataQuery; }
	 *//**
	 * This method is called from getViewData to do the actual data fetch. All inputs to the same are provided. The
	 * default implementation is to use a database request for executing the same. In case a sub class wants to provide
	 * a different implementation logic for fetching the data, this is the method to be overridden
	 * 
	 * @param viewDefinition The View definition
	 * @param mapInputParams The input params to this view
	 * @param pmModel The Pagination model
	 * @param listFilters The list of filters to be added
	 * @param listSortDefinitions The list of sort conditions to be added
	 * @param dataEntitlements The Data Entitlements that corresponds to the user entitlements
	 * @return The list of rows that are returned for this list view.
	 * @throws ViewDefinitionExceptionn thrown if any error occurs while processing the request.
	 */
	/*
	 * protected List fetchData(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel,
	 * ArrayList listFilters, ArrayList listSortDefinitions, DataEntitlements dataEntitlements) throws
	 * ViewDefinitionException { logger.ctdebug("CTVDF00813"); List listViewData = null; String sqlParamMapId = null;
	 * String dataQuery = null; DatabaseRequest dbRequest = null; DatabaseResult dbResult = null; try { dbRequest = new
	 * DatabaseRequest(); dbRequest.setDataSource(getDataSource()); dbRequest.setOperation(DatabaseConstants.SELECT);
	 * dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
	 *//**
	 * added user defined sql param map id to be sent to the ibatis to fetch data as the user wants
	 */
	/*
	 * sqlParamMapId = viewDefinition.getSqlParamMapID();
	 *//**
			 * 
			 */
	/*
	 * sqlParamMapId = getUpdatedSqlParamMapId(sqlParamMapId,mapInputParams);
	 *//**
			 * 
			 */
	/*
	 * dbRequest.setOperationExtension(sqlParamMapId);
	 *//**
	 * Before adding the filters, provide a hook to the sub class to modify the filters. This is required to enable
	 * the sub class to handle any of the runtime filters in a different manner.
	 */
	/*
	 * alterFilters(dbRequest, listFilters, mapInputParams);
	 *//**
			 * 
			 */
	/*
	 * dataQuery = fetchDataQueryForView(viewDefinition); if(dataQuery != null &&
	 * ViewDefinitionConstants.DEFAULT_VIEW_DATA.equals(sqlParamMapId)){ dbRequest.addFilter("DEFAULT_DATA_QUERY",
	 * dataQuery); }
	 *//**
			 * 
			 */
	/*
	 * dbRequest.addFilter(ViewDefinitionConstants.FLD_FILTERS, listFilters);
	 * dbRequest.addFilter(ViewDefinitionConstants.FLD_SORTFIELDS, listSortDefinitions);
	 *//**
	 * Added for Decoded columns sorting starts here
	 */
	/*
	 * logger.ctinfo("CTVDF00792", mapInputParams.get("INPUT_LANGUAGE_ID"));
	 * dbRequest.addFilter(ViewDefinitionConstants.INPUT_LANGUAGE_ID, mapInputParams.get("INPUT_LANGUAGE_ID"));
	 *//**
	 * Add additional default filters for GCIF, User No, Product, Sub Product, Function
	 */
	/*
	 * dbRequest.addFilter(ViewDefinitionConstants.INPUT_GCIF, mapInputParams.get("INPUT_GCIF"));
	 * dbRequest.addFilter(ViewDefinitionConstants.INPUT_USER_NO, mapInputParams.get("INPUT_USER_NO"));
	 *//** this will be enabled in the future */
	/*
	 * if (pmModel != null){ dbRequest.setPaginationModel(pmModel); } dbResult = dbRequest.execute(); listViewData =
	 * dbResult.getReturnedList(); } catch (DatabaseException dbExcep) { logger.cterror("CTVDF00386", dbExcep,
	 * viewDefinition.getViewId()); throw new ViewDefinitionException(dbExcep); } return listViewData; }
	 */

	private static Logger logger = Logger.getLogger(CanvasDefaultListViewInstruction.class);
}
