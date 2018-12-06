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

package com.intellectdesign.canvas.viewdefinition.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.util.Collections;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.pref.amount.AmountFormatterManager;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.viewdefinition.ColumnFilter;
import com.intellectdesign.canvas.viewdefinition.SortDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewManager;

/**
 * This class is for list view uti. l
 * 
 * @version 1.0
 */
public class ListViewUtil
{
	/**
	 * Method to return resultmap with formatted amount columns based on preferences as the resultmap from the database
	 * contains only unformatted data
	 * 
	 * @param resultMap,String toFormat
	 */
	public HashMap addFormattedColumns(HashMap resultMap, String toFormat)
	{
		Iterator mapIterator = null;
		Map recordMap = null;

		String columnKey = null;
		Iterator listIterator = null;
		Iterator tempIterator = null;
		List recordList = null;
		String convertedValue = null;
		String tempConvertedValue = null;
		String key = null;
		String tempKey = null;
		Map tempMap = null;
		try
		{
			recordList = (ArrayList) resultMap.get("ALL_RECORDS");
			if (recordList != null && recordList.size() > 0)
			{
				listIterator = recordList.iterator();
				/**
				 * All the records will be in the resultMap will be with a key ALL_RECORDS as a List. The List will
				 * contain multiple hashmaps each contain single record. Iterating the records to get each hashmap
				 */
				while (listIterator.hasNext())
				{
					/**
					 * Getting the hashmaps one by one from the list
					 */
					recordMap = (HashMap) listIterator.next();
					tempMap = new HashMap();
					/**
					 * Iterating thru the map to get keys so that amount columns will end with _AMT so for those columns
					 * amount will be passed as a parameter to convertAmountTo method of JSPUtil to get back the
					 * formatted value
					 */
					mapIterator = recordMap.keySet().iterator();
					/**
					 * Iterating thru the map to get each key within the map to format the value if its an amount column
					 */
					while (mapIterator.hasNext())
					{
						columnKey = (String) mapIterator.next();
						/**
						 * Checking whether the key is an amount column or not as amount column will always will ends
						 * with _AMT
						 */
						if (columnKey.endsWith("_AMT"))
						{
							if (recordMap.get(columnKey) instanceof String){
							/**
							 * Calling utility method to get the formatted value
							 */
							convertedValue = AmountFormatterManager.convertAmountTo((String) recordMap.get(columnKey), toFormat, 3); // QA_401
							key = columnKey + "_FORMAT";
							/**
							 * Putting the key and convertedValue into temporary hashmap to add it to recordMap outside
							 * the loop
							 */
								tempMap.put(key, convertedValue);
							}
							else {
								tempMap.put(columnKey, recordMap.get(columnKey));
							}
						}
					}
					/**
					 * Adding the formatted values back into recordMap
					 */
					tempIterator = tempMap.keySet().iterator();
					while (tempIterator.hasNext())
					{
						tempKey = (String) tempIterator.next();
						tempConvertedValue = (String) tempMap.get(tempKey);
						/**
						 * Adding back the key and the formatted value into HashMap
						 */
						recordMap.put(tempKey, tempConvertedValue);
					}
				}
			}

		} catch (NullPointerException ex)
		{
			logger.cterror("CTVDF00314", ex, ex.getMessage());
		}
		return resultMap;
	}

