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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.intellectdesign.canvas.cache.CBXCacheException;
import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.database.DynamicDatasourceManager;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.database.SortingModel;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.viewdefinition.cache.VDFEhCacheManager;
import com.intellectdesign.canvas.viewdefinition.util.ListViewUtil;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

/**
 * An abstract implementation of IViewInstruction
 * 
 * @version 1.0
 */
public abstract class SimpleViewDefinitionInstruction implements IViewInstruction
{

	/**
	 * Internal constant for serialization purposes
	 */
	/**
	 * Blank implementation of deleteExtension method. Individual instruction classes which has view specific tables
	 * other than the view definition framework related tables, should use this method to delete the view related
	 * entries from the table while updating a view definition. At present only Account list view has additional table
	 * called ACCOUNT_LIST_VDF_EXT
	 */
	public void deleteExtension(String sViewId) throws ViewDefinitionException
	{
		// do nothing
		// Individual instruction classes needs to implement, if required
	}

	/**
	 * This method gets the all View data for the given view definition
	 * 
	 * @param viewDefinition
	 * @param mapViewSpecificFilter - Hashmap containing view specific filters
	 * @return List - the view data
	 * @throws ViewDefinitionException
	 */
	public HashMap getViewData(ViewDefinition viewDefinition, HashMap mapInputParams) throws ViewDefinitionException
	{
		return getViewData(viewDefinition, mapInputParams, null);
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
		return getViewData(viewDefinition, mapInputParams, pmModel, getSortColumnMap(), getUniqueSortFieldName(),
				getUniqueSortFieldOrder());
	}

