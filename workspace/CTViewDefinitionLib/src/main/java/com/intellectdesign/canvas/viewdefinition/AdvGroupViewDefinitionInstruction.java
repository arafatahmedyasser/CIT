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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import com.intellectdesign.canvas.cache.CBXCacheException;
import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONToHashMapConverter;
import com.intellectdesign.canvas.data.conversion.util.OnlineJSONToHashmapConverter;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.exceptions.util.JSONConvertorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;
import com.intellectdesign.canvas.viewdefinition.cache.VDFEhCacheManager;
import com.intellectdesign.canvas.viewdefinition.instruction.ListViewsInstruction;

/**
 * This class is for advanced group view definition instruction extends list view instruction
 * 
 * @version 1.0
 */
public abstract class AdvGroupViewDefinitionInstruction extends ListViewsInstruction
{

	/**
	 * 
	 * ref to AdvGroupViewDefinitionInstruction to List Views
	 * 
	 * @see com.intellectdesign.cib.viewdefinition.SimpleViewDefinitionInstruction#getViewData
	 *      (com.intellectdesign.cib.viewdefinition.ViewDefinition, java.util.HashMap, com.intellectdesign.cib.database.PaginationModel,
	 *      java.util.HashMap, java.lang.String, java.lang.String)
	 */
	/**
	 * ref to HashMap to View Data
	 * 
	 * @param viewDefinition
	 * @param mapInputParams
	 * @param pmModel
	 * @param SortColMap
	 * @param sUniqueSortField
	 * @param sUniqueFieldSortOrder
	 * @return
	 * @throws ViewDefinitionException
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getViewData(com.intellectdesign.canvas.viewdefinition.ViewDefinition,
	 *      java.util.HashMap, com.intellectdesign.canvas.database.PaginationModel, java.util.HashMap, java.lang.String,
	 *      java.lang.String)
	 */
	@Override
	public HashMap getViewData(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel,
			HashMap<String, String> SortColMap, String sUniqueSortField, String sUniqueFieldSortOrder)
			throws ViewDefinitionException
	{
		ArrayList listRuntimeFilters = null;
		ArrayList listRuntimeSortDefns = null;
		ArrayList listFilters = null;
		HashMap total = null;
		ArrayList listViewFilters = null;
		ArrayList listSortDefinitions = null;
		List listViewData = null;
		DataEntitlements dataEntitlements = null;

		logger.ctinfo("CTVDF00328");
		dataEntitlements = retrieveEntitlements(viewDefinition, mapInputParams);

		if (dataEntitlements != null && dataEntitlements.isEntitled())
		{
			if (!mapInputParams.containsValue("CLEAR_FILTER_ACTIVE"))
			{
				listRuntimeFilters = getRuntimeFilters(mapInputParams, viewDefinition);
				listViewFilters = viewDefinition.getListFilters();
			}
			listRuntimeSortDefns = processRuntimeSortDefinitions(mapInputParams, viewDefinition, SortColMap,
					sUniqueSortField, sUniqueFieldSortOrder);

			logger.ctdebug("CTVDF00329", listViewFilters, listRuntimeFilters, listRuntimeSortDefns);
			listFilters = new ArrayList();
			if (listRuntimeFilters != null && !listRuntimeFilters.isEmpty())
			{
				listFilters.addAll(listRuntimeFilters);
			}
			if (listViewFilters != null && !viewDefinition.isOverriddenView())
			{
				listFilters.addAll(listViewFilters);
			}
			if (listRuntimeSortDefns != null && !listRuntimeSortDefns.isEmpty())
			{
				listSortDefinitions = listRuntimeSortDefns;
			} else
			{
				listSortDefinitions = viewDefinition.getOrderedSortDefinition();
			}

			/**
			 * To Update the listFilters with the filterId So that cache filters according to the filter id
			 */
			try
			{

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

				GroupingModel groupingModel = viewDefinition.getGroupingModel();

				if (mapInputParams.get("GROUPS") != null)
				{
					JSONToHashMapConverter converter = new OnlineJSONToHashmapConverter(
							CTProperties.getProperty(ViewDefinitionConstants.DATE_FORMAT_DDMM_YYYY));

					HashMap<String, Object> userSelGrp = converter.convert((String) mapInputParams.get("GROUPS"));

					List grpColumns = (List) userSelGrp.get("COLUMN_IDS");
					ColumnDefinition colDef = null;
					String columnID;
					List groupedColumns = new ArrayList<ColumnDefinition>();

					for (int k = 0; k < grpColumns.size(); k++)
					{
						columnID = (String) grpColumns.get(k);
						colDef = viewDefinition.getColumnDefnForColumn(columnID);
						groupedColumns.add(colDef);
					}

					groupingModel.setGroupedColumn(groupedColumns);
				}

				logger.ctinfo("CTVDF00330", groupingModel);

				logger.ctinfo("CTVDF00331", listFilters, listSortDefinitions);

				VDFEhCacheManager cacheManager = (VDFEhCacheManager) VDFEhCacheManager.createInstance();
				EhCacheDataUtil cacheUtil = new EhCacheDataUtil();
				String gcif = (String)mapInputParams.get("INPUT_GCIF");
				String userNo = (String)mapInputParams.get("INPUT_USER_NO");
				if ("change".equalsIgnoreCase((String) mapInputParams.get("EQUCURR"))
						|| ViewDefinitionConstants.VAL_BOOL_YES.equalsIgnoreCase((String) mapInputParams
								.get(ViewDefinitionConstants.REFRESH_DATA))
						|| ViewDefinitionConstants.VAL_BOOL_TRUE.equalsIgnoreCase((String) mapInputParams
								.get(ViewDefinitionConstants.IS_LOOK_UP))
						|| ViewDefinitionConstants.VAL_BOOL_TRUE.equalsIgnoreCase((String) mapInputParams
								.get(ViewDefinitionConstants.IS_DATE_FILTER_FORM)))
				{
					cacheUtil.resetCache((String) mapInputParams.get(ViewDefinitionConstants.INPUT_SESSION_ID),
							(String) mapInputParams.get("PARAM_WIDGET_ID"), viewDefinition.getViewId(), userNo, gcif);
				}
				String key = cacheUtil.fetchCacheId(
						(String) mapInputParams.get(ViewDefinitionConstants.INPUT_SESSION_ID),
						(String) mapInputParams.get("PARAM_WIDGET_ID"), viewDefinition.getViewId(), userNo, gcif);

				logger.ctinfo("CTVDF00332", key);

				if (!cacheManager.isCacheAvailable(key))
				{

					listViewData = fetchData(viewDefinition, mapInputParams, null, new ArrayList(),
							listSortDefinitions, dataEntitlements);

					HashMap inputConfig = new HashMap();
					inputConfig.put(CacheConstants.VIEW_COLUMN_DEFINITION, viewDefinition.getListColumns());
					cacheManager.initializeCache(key, inputConfig);
					cacheManager.setDataInCache(key, listViewData);
				}

				if (ViewDefinitionConstants.CHILDDATA.equals(mapInputParams.get(ViewDefinitionConstants.DATA_REQ_TYPE)))
				{
					JSONToHashMapConverter converter = new OnlineJSONToHashmapConverter(
							CTProperties.getProperty(ViewDefinitionConstants.DATE_FORMAT_DDMM_YYYY));

					HashMap<String, Object> grpFilters = converter.convert((String) mapInputParams
							.get(ViewDefinitionConstants.GROUP_FILTERS));

					ColumnFilter colFilter = null;
					ArrayList filterValue = null;
					for (String columnId : grpFilters.keySet())
					{
						colFilter = new ColumnFilter();
						colFilter.setColumnID(columnId);
						colFilter.setDataType(ViewDefinitionConstants.STR);
						colFilter.setFilterID(ViewDefinitionConstants.STR_EQUALS);
						filterValue = new ArrayList();
						filterValue.add(grpFilters.get(columnId));
						logger.ctinfo("CTVDF00333", filterValue);
						colFilter.setFilterValues(filterValue);
						listFilters.add(colFilter);
					}

					listViewData = cacheManager.fetchDataFromCache(key, pmModel, listSortDefinitions, listFilters);

				} else if (ViewDefinitionConstants.GRPDATA.equals(mapInputParams
						.get(ViewDefinitionConstants.DATA_REQ_TYPE)))
				{

					listViewData = cacheManager.fetchDataFromCache(key, pmModel, listSortDefinitions, listFilters,
							(GroupingModel) groupingModel.clone());

					total = (HashMap) listViewData.get(listViewData.size() - 1);

					listViewData = responseBuilder(listViewData, groupingModel.getGroupedColumn());

				} else
				{
					listViewData = cacheManager.fetchDataFromCache(key, pmModel, listSortDefinitions, listFilters);
				}

			} catch (CBXCacheException e)
			{
				logger.cterror("CTVDF00334", e, viewDefinition.getViewId());
				throw new ViewDefinitionException(e);
			} catch (CloneNotSupportedException e)
			{

				logger.cterror("CTVDF00334", e, viewDefinition.getViewId());
				throw new ViewDefinitionException(e);
			} catch (JSONConvertorException e)
			{

				logger.cterror("CTVDF00334", e, viewDefinition.getViewId());
				throw new ViewDefinitionException(e);
			}
		} else
		{
			listViewData = new ArrayList();
			logger.ctinfo("CTVDF00335", dataEntitlements);
		}

		// Provide a hook to the sub classes to tweak the response.
		performFormatting(listViewData, viewDefinition, mapInputParams);

		HashMap responseData = processResponse(listViewData, viewDefinition, mapInputParams);

		responseData.put(ViewDefinitionConstants.GRAND_TOTAL_DATA, total);
		logger.ctinfo("CTVDF00336", responseData);
		logger.ctinfo("CTVDF00337");
		return responseData;

	}