	/**
	 * this is ref to Hashmap to Replaced Formatted Record
	 * 
	 * @param reultmap,sting fromkey,Sting replaceKey
	 */
	public HashMap replaceKeyFormatted(HashMap resultMap, String fromKey, String replaceKey)
	{
		Iterator mapIterator = null;
		Map recordMap = null;
		String columnKey = null;
		Iterator listIterator = null;
		List recordList = null;
		String value = null;

		ArrayList tempList = null;
		try
		{
			recordList = (ArrayList) resultMap.get("ALL_RECORDS");
			if (recordList != null && recordList.size() > 0)
			{
				tempList = new ArrayList(recordList.size());
				listIterator = recordList.iterator();
				/**
				 * All the records will be in the resultMap will be with a key ALL_RECORDS as a List. The List will
				 * contain multiple hashmaps each contain single record. Iterating the records to get each hashmap
				 */
				while (listIterator.hasNext())
				{
					/**
					 * Getting the hashmaps one by one from the list
					 */
					recordMap = (HashMap) listIterator.next();
					mapIterator = recordMap.keySet().iterator();
					while (mapIterator.hasNext())
					{
						columnKey = (String) mapIterator.next();
						if (columnKey.equalsIgnoreCase(fromKey))
						{
							value = (String) recordMap.get(replaceKey);
							recordMap.put(columnKey, value);
							break;
						}
					}
					tempList.add(recordMap);
				}
				resultMap.put("ALL_RECORDS", tempList);
			}

		} catch (NullPointerException ex)
		{
			logger.cterror("CTVDF00314", ex, ex.getMessage());
		} catch (Exception e)
		{
			logger.cterror("CTVDF00314", e, e.getMessage());
		}
		return resultMap;
	}
	/**
	 * method ref to ViewDEFDataField
	 * 
	 * @param sViewId
	 * @param sColumnId
	 * @return
	 */
	public boolean isDateField(String sViewId, String sColumnId)
	{
		ViewDefinition viewdefition = null;
		ViewManager vwManager = null;
		try
		{
			vwManager = new ViewManager();
			viewdefition = vwManager.getViewDefinition(sViewId);
			if (ViewDefinitionConstants.COLUMN_TYPE_DATE_ONLY.equals(viewdefition.getColumnDefnForColumn(sColumnId)
					.getDataType()))
			{
				return true;
			}
		} catch (ViewDefinitionException e)
		{
			logger.cterror("CTVDF00314", e, e.getMessage());
		}

		return false;
	}

	/**
	 * method ref to viewDef timeField
	 * 
	 * @param sViewId
	 * @param sColumnId
	 * @return
	 */
	public boolean isTimeField(String sViewId, String sColumnId)
	{
		ViewDefinition viewdefition = null;
		ViewManager vwManager = null;
		try
		{
			vwManager = new ViewManager();
			viewdefition = vwManager.getViewDefinition(sViewId);
			if (ViewDefinitionConstants.COLUMN_TYPE_DATE_TIME.equals(viewdefition.getColumnDefnForColumn(sColumnId)
					.getDataType()))
			{
				return true;
			}
		} catch (ViewDefinitionException e)
		{
			logger.cterror("CTVDF00314", e, e.getMessage());
		}

		return false;
	}

	/**
	 * this is ref to ViewDefition NumberField
	 * 
	 * @param sViewId
	 * @param sColumnId
	 * @return
	 */
	public boolean isNumberField(String sViewId, String sColumnId)
	{
		ViewDefinition viewdefition = null;
		ViewManager vwManager = null;
		try
		{
			vwManager = new ViewManager();
			viewdefition = vwManager.getViewDefinition(sViewId);
			String dataType = viewdefition.getColumnDefnForColumn(sColumnId).getDataType();
			if (ViewDefinitionConstants.COLUMN_TYPE_NUMBER.equals(dataType)
					|| ViewDefinitionConstants.COLUMN_TYPE_PERCENTAGE.equals(dataType) || "numeric".equals(dataType)
					|| ViewDefinitionConstants.COLUMN_TYPE_AMOUNT.equals(dataType))
			{
				return true;
			}
		} catch (ViewDefinitionException e)
		{
			logger.cterror("CTVDF00314", e, e.getMessage());
		}

		return false;
	}

	/**
	 * Helper method to check whether the filter type is rate type.
	 * 
	 * @param mapData
	 * @return
	 */
	public boolean isRateField(String sViewId, String sColumnId)
	{
		ViewDefinition viewdefition = null;
		ViewManager vwManager = null;
		try
		{
			vwManager = new ViewManager();
			viewdefition = vwManager.getViewDefinition(sViewId);
			if (ViewDefinitionConstants.COLUMN_TYPE_RATE.equals(viewdefition.getColumnDefnForColumn(sColumnId)
					.getDataType()))
			{
				return true;
			}
		} catch (ViewDefinitionException e)
		{
			logger.cterror("CTVDF00314", e, e.getMessage());
		}

		return false;
	}
	