	/**
	 * This method gets the View data for the given view definition
	 * 
	 * @param viewDefinition
	 * @param mapViewSpecificFilter - Hashmap containing view specific filters
	 * @param pmModel - PaginationModel to be applied to the query
	 * @param HashMap <String,String> -SortColMap to creat sortDefinition for the query
	 * @return List - the view data
	 * @throws ViewDefinitionException
	 */
	public HashMap getViewData(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel,
			HashMap<String, String> SortColMap, String sUniqueSortField, String sUniqueFieldSortOrder)
			throws ViewDefinitionException
	{
		ArrayList listRuntimeFilters = null;
		ArrayList listRuntimeSortDefns = null;
		ArrayList listFilters = null;// Variable to hold the list of all filters
										// that are applicable for this view
		ArrayList listViewFilters = null;// Variable that holds the view
											// specific filters as defined in
											// the db
		ArrayList listSortDefinitions = null;// Variable to hold the list of
												// sort criterion for this view
		List listViewData = null;// The actual data
		boolean isDataCached = false;
		DataEntitlements dataEntitlements = null;

		logger.ctinfo("CTVDF00366");
		dataEntitlements = retrieveEntitlements(viewDefinition, mapInputParams);

		if (dataEntitlements != null && dataEntitlements.isEntitled() && dataEntitlements.getErrorCode() == null)
		{
			if (!mapInputParams.containsValue("CLEAR_FILTER_ACTIVE"))
			{
				listRuntimeFilters = getRuntimeFilters(mapInputParams, viewDefinition);
				listViewFilters = viewDefinition.getListFilters();
			}
			// To check whether runtime sorting columns are there
			listRuntimeSortDefns = processRuntimeSortDefinitions(mapInputParams, viewDefinition, SortColMap,
					sUniqueSortField, sUniqueFieldSortOrder);

			logger.ctdebug("CTVDF00367", listViewFilters, listRuntimeFilters, listRuntimeSortDefns);
			listFilters = new ArrayList();
			// If runtime filters are not null, then discard the filters defined
			// in db and add only the runtime
			// filters
			if (listRuntimeFilters != null && !listRuntimeFilters.isEmpty())
			{
				listFilters.addAll(listRuntimeFilters);
			}
			// If the runtime filters are null, add the view specific filters
			// defined in the database

			// Grouping Grid Upgrade - DIT_1668_1661_1415
			if (listViewFilters != null)
			// Commented the Code Because the filters are required for the custom views
			// if (listViewFilters != null && !viewDefinition.isOverriddenView())
			{
				listFilters.addAll(listViewFilters);
			}
			// If runtime sort definitions are not null, then discard the sort
			// criterion defined in db. Else
			// consider those defined in db
			if (listRuntimeSortDefns != null && !listRuntimeSortDefns.isEmpty())
			{
				listSortDefinitions = listRuntimeSortDefns;
			} else
			{
				listSortDefinitions = viewDefinition.getOrderedSortDefinition();
			}

			logger.ctinfo("CTVDF00368", listFilters, listSortDefinitions);
			HashMap mapViewSpecificFilter = null;
			// get the data applying the filters and sort criterion
			mapViewSpecificFilter = getViewSpecificFilters(mapInputParams, dataEntitlements);

			mapInputParams.put(ViewDefinitionConstants.FLD_FILTERS, listFilters);
			mapInputParams.put(ViewDefinitionConstants.FLD_SORTFIELDS, listSortDefinitions);

			if (mapViewSpecificFilter != null && !mapViewSpecificFilter.isEmpty())
				mapInputParams.put(ViewDefinitionConstants.VIEW_SPECIFIC_FILTERS, mapViewSpecificFilter);

			if (pmModel != null)
				mapInputParams.put(ViewDefinitionConstants.VIEW_PAGINATION_MODEL, pmModel);
			/**
			 * If the View Defintion of this view says data cached as false i.e 'N' then its regular flow else
			 * 
			 * 1) VDF cachemanager is initiated. 2) Key is generated and if it already exists got to 6 3) The key mapped
			 * to session id + view id 4) The Data is fetched from DB without the filter sorting and pagination. 5) The
			 * Data is set in the cache. 6) The Data is fetched from the cache with sorting , pagination and filters
			 */

			if (ViewDefinitionConstants.VAL_BOOL_YES.equals(viewDefinition.getIsDataCached()))
			{ // "Y"

				/**
				 * To Update the listFilters with the filterId So that cache filters according to the filter id
				 */
				if (!listFilters.isEmpty())
				{
					ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
					ColumnFilter columnFilter = null;
					String sFilterID = null;
					for (int j = 0; j < listFilters.size(); j++)
					{
						columnFilter = (ColumnFilter) listFilters.get(j);
						sFilterID = viewDefinitionInstruction.getFilterIDForFilterType(columnFilter.getFilterType(),
								columnFilter.getDataType());
						columnFilter.setFilterID(sFilterID);
						listFilters.set(j, columnFilter);
					}
				}
				/**
				 * To Update the sortdefintions with the datatype of that column So that cache sorts according to the
				 * datatype
				 */

				if (!listSortDefinitions.isEmpty())
				{
					SortDefinition sortDefinition = null;
					for (int k = 0; k < listSortDefinitions.size(); k++)
					{
						sortDefinition = (SortDefinition) listSortDefinitions.get(k);
						sortDefinition.setColumnDatatype(viewDefinition.getColumnDefnForColumn(
								sortDefinition.getActualColumnID()).getDataType());
					}

				}

				logger.ctinfo("CTVDF00369");
				try
				{
					VDFEhCacheManager cacheManager = (VDFEhCacheManager) VDFEhCacheManager.createInstance();

					EhCacheDataUtil cacheUtil = new EhCacheDataUtil();
					String gcif = (String) mapInputParams.get("INPUT_GCIF");
					String userNo = (String) mapInputParams.get("INPUT_USER_NO");
					if (ViewDefinitionConstants.change.equalsIgnoreCase((String) mapInputParams
							.get(ViewDefinitionConstants.EQUCURR))
							|| ViewDefinitionConstants.VAL_BOOL_YES.equalsIgnoreCase((String) mapInputParams
									.get(ViewDefinitionConstants.REFRESH_DATA))
							|| ViewDefinitionConstants.VAL_BOOL_TRUE.equalsIgnoreCase((String) mapInputParams
									.get(ViewDefinitionConstants.IS_LOOK_UP))
							|| ViewDefinitionConstants.VAL_BOOL_TRUE.equalsIgnoreCase((String) mapInputParams
									.get(ViewDefinitionConstants.IS_DATE_FILTER_FORM)))
					{
						cacheUtil.resetCache((String) mapInputParams.get(ViewDefinitionConstants.INPUT_SESSION_ID),
								(String) mapInputParams.get("PARAM_WIDGET_ID"), viewDefinition.getViewId(), userNo,
								gcif);
					}

					String key = cacheUtil.fetchCacheId(
							(String) mapInputParams.get(ViewDefinitionConstants.INPUT_SESSION_ID),
							(String) mapInputParams.get(ViewDefinitionConstants.PARAM_WIDGET_ID),
							viewDefinition.getViewId(), userNo, gcif);

					logger.ctinfo("CTVDF00360", key);

					if (!cacheManager.isCacheAvailable(key))
					{

						logger.ctinfo("CTVDF00371");
						ArrayList lookUpFilters = new ArrayList();
						if (ViewDefinitionConstants.VAL_BOOL_TRUE.equalsIgnoreCase((String) mapInputParams
								.get(ViewDefinitionConstants.IS_LOOK_UP)))
						{
							lookUpFilters = listFilters;
						}
						listViewData = fetchData(viewDefinition, mapInputParams, null, new ArrayList(),
								listSortDefinitions, dataEntitlements);

						HashMap inputConfig = new HashMap();
						inputConfig.put(CacheConstants.VIEW_COLUMN_DEFINITION, viewDefinition.getListColumns());
						cacheManager.initializeCache(key, inputConfig);
						cacheManager.setDataInCache(key, listViewData);
					}
					logger.ctinfo("CTVDF00372");
					listViewData = cacheManager.fetchDataFromCache(key, pmModel, listSortDefinitions, listFilters);
					isDataCached = true;

				} catch (CBXCacheException e)
				{
					logger.cterror("CTVDF00373", e, viewDefinition.getViewId());
					throw new ViewDefinitionException(e);
				}
			} else
			{
				logger.ctinfo("CTVDF00374");
				listViewData = fetchData(viewDefinition, mapInputParams, pmModel, listFilters, listSortDefinitions,
						dataEntitlements);
			}

		} else
		{

			listViewData = new ArrayList();
			logger.ctinfo("CTVDF00375", dataEntitlements);
			HashMap mEntlErr = new HashMap();
			mEntlErr.put(FrameworkConstants.ENTL_ERROR, dataEntitlements.getErrorCode());
			return mEntlErr;

		}

		List listViewDataTemp = null;
		if (isDataCached && listViewData != null)
		{
			listViewDataTemp = new ArrayList();
			for (int index = 0; index < listViewData.size(); index++)
			{
				listViewDataTemp.add(((HashMap) listViewData.get(index)).clone());
			}
		} else
		{
			listViewDataTemp = listViewData;
		}
		performFormatting(listViewDataTemp, viewDefinition, mapInputParams);
		timeZoneConvertor(listViewDataTemp, viewDefinition, mapInputParams);

		HashMap responseData = processResponse(listViewDataTemp, viewDefinition, mapInputParams);

		//processResponseEx(responseData, viewDefinition, mapInputParams);
		logger.ctinfo("CTVDF00376", responseData);
		logger.ctinfo("CTVDF00377");
		return responseData;
	}