	/**
	 * ref to List responseBuilder Input: An ArrayList containing HashMaps. The keys for the hashmap is generated based
	 * on the number of columns which has to be grouped. For example,if grouping is done on three columns,say
	 * groupBy(3),then 4 keys are generated. The first key is for the {first} column,second key for {first,second}
	 * column and the third key for {first,second,third} column and the fourth key called 'Total'. All these keys holds
	 * an ArrayList of values. A ListIterator is created for traversing through the list of values. Initially this
	 * Iterator points to the first row in the first key. Records in the second key that matches with the first row of
	 * the first key are fetched and added as a child for it. This functionality is called recursively which fetches all
	 * the childs and it is put as a seperate arrayList. This set of arrayList is sent as response to the method.
	 * 
	 * @param List finalArray
	 * @param List groupingColumn
	 * @return response List
	 */
	private static List responseBuilder(List finalArray, List groupingColumn)
	{

		int gpSize = groupingColumn.size();
		ArrayList keys = new ArrayList();
		ArrayList iteratorKeyList = new ArrayList();
		ArrayList processList = null;
		ArrayList response = new ArrayList();
		HashMap processMap = null;
		ListIterator<Object> inputArrayList = finalArray.listIterator();

		ListIterator currentIterator = null;

		for (int i = 0; i < gpSize; i++)
		{
			String key = "";
			for (int j = 0; j <= i; j++)
			{
				if (!"".equals(key))
				{
					key = key.concat(ViewDefinitionConstants.KEYDELIMITER);
				}
				key = key.concat(((ColumnDefinition) groupingColumn.get(j)).getColumnId());
			}

			for (; inputArrayList.hasNext();)
			{
				processMap = (HashMap) inputArrayList.next();
				processList = (ArrayList) processMap.get(key);
				if (processList != null && !processList.isEmpty())
				{
					iteratorKeyList.add(processList.listIterator());
					break;
				}
			}
			inputArrayList = finalArray.listIterator();
			keys.add(key);
		}

		int pointer = 0;
		HashMap record = null;
		HashMap tempMap = null;
		ArrayList child = null;
		if ((!iteratorKeyList.isEmpty()) && iteratorKeyList.size() > 0)
		{
			currentIterator = (ListIterator) iteratorKeyList.get(pointer);
			ArrayList filterData = new ArrayList();
			for (; currentIterator.hasNext();)
			{
				filterData = new ArrayList();
				record = (HashMap) currentIterator.next();
				tempMap = new HashMap();
				tempMap.put(ViewDefinitionConstants.GRP_HEADER, keys.get(0)
						+ ViewDefinitionConstants.GRPHEADERDELIMITER + record.get(keys.get(0)));
				tempMap.putAll((Map) record.get(ViewDefinitionConstants.AGGREGATION));
				child = new ArrayList();
				tempMap.put(ViewDefinitionConstants.CHILD, child);
				response.add(tempMap);
				filterData.add(record.get(keys.get(0)));
				childResponseBuilder(child, filterData, iteratorKeyList, keys, pointer + 1);
			}
		}
		return response;
	}