	/**
	 * Helper method to check whether the filter type is rate type.
	 * 
	 * @param mapData
	 * @return
	 */
	public boolean isTransalateValueField(String sViewId, String sColumnId)
	{
		ViewDefinition viewdefition = null;
		ViewManager vwManager = null;
		try
		{
			vwManager = new ViewManager();
			viewdefition = vwManager.getViewDefinition(sViewId);
			if (ViewDefinitionConstants.COLUMN_TYPE_TRANSLATED_VALUE.equals(viewdefition.getColumnDefnForColumn(sColumnId).getDataType()))
			{
				return true;
			}
		} catch (ViewDefinitionException e)
		{
			logger.cterror("CTVDF00314", e, e.getMessage());
		}

		return false;
	}
	

	/**
	 * Returns the date in new format.
	 * 
	 * @param sDate
	 * @param sOldFormat - The old format of the date.
	 * @param sNewFormat - The new format in which it is expected
	 * @return String - The date in the new format
	 */
	public String getDateInNewFormat(String sDate, String sOldFormat, String sNewFormat)
	{
		logger.ctdebug("CTVDF00317", sDate);
		logger.ctdebug("CTVDF00318", sOldFormat, sNewFormat);
		SimpleDateFormat newDateFormat = new SimpleDateFormat(sNewFormat);
		SimpleDateFormat oldDateFormat = new SimpleDateFormat(sOldFormat);
		logger.ctdebug("CTVDF00319", newDateFormat, oldDateFormat);
		String sOldDate = sDate;
		Date date = null;
		String sNewDate = null;
		try
		{
			date = oldDateFormat.parse(sOldDate);
		} catch (ParseException pException)
		{
			logger.cterror("CTVDF00320", pException);
		}
		sNewDate = newDateFormat.format(date);
		logger.ctdebug("CTVDF00321", sNewDate);
		return sNewDate;
	}

	/**
	 * Returns the date in new format.
	 * 
	 * @param colName
	 * @param ColValue - The old format of the date.
	 * @param filterContrints - "strEquals","startsWith","endsWith","contains", ">",">=","<","<=","<>",
	 *            "gtEqualTo","ltEqualTo","range",
	 * @return String - part of the SQL to be added in the where clause to filter the data based on the filter entry
	 */
	public String getFilterSQLString(String colName, String filterContrints, String ColValue, String ColValue2,
			String userDefinedDateFormat)
	{
		String filterSQLString = "";
		logger.ctdebug("CTVDF00322");
		logger.ctdebug("CTVDF00323", colName, filterContrints, ColValue, ColValue2);
		if ("strEquals".equals(filterContrints))
		{
			filterSQLString = "trim(upper(" + colName + ")) = '" + ColValue.toUpperCase() + "'";
		}
		if ("strBetween".equals(filterContrints))
		{
			filterSQLString = colName + " BETWEEN '" + ColValue + "' AND '" + ColValue2 + "'";
		} else if ("startsWith".equals(filterContrints))
		{
			filterSQLString = "trim(upper(" + colName + ")) LIKE  '" + ColValue.toUpperCase() + "%'";
		} else if ("endsWith".equals(filterContrints))
		{
			filterSQLString = "trim(upper(" + colName + ")) LIKE  '%" + ColValue.toUpperCase() + "'";
		} else if ("contains".equals(filterContrints))
		{
			filterSQLString = "trim(upper(" + colName + ")) LIKE  '%" + ColValue.toUpperCase() + "%'";
		}
		// For Amount field
		else if (">".equals(filterContrints))
		{
			filterSQLString = colName + " > " + ColValue;
		} else if (">=".equals(filterContrints))
		{
			filterSQLString = colName + " >= " + ColValue;
		} else if ("<".equals(filterContrints))
		{
			filterSQLString = colName + " < " + ColValue;
		} else if ("<=".equals(filterContrints))
		{
			filterSQLString = colName + " <= " + ColValue;
		} else if ("<>".equals(filterContrints))
		{
			filterSQLString = colName + " != " + ColValue;
		}
		// For Date Columns
		else if ("gtEqualTo".equals(filterContrints))
		{

			filterSQLString = "TRUNC(" + colName + ") >= TO_DATE('"
					+ getDateInNewFormat(ColValue, userDefinedDateFormat, "dd/MM/yyyy") + "','dd/MM/yyyy')";
		} else if ("ltEqualTo".equals(filterContrints))
		{

			filterSQLString = "TRUNC(" + colName + ") <= TO_DATE('"
					+ getDateInNewFormat(ColValue, userDefinedDateFormat, "dd/MM/yyyy") + "','dd/MM/yyyy')";
		} else if ("range".equals(filterContrints))
		{
				filterSQLString = "trunc(to_date(" + colName + " ,'dd/MM/yyyy'))  BETWEEN  '"
						+ getDateInNewFormat(ColValue, userDefinedDateFormat, "dd/MMM/yyyy") + "' AND '"
						+ getDateInNewFormat(ColValue2, userDefinedDateFormat, "dd/MMM/yyyy") + "'";
		} else if ("dtEquals".equals(filterContrints))
		{
				filterSQLString = "trunc(to_date(" + colName + " ,'dd/MM/yyyy'))  = '"
						+ getDateInNewFormat(ColValue, userDefinedDateFormat, "dd/MMM/yyyy") + "'";
		}
		logger.ctdebug("CTVDF00324", filterSQLString);
		return filterSQLString;
	}