	/**
	 * This method is to perform currency conversion by call EquivalentAmountConverter class and get the updated list of
	 * equivalent amount.
	 * 
	 * @param listViewData - The list having the column to support equivalent amount.
	 * @param viewDefinition
	 * @param mapInputParams
	 * @throws ViewDefinitionException
	 */
	protected void performFormatting(List listViewData, ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException
	{
		EquivalentAmountConverter equiCurr = new EquivalentAmountConverter();
		equiCurr.checkForEquivalentAmount(listViewData, viewDefinition, mapInputParams);
	}

	/**
	 * ref to processResponseEx
	 * 
	 * @param Map responseData, ViewDefinition view, HashMap mapInputParams
	 * @throws ViewDefinitionException
	 */
	protected void processResponseEx(Map responseData, ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException
	{

	}

	/**
	 * This method is to perform timezone conversion by calling GlobalPrefrencesUtil class and get the updated timez for
	 * the columns.
	 * 
	 * @param listViewData - The list having the column to support equivalent amount.
	 * @param viewDefinition
	 * @param mapInputParams
	 * @throws ViewDefinitionException
	 */
	protected void timeZoneConvertor(List listViewData, ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException
	{

		PerformanceTimer timeZoneConvertorPT = new PerformanceTimer();
		timeZoneConvertorPT.startTimer("SimpleViewDefInstruction.timeZoneConvertor");
		try
		{
			/**
			 * step 1 : Get the list column from the viewDefinition and check the time datatype column is available in
			 * the listview.
			 */
			String prefTimezoneFormat = (String) mapInputParams.get(TIConstants.USER_PREFEERENCE_TIMEZONE_FORMAT);
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			String serverTimeZone = configMgr.getSystemPrefDescriptor().getServerTimeZone();
			List colList = viewDefinition.getListColumns();
			GlobalPreferencesUtil gutil = new GlobalPreferencesUtil();
			ColumnDefinition colDef = null;
			for (Object colObject : colList)
			{
				colDef = (ColumnDefinition) colObject;
				if (ViewDefinitionConstants.DATA_TYPE_TIMESTAMP.equals(colDef.getDataType()))
				{
					logger.ctdebug("CTVDF00378", colDef.getColumnId());
					gutil.formatSourcetoDestTz((ArrayList<HashMap>) listViewData, colDef.getColumnId(),
							prefTimezoneFormat, serverTimeZone);
				}
			}

		} catch (Exception e)
		{
			logger.cterror("CTVDF00379", e);
		}
		timeZoneConvertorPT.endTimer();
	}

	/**
	 * This method forms the runtime sort definitions from the input params
	 * 
	 * @param mapInputParams The input params
	 * @param sm The sorting model
	 * @return
	 */
	public ArrayList<SortDefinition> getRuntimeSortDefinitions(HashMap mapInputParams, SortingModel sm)
	{
		logger.ctinfo("CTVDF00380");
		String sortField = sm.getSortField();
		String sortOrder = sm.getSortOrder();
		String uniqueSortField = sm.getUniqueSortField();
		String uniqueFieldSortOrder = sm.getUniqueFieldSortOrder();
		ArrayList<SortDefinition> listRuntimeSortDefinitions = null;
		logger.ctdebug("CTVDF00381", sortField, sortOrder);
		if (sortField == null || sortOrder == null || "".equals(sortField) || "".equals(sortOrder))
		{
			logger.ctdebug("CTVDF00382");
			logger.ctinfo("CTVDF00383");
			return listRuntimeSortDefinitions;
		}
		listRuntimeSortDefinitions = new ArrayList<SortDefinition>();
		SortDefinition sortDef = new SortDefinition();
		sortDef.setColumnID(sortField);
		sortDef.setSortOrder(sortOrder);
		sortDef.setActualColumnID(sm.getSortColumn());
		sortDef.setSortPosition(1);
		listRuntimeSortDefinitions.add(sortDef);

		if (uniqueSortField != null)
		{
			SortDefinition uniqueFieldSortDef = new SortDefinition();
			uniqueFieldSortDef.setColumnID(uniqueSortField);
			uniqueFieldSortDef.setSortOrder(uniqueFieldSortOrder);
			uniqueFieldSortDef.setSortPosition(2);
			uniqueFieldSortDef.setActualColumnID(sm.getUniqueSortColumn());
			listRuntimeSortDefinitions.add(uniqueFieldSortDef);
		}

		logger.ctinfo("CTVDF00383");
		return listRuntimeSortDefinitions;
	}

	public Date getMaximumDateForGlobalDateFilter(ViewDefinition viewDefinition, HashMap inputParams)
			throws ViewDefinitionException
	{
		return null;
	}

	/**
	 * This method is called from getViewData after the data has been fetched from the data source. This can be used by
	 * the sub classes to further massage / enrich the resultant data before the same is sent back to the client.
	 * 
	 * @param listViewData The data fetched from the data source
	 * @param viewDefinition The View definition
	 * @param mapInputParams The input params
	 * @return The processed response
	 * @exception ViewDefinitionException thrown if any error occurs while processing the response.
	 */
	protected HashMap processResponse(List listViewData, ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException
	{
		// The default implementation is to just return the data as it is.
		HashMap responseData = new HashMap();
		responseData.put(ViewDefinitionConstants.KEY_ALL_RECORDS, listViewData);
		int numRecords = retrieveTotalNumberOfRecords(listViewData, viewDefinition, mapInputParams);
		responseData.put(ViewDefinitionConstants.KEY_TOTAL_NUM_RECORDS, numRecords);
		Map<String, String> columnDisplayMap = retrieveColumnDisplayMap(listViewData, viewDefinition, mapInputParams);
		if (columnDisplayMap != null)
			responseData.put(ViewDefinitionConstants.KEY_MODIFIED_COLUMN_NAMES, columnDisplayMap);

		Map<String, String> additionalColumnData = retrieveAdditionalData(listViewData, viewDefinition, mapInputParams);
		if (additionalColumnData != null)
			responseData.put(ViewDefinitionConstants.ADDL_LIST_CONFIG, additionalColumnData);
		return responseData;
	}
	
	
	/**
	 * This method is for the developer to retrive the additional data that is required as part of records metadata .
	 * The Developer must take care of the resource bundle if needed.
	 * Currently the combobox column gets the value for rawkeys and rawvalues from this additionalvalue for the corresponding column.
	 * 
	 * 	HashMap addDataMap = new HashMap();
	 *  HashMap columnDataMap = new HashMap();
	 *  HashMap columnsDataMap = new HashMap();
	 *  
	 *  addDataMap.put("RAWKEYS", <<RAW_KEYS_LIST>>); 
	 *  addDataMap.put("RAWVALUES", <<RAW_VALUE_LIST>>);
	 *  
	 *  columnDataMap.put("DATA", addDataMap);
	 *  
	 *  columnsDataMap.put(<<COLUMN_ID>>,columnDataMap);
	 * 
	 * @param listViewData The data fetched from the data source
	 * @param viewDefinition The View definition
	 * @param mapInputParams The input params
	 * @return Map of columnId and its display name
	 */

	protected Map retrieveAdditionalData(List listViewData, ViewDefinition viewDefinition,
			HashMap mapInputParams)
	{
		return null;
	}


	/**
	 * This method is for the developer to update the column header displayname .
	 * 
	 * The Developer must take care of the resource bundle if needed.
	 * 
	 * @param listViewData The data fetched from the data source
	 * @param viewDefinition The View definition
	 * @param mapInputParams The input params
	 * @return Map of columnId and its display name
	 */

	protected Map<String, String> retrieveColumnDisplayMap(List listViewData, ViewDefinition viewDefinition,
			HashMap mapInputParams)
	{
		return null;
	}

	/**
	 * 
	 * @param listViewData The data fetched from the data source
	 * @param viewDefinition The View definition
	 * @param mapInputParams The input params
	 * @return The total number of records (not just the size of the current result set)
	 * @exception ViewDefinitionException thrown if any error occurs while processing the response.
	 */
	protected int retrieveTotalNumberOfRecords(List listViewData, ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException
	{
		int numRecords = 0;
		if (listViewData.size() > 0)
		{
			HashMap temp = (HashMap) listViewData.get(0);
			// Group list view TOTAL_COUNT will not be there
			if (temp.containsKey(ViewDefinitionConstants.HEADER_KEY_TOTAL_COUNT))
				if (temp.get(ViewDefinitionConstants.HEADER_KEY_TOTAL_COUNT) instanceof BigDecimal)
				{
					numRecords = Integer
							.valueOf(((BigDecimal) temp.get(ViewDefinitionConstants.HEADER_KEY_TOTAL_COUNT)).intValue());
				} else
				{
					numRecords = (Integer) temp.get(ViewDefinitionConstants.HEADER_KEY_TOTAL_COUNT);
				}

		}
		return numRecords;
	}

	/**
	 * This method should be implemented by the sub classes to provide the unique sort field name for this instruction
	 * 
	 * @return The unique sort field name for this view
	 */
	protected abstract String getUniqueSortFieldName();

	/**
	 * This method should be implemented by the sub classes to provide the sorting order for the unique sort field name.
	 * 
	 * @return The sort order for the unique sort field name
	 */
	protected abstract String getUniqueSortFieldOrder();

	/**
	 * This method provides the map of the sortable columns to the view definition columns
	 * 
	 * @return The map of the view definition columns to the actual sort columns.
	 */
	protected abstract HashMap<String, String> getSortColumnMap();

	/**
	 * This method should return true if this view on the client allows the user to change the sort condition /
	 * direction dynamically.
	 * 
	 * @return true if the runtime sorting is enabled. false otherwise.
	 */
	protected abstract boolean isRuntimeSortingEnabled();

	protected String getDataSource()
	{
		return DatabaseConstants.DEFAULT_DATASOURCE;
	}

	/**
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
	protected List fetchData(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel,
			ArrayList listFilters, ArrayList listSortDefinitions, DataEntitlements dataEntitlements)
			throws ViewDefinitionException
	{
		logger.ctdebug("CTVDF00813");
		List listViewData = null;

		// Step 1: Check if we even need to fetch the data.
		if (!isDataFetchRequired(viewDefinition))
			return listViewData;

		DatabaseRequest dbRequest = new DatabaseRequest();
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);

		/**
		 * added user defined sql param map id to be sent to the ibatis to fetch data as the user wants - karthik
		 */
		String sqlParamMapId = viewDefinition.getSqlParamMapID();
		sqlParamMapId = getUpdatedSqlParamMapId(sqlParamMapId, mapInputParams);
		logger.ctinfo("CTVDF00792", mapInputParams.get("INPUT_LANGUAGE_ID"));
		dbRequest.setOperationExtension(sqlParamMapId);
		logger.ctinfo("CTVDF00817", sqlParamMapId);
		// Prepare the list of filters / sorts to be sent

		/**
		 * Before adding the filters, provide a hook to the sub class to modify the filters. This is required to enable
		 * the sub class to handle any of the runtime filters in a different manner.
		 */
		alterFilters(dbRequest, listFilters, mapInputParams);
		dbRequest.addFilter(ViewDefinitionConstants.FLD_FILTERS, listFilters);
		dbRequest.addFilter(ViewDefinitionConstants.FLD_SORTFIELDS, listSortDefinitions);
		/**
		 * Added for Decoded columns sorting starts here
		 */
		dbRequest.addFilter(ViewDefinitionConstants.INPUT_LANGUAGE_ID, mapInputParams.get("INPUT_LANGUAGE_ID"));

		/**
		 * Add additional default filters for GCIF, User No, Product, Sub Product, Function
		 */
		dbRequest.addFilter(ViewDefinitionConstants.INPUT_GCIF, mapInputParams.get("INPUT_GCIF"));
		dbRequest.addFilter(ViewDefinitionConstants.INPUT_USER_NO, mapInputParams.get("INPUT_USER_NO"));
		dbRequest.addFilter(ViewDefinitionConstants.INPUT_USER_ROLE, mapInputParams.get("INPUT_USER_ROLE"));
		addDefaultEntitlementFilters(dbRequest, dataEntitlements, viewDefinition);

		/**
		 * get the data applying the filters and sort criterion
		 */
		HashMap mapViewSpecificFilter = getViewSpecificFilters(mapInputParams, dataEntitlements);

		logger.ctdebug("CTVDF00384", mapViewSpecificFilter);
		/**
		 * Add the generic view specific filters to the list of filters
		 */
		if (mapViewSpecificFilter != null && !mapViewSpecificFilter.isEmpty())
		{
			logger.ctdebug("CTVDF00385");
			Iterator<Map.Entry> allEntries = mapViewSpecificFilter.entrySet().iterator();
			Map.Entry anEntry;
			String sKey = null;
			Object objValue = null;
			while (allEntries.hasNext())
			{
				anEntry = allEntries.next();
				sKey = (String) anEntry.getKey();
				objValue = anEntry.getValue();
				logger.ctdebug("CTVDF00387", sKey, objValue);
				dbRequest.addFilter(sKey, objValue);
			}
		}
		if (pmModel != null)
		{
			logger.ctdebug("CTVDF00818");
			dbRequest.setPaginationModel(pmModel);
		}

		// Step 2: So we need to fetch the data. Check if this based on default data source.
		String dataSourceId = viewDefinition.getDataSrcId();
		logger.ctinfo("CTVDF00819", dataSourceId);
		boolean shouldExecuteDBRequest = true;
		try
		{
			if (!StringUtils.isEmpty(dataSourceId))
			{
				// Step 2.1: Check if we need to fetch data from MH.
				DynamicDatasourceManager mgr = new DynamicDatasourceManager();
				DynamicDatasourceManager.ConnectionType connType = mgr.getConnectionTypeForDataSource(dataSourceId);
				logger.ctinfo("CTVDF00820", connType);
				if (connType != DynamicDatasourceManager.ConnectionType.INTELLECT_MH)
				{
					// If the default view query construction is being triggered, then transfer the dynamic query
					// information onto the DB request
					if (ViewDefinitionConstants.DEFAULT_VIEW_DATA.equals(sqlParamMapId))
					{
						logger.ctdebug("CTVDF00821");
						Map dsData = mgr.getDynamicDataSourceData(dataSourceId, true);
						logger.ctinfo("CTVDF00822", dsData.toString());
						dbRequest.addFilter(ViewDefinitionConstants.FLD_COLUMN_IDS,
								dsData.get(ViewDefinitionConstants.FLD_COLUMN_IDS));
						dbRequest.addFilter(ViewDefinitionConstants.FLD_TABLE_NAMES,
								dsData.get(ViewDefinitionConstants.FLD_TABLE_NAMES));
						dbRequest.addFilter(ViewDefinitionConstants.FLD_GROUPBY_COLUMN_IDS,
								dsData.get(ViewDefinitionConstants.FLD_GROUPBY_COLUMN_IDS));
						dbRequest.addFilter(ViewDefinitionConstants.FLD_ORDERBY_COLUMN_IDS,
								dsData.get(ViewDefinitionConstants.FLD_ORDERBY_COLUMN_IDS));
						dbRequest.addFilter(ViewDefinitionConstants.FLD_WHERE_CLAUSE,
								dsData.get(ViewDefinitionConstants.FLD_WHERE_CLAUSE));
						String[] orderByCols = StringUtils.split(
								(String) dsData.get(ViewDefinitionConstants.FLD_ORDERBY_COLUMN_IDS), ",");
						SortDefinition sortDef;
						int i = orderByCols.length;
						for (String aCol : orderByCols)
						{
							i=i-1;
							sortDef = new SortDefinition();
							sortDef.setColumnID(aCol);
							sortDef.setSortOrder("ASC");
							sortDef.setActualColumnID(aCol);
							sortDef.setSortPosition(i);
							listSortDefinitions.add(i, sortDef);
						}
						// Last and the most important one, ensure that the data source is set to the data source id.
						dbRequest.setDataSource(dataSourceId);
					}
				} else
				{
					shouldExecuteDBRequest = false;
					logger.ctdebug("CTVDF00823");
					listViewData = fetchDataFromMH(viewDefinition, mapInputParams, pmModel, listFilters,
							listSortDefinitions, dbRequest);
					logger.ctinfo("CTVDF00824", listViewData);
				}
			}
			if (shouldExecuteDBRequest)
			{
				dbRequest.setDataSource(getDataSource());  // will tak data sources from implementation view instruction class.
				listViewData = dbRequest.execute().getReturnedList();
				logger.ctinfo("CTVDF00825", listViewData);
			}
		} catch (DatabaseException dbExcep)
		{
			logger.cterror("CTVDF00386", dbExcep, viewDefinition.getViewId());
			throw new ViewDefinitionException(dbExcep);
		}
		return listViewData;
	}

	/**
	 * Helper method that fetches the data for the view by invoking the REST service of MH. Here all the filters, sorts,
	 * etc are converted into proper serialized parameters sent to MH for translating into the server query
	 * 
	 * @param viewDefinition The view definition for which this request for data is placed
	 * @param mapInputParams The input parameters
	 * @param pmModel The Pagination model
	 * @param listFilters The list of dynamic filters
	 * @param listSortDefinitions The list of sort conditions
	 * @param dbRequest The database request that was prepared
	 * @return The list of records
	 * @throws ViewDefinitionException Thrown if any error occurs while querying the database
	 */
	private List fetchDataFromMH(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel,
			ArrayList listFilters, ArrayList listSortDefinitions, DatabaseRequest dbRequest)
			throws ViewDefinitionException
	{
		List listViewData = null;
		Map<String, Object> aRowData;
		DynamicDatasourceManager mgr = new DynamicDatasourceManager();
		try
		{
			logger.ctdebug("CTVDF00826");
			Map dataSourceDetails = mgr.getDynamicDataSourceData(viewDefinition.getDataSrcId(), true);
			logger.ctinfo("CTVDF00827", dataSourceDetails.toString());
			String connectionId = (String) dataSourceDetails.get("CONNECTION_ID");
			Map connectionDetails = mgr.getDynamicConnectionData(connectionId, true);
			logger.ctinfo("CTVDF00828", connectionDetails.toString());
			String wsURL = (String) connectionDetails.get("WS_URL");
			String wsToken = (String) connectionDetails.get("WS_TOKEN");
			String wsTransCode = (String) connectionDetails.get("WS_TRANS_CODE");
			String wsinputParams = (String) connectionDetails.get("INPUT_PARAMS");

			// Build the REST URL request.
			ListViewUtil utils = new ListViewUtil();
			JSONObject requestData = utils.convertDBRequestToJSONRequest(dbRequest);
			requestData.put("WS_TOKEN", wsToken);
			requestData.put("TRAN_ID", wsTransCode);
			requestData.put("PARAMS", utils.convertUserInputParamsToJSON(wsinputParams));

			// Initialize the URL request
			ClientConfig config = new DefaultClientConfig();
			Client client = Client.create(config);
			WebResource service = client.resource(wsURL);
			logger.ctinfo("CTVDF00829", requestData.toString());
			// Trigger the call
			ClientResponse response = service.accept(MediaType.APPLICATION_JSON_TYPE).post(ClientResponse.class,
					requestData.toString());
			dbRequest.setDataSource(getDataSource()); // get datasource form instruction class if they provided

			// Extract the response. The response is expected to be in the below format - 
			// { "RESPONSE" : {
			//			"HEADER" : { "TOTAL_COUNT" : "1" },
			//			"DATA" : [ {"FIELD1" : "VALUE1", "FIELD2", VALUE2"}, {}, {} ]
			// 		} 
			// }
			String resData = response.getEntity(String.class);
			logger.ctinfo("CTVDF00830", resData);
			JSONObject jobj = new JSONObject(resData);
			JSONArray jarr = jobj.getJSONObject("RESPONSE").getJSONArray("DATA");
			JSONObject headers = jobj.getJSONObject("RESPONSE").getJSONObject("HEADER");
			int numRecords;
			if (StringUtils.isEmpty(headers.getString("TOTAL_COUNT")))
				numRecords = jarr.length();
			else
				numRecords = Integer.valueOf(headers.getString("TOTAL_COUNT"));
			// Convert the array into a List of Map.
			listViewData = new ArrayList<Map<String, Object>>();
			String keys[];
			JSONObject aRow;
			for (int i = 0; i < jarr.length(); i++)
			{
				aRowData = new HashMap<String, Object>();
				aRow = jarr.getJSONObject(i);
				keys = JSONObject.getNames(aRow);
				for (String aKey : keys)
				{
					aRowData.put(aKey, aRow.get(aKey));
				}
				aRowData.put("TOTAL_COUNT", numRecords);
				listViewData.add(aRowData);
			}
			logger.ctinfo("CTVDF00831", listViewData);
		} catch (DatabaseException ex)
		{
			logger.cterror("CTVDF00816", ex, viewDefinition.getViewId(), viewDefinition.getDataSrcId());
			throw new ViewDefinitionException(ex);
		} catch (JSONException je)
		{
			logger.cterror("CTVDF00816", je, viewDefinition.getViewId(), viewDefinition.getDataSrcId());
			throw new ViewDefinitionException(je);
		}
		logger.ctdebug("CTVDF00832");
		return listViewData;
	}

	/**
	 * This is a helper method that checks where data fetch is required. This is done based on the View type
	 * 
	 * @param viewDefinition The View definition for the view to which this instruction is associated
	 * @return true, if data fetch is required. false otherwise
	 */
	private boolean isDataFetchRequired(ViewDefinition viewDefinition)
	{
		logger.ctdebug("CTVDF00833");
		List<String> notRequiredViewTypes = new ArrayList<String>();
		notRequiredViewTypes.add("IFRAME");
		notRequiredViewTypes.add("ADS");
		notRequiredViewTypes.add("FORM");
		notRequiredViewTypes.add("EMPTY");
		notRequiredViewTypes.add("APP");
		logger.ctdebug("CTVDF00834");
		return !notRequiredViewTypes.contains(viewDefinition.getViewType());
	}

	/***
	 * This method adds default entitlement filters to the Viewdefinition request
	 * 
	 * @param dbRequest
	 * @param entitlementData
	 * @param viewDefinition
	 */
	private void addDefaultEntitlementFilters(DatabaseRequest dbRequest, DataEntitlements entitlementData,
			ViewDefinition viewDefinition)
	{
		/**
		 * Start: Changes done for Passing entitlement parameteres by defualt to the query layer
		 * 
		 */
		// Check if there is a column by name CRITERIA_VALUE in Viewdefinition. If yes, then entitlement to be added
		// against that column.
		ColumnDefinition critColumn = viewDefinition.getColumnDefnForColumn("CRITERIA_VALUE");
		String entitlementEnabled = (critColumn == null) ? "N" : "Y";

		dbRequest.addFilter("CT_ENTIL_ENABLED", entitlementEnabled);
		dbRequest.addFilter("CT_INPUT_PRODUCT", viewDefinition.getProduct());
		dbRequest.addFilter("CT_INPUT_SUB_PRODUCT", viewDefinition.getSubProduct());
		dbRequest.addFilter("CT_INPUT_FUNCTION_CODE", viewDefinition.getFunctionCode());

		/**
		 * : Changes done for Passing entitlement parameteres by defualt to the query layer
		 */
	}

	/**
	 * This is the method need to be overridden by the developer to modify the sqlparamMap id based on the requestParams
	 * 
	 * @return Column Name - String
	 */
	protected String getUpdatedSqlParamMapId(String sqlParamaMapId, HashMap mapInputParams)
	{
		return sqlParamaMapId;
	}

	/**
	 * This is the method need to be overridden by the developer to give the uniqueSorting Column Name
	 * 
	 * @return Column Name - String
	 */
	protected String getUniqueSortColumnName()
	{
		return null;
	}

	/**
	 * This is a helper method to process runtime sort definitions and return the same as a list of Sort definitions
	 * 
	 * @param mapInputParams The input params
	 * @param viewDefinition The view definition
	 * @param sortColumnMap The sort column map
	 * @param uniqueSortField The unique sort field
	 * @param uniqueFieldSortOrder The unique sort order
	 * @return The list of sort definitions.
	 */
	protected ArrayList<SortDefinition> processRuntimeSortDefinitions(HashMap mapInputParams,
			ViewDefinition viewDefinition, HashMap<String, String> sortColumnMap, String uniqueSortField,
			String uniqueFieldSortOrder)
	{
		logger.ctinfo("CTVDF00388");
		ArrayList listSortDefinitions = null;
		ArrayList<SortDefinition> listRuntimeSortDefns = null;
		String strDefaultSortCol;
		String strDefaultSortOrder;
		String sortField = (String) mapInputParams.get(ViewDefinitionConstants.SORT_FIELD);

		if (sortField != null && !"".equals(sortField))
		{
			listSortDefinitions = viewDefinition.getOrderedSortDefinition();
			logger.ctdebug("CTVDF00389", listSortDefinitions);
			if (isRuntimeSortingEnabled())
			{
				// As SortDefinition is not there in the individual instruction
				// class ans hence SortingModel is
				// being created in the Base View definition base instruction
				// class : SimpleViewDefinitionInstruction
				if (listSortDefinitions != null && !listSortDefinitions.isEmpty())
				{
					strDefaultSortCol = ((SortDefinition) listSortDefinitions.get(0)).getColumnID();
					strDefaultSortOrder = ((SortDefinition) listSortDefinitions.get(0)).getSortOrder();
					logger.ctdebug("CTVDF00390", strDefaultSortCol, strDefaultSortOrder);

					String uniqueSortColumnName = getUniqueSortColumnName();

					if (null == uniqueSortColumnName)
					{
						uniqueSortColumnName = uniqueSortField;
					}

					SortingModel sortModel = new SortingModel(mapInputParams, strDefaultSortCol, strDefaultSortOrder,
							sortColumnMap, uniqueSortField, uniqueFieldSortOrder, uniqueSortColumnName);

					logger.ctdebug("CTVDF00391", sortModel);
					listRuntimeSortDefns = getRuntimeSortDefinitions(mapInputParams, sortModel);
				}
			} else
			{
				// If there are no runtime sort definitions, then use the
				// default sort order as identified from the view
				// definition.
				listRuntimeSortDefns = listSortDefinitions;
			}
		}
		logger.ctinfo("CTVDF00392");
		return listRuntimeSortDefns;
	}

	/**
	 * ref to HashMap FetchDataQuery view
	 * 
	 * @param viewDefinition
	 * @return
	 */
	private HashMap fetchDataQueryForView(String viewId)
	{
		logger.ctdebug("CTVDF00810");
		HashMap resultMap = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			resultMap = new HashMap();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.FETCH_DATA_QUERY_FOR_VIEW);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, viewId);
			dbResult = dbRequest.execute();
			if (dbResult.getReturnedList().size() > 0)
			{
				resultMap = ((HashMap) dbResult.getReturnedList().get(0));
			}
		} catch (DatabaseException e)
		{
			logger.cterror("CTVDF00811", e);
		}
		logger.ctdebug("CTVDF00812");
		return resultMap;
	}

	
	
	
	private static Logger logger = Logger.getLogger(SimpleViewDefinitionInstruction.class);

}