	/**
	 * ref to childResponseBuilder to ArrayList
	 * 
	 * @param outputList
	 * @param filterData
	 * @param iteratorKeyList
	 * @param keys
	 * @param pointer
	 */

	private static void childResponseBuilder(ArrayList outputList, ArrayList filterData, ArrayList iteratorKeyList,
			ArrayList keys, int pointer)
	{

		if (iteratorKeyList.size() < pointer)
		{
			return;
		}
		ListIterator currentIterator = (ListIterator) iteratorKeyList.get(pointer);
		HashMap record = null;
		boolean satisfy = true;
		String key = "";
		String keyArray[];
		ListIterator<Object> inputArrayList = null;
		HashMap tempMap = null;
		String tkey = "";
		String tkeyArray[];
		ArrayList child = null;

		ArrayList newFilterData = new ArrayList();
		for (; currentIterator.hasNext();)
		{
			newFilterData = new ArrayList();
			record = (HashMap) currentIterator.next();
			satisfy = true;
			inputArrayList = filterData.listIterator();
			key = (String) keys.get(pointer - 1);
			keyArray = key.split(ViewDefinitionConstants.KEYDELIMITER);
			for (int index = 0; index < keyArray.length && inputArrayList.hasNext(); index++)
			{
				String nextValue = (String) inputArrayList.next();
				if (keyArray != null && keyArray[index] != null && nextValue != null)
					satisfy = satisfy && (nextValue.equals(record.get(keyArray[index])));
			}
			if (satisfy)
			{

				tempMap = new HashMap();
				tkey = (String) keys.get(pointer);
				tkeyArray = tkey.split(ViewDefinitionConstants.KEYDELIMITER);
				tempMap.put(ViewDefinitionConstants.GRP_HEADER, tkeyArray[pointer]
						+ ViewDefinitionConstants.GRPHEADERDELIMITER + record.get(tkeyArray[pointer]));
				tempMap.putAll((Map) record.get(ViewDefinitionConstants.AGGREGATION));

				if (keys.size() - 1 > pointer)
				{
					newFilterData = (ArrayList) filterData.clone();
					newFilterData.add(record.get(tkeyArray[pointer]));
					child = new ArrayList();
					tempMap.put(ViewDefinitionConstants.CHILD, child);
					outputList.add(tempMap);
					childResponseBuilder(child, newFilterData, iteratorKeyList, keys, pointer + 1);
				} else
				{
					tempMap.put(ViewDefinitionConstants.IS_LEAF, true);
					outputList.add(tempMap);
				}
			} else
			{
				currentIterator.previous();
				return;
			}
		}
	}

	private static Logger logger = Logger.getLogger(AdvGroupViewDefinitionInstruction.class);

}