	/**
	 * Returns the OracleDateFormat : 03-JAN-2009
	 * 
	 * @param ColValue - The old format of the date.
	 * @return String date in the oracle compatible format : 03-JAN-2009-
	 */
	private String getOracleDateFormat(String javaDate)
	{
		SimpleDateFormat simpleDateFromator = new SimpleDateFormat("dd-MMM-yyyy");
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yy");
		logger.ctdebug("CTVDF00325", javaDate);
		String oracleDateFormat = null;
		try
		{
			oracleDateFormat = simpleDateFromator.format(dateFormat.parse(javaDate));
		} catch (ParseException e)
		{
			logger.ctdebug("CTVDF00326", e);
		}
		logger.ctdebug("CTVDF00327", oracleDateFormat);
		return oracleDateFormat;
	}

	/**
	 * Used to validate given object is not null. If its not null - return true else - return false
	 * 
	 * @param Object obj
	 * @return boolean true/false
	 */
	public boolean isNotNull(Object obj)
	{
		if (obj instanceof String)
		{
			String temp = (String) obj;
			if (temp.trim().equals(""))
			{
				return false;
			}

		} else if (obj instanceof String[])
		{
			String[] temp = (String[]) obj;
			if (temp.length <= 0)
			{

				return false;
			}
		} else if (obj instanceof HashMap || obj instanceof Map)
		{

			Map temp = (Map) obj;
			if (temp.size() == 0)
				return false;

		} else if (obj instanceof List || obj instanceof ArrayList)
		{

			List temp = (List) obj;
			if (temp.size() == 0)
				return false;

		} else if (obj == null)
		{
			return false;
		}

		return true;
	}
	/**
	 * This is a helper method that converts the user provided params in the below construct to a JSONObject (Map).
	 * @param userparams The params provided by the user
	 * @return The params in a JSONObject representation
	 * @throws JSONException Thrown if any error occurs during the conversion process 
	 */
	public JSONObject convertUserInputParamsToJSON(String userparams) throws JSONException
	{
		if (StringUtils.isEmpty(userparams))
			return null;
			
		String[] paramsArray = StringUtils.split(userparams, ",");
		String[] tokens;
		JSONObject paramObject = new JSONObject();
		for (String aParam : paramsArray)
		{
			tokens = StringUtils.split(aParam, "=");
			//If there are not just 2 fragments, then some configuration issue. 
			// TODO: Log the same
			if (tokens.length != 2)
				continue;
			paramObject.put(tokens[0], tokens[1]);
		}
		return paramObject;
	}
	
	/**
	 * This is a helper method that converts the state of the database request into a JSON
	 * @param dbRequest The database request to be converted to JSON object
	 * @return The JSON Object state of the provided database request
	 * @throws JSONException Thrown of any error occurs while converting to JSON
	 */
	public JSONObject convertDBRequestToJSONRequest(DatabaseRequest dbRequest) throws JSONException
	{
		JSONObject root = new JSONObject();
		root.put("DATA_SOURCE_ID", dbRequest.getDataSource());
		Map addedFilters = dbRequest.getFilters();
		// Remove the filters and sort conditions added as collection. We will handle the same separately.
		List<ColumnFilter> allFilters = (List<ColumnFilter>) addedFilters.remove(ViewDefinitionConstants.FLD_FILTERS);
		List<SortDefinition> allSorts = (List<SortDefinition>) addedFilters.remove(ViewDefinitionConstants.FLD_SORTFIELDS);
		allFilters = (allFilters == null) ? Collections.EMPTY_LIST : allFilters;
		allSorts = (allSorts == null) ? Collections.EMPTY_LIST : allSorts;
		root.put("FILTERS", convertFiltersToJSON(addedFilters, allFilters));
		root.put("SORT", convertSortsToJSON(allSorts));
		
		return root;
	}

	/**
	 * Helper method to convert the Sort conditions into a JSON Array. Every element in the array is a JSON as below
	 * 
	 * <pre>
	 * 		[{ "FIELD" : "FIELD1", "DIR" : "ASC"}, { "FIELD" : "FIELD2", "DIR" : "DESC"}]
	 * </pre>
	 * 
	 * @param allSorts The Sort conditions provided
	 * @return All the sort conditions packaged as a Array.
	 * @throws JSONException
	 */
	private JSONArray convertSortsToJSON(List<SortDefinition> allSorts) throws JSONException
	{
		JSONArray sortArray = new JSONArray();
		JSONObject sortJson;
		for (SortDefinition aSort : allSorts)
		{
			sortJson = new JSONObject();
			sortJson.put("FIELD", aSort.getColumnID());
			sortJson.put("DIR", aSort.getSortOrder());
			sortArray.put(sortJson);
		}
		return sortArray;
	}

	/**
	 * Helper method to convert the filters into a JSON Array. Every element in the array is a JSON as below -
	 * 
	 * <pre>
	 * 		[{ "FIELD" : "FIELD1", "OPERATOR" : "EQ", "VALUE" : "TEST" }, { "FIELD" : "FIELD2", "OPERATOR" : "NEQ", "VALUE" : "jack" }]
	 * </pre>
	 * 
	 * @param addedFilters The filters added directly to the DB Request
	 * @param allFilters The filters provided as column filters (could include dynamic filters too)
	 * @return All the filters packaged as a Array.
	 * @throws JSONException
	 */
	private JSONArray convertFiltersToJSON(Map<String, Object> addedFilters, List<ColumnFilter> allFilters)
			throws JSONException
	{
		JSONArray filterArray = new JSONArray();
		JSONObject aFilter;
		Iterator<Entry<String, Object>> entriesIterator = addedFilters.entrySet().iterator();
		Entry<String, Object> anEntry;
		while (entriesIterator.hasNext())
		{
			anEntry = entriesIterator.next();
			aFilter = new JSONObject();
			aFilter.put("FIELD", anEntry.getKey());
			aFilter.put("OPERATOR", "Eq"); // The operator is always considered as Equals
			aFilter.put("VALUE", anEntry.getValue());
			filterArray.put(aFilter);
		}
		// Similarly loop through all the column filters and add it to the array.
		for (ColumnFilter aColFilter : allFilters)
		{
			aFilter = new JSONObject();
			aFilter.put("FIELD", aColFilter.getColumnID());
			aFilter.put("OPERATOR", aColFilter.getFilterType());
			aFilter.put("VALUE", aColFilter.getFilterValues());
			filterArray.put(aFilter);
		}
		return filterArray;
	}
	// Instance of Logger for this class
	private static Logger logger = Logger.getLogger(ListViewUtil.class);
}
