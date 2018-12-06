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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;

/**
 * This class is base class for fetching data for the property view.
 * This class provides the Hashmap of key, value pairs 
 * 
 * @version 1.0
 */
public abstract class PropertyViewInstruction extends ListViewsInstruction
{
	/**
	 * This method is intended to return the order of columns associated to their position in the property grid
	 * Override this method to provide custom order of the column list.
	 * 
	 * @return
	 */
	protected abstract List<String> orderedColumnList();

	/**
	 * This method will be used for filtering the records to be displayed on the screen based on its mapping
	 * available in {@link getFieldMap} method 
	 * */
	protected String getFilterColumnField()
	{
		return null;
	}

	/**
	 * This method gets the map of the view column definition to the sort column field names map
	 * 
	 * @return listViewColumnMap - Hashmap containing the columns as key value pair
	 * 
	 * @see com.intellectdesign.cib.viewdefinition.SimpleViewDefinitionInstruction#getSortColumnMap()
	 */
	@Override
	protected HashMap<String, String> getSortColumnMap()
	{
		HashMap<String, String> listViewColumnMap = new HashMap<String, String>();

		listViewColumnMap.put(ViewDefinitionConstants.CLM_PARTICULARS, ViewDefinitionConstants.CLM_PARTICULARS);
		listViewColumnMap.put(ViewDefinitionConstants.CLM_VALUE, ViewDefinitionConstants.CLM_VALUE);
		return listViewColumnMap;
	}

	/**
	 * This can be used to provide a mapping of certain columns to appear only based on the value of
	 * {@link getFilterColumnField} 
	 * */
	protected Map getFieldMap()
	{
		return null;
	}

	/**
	 * This method can be used to perform additional processing that is required.
	 * 
	 * @params listViewData - List object containing the data fetched for the view
	 * @param viewDefinition - ViewDefinition object containing the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client    
	 * @return hmReturnMap - Hashmap of the columns to be displayed on the property grid
	 * @exception ViewDefinitionException
	 * 
	 * @see com.intellectdesign.cib.viewdefinition.SimpleViewDefinitionInstruction#processResponse(java.util.List,
	 *      com.intellectdesign.cib.viewdefinition.ViewDefinition, java.util.HashMap)
	 * 
	 */
	@Override
	protected HashMap processResponse(List listViewData, ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException
	{
		if (listViewData != null && listViewData.size() > 0)
		{
			Map<String, String> dataMap = (HashMap<String, String>) listViewData.get(0);
			if (dataMap != null)
			{
				Map<String, String> fieldMap = getFieldMap();
				Map tempMap = null;
				List processedList = new ArrayList(dataMap.size());
				List<String> columnList = orderedColumnList();
				for (String column : columnList)
				{
					if (getFilterColumnField() != null && fieldMap != null)
					{
						if (fieldMap.containsKey(column))
						{
							String str = ViewDefinitionConstants.VALUE_DELIM + dataMap.get(getFilterColumnField())
									+ ViewDefinitionConstants.VALUE_DELIM;
							if (fieldMap.get(column).indexOf(str) == -1)
								continue;
						}
					}
					tempMap = new HashMap();
					tempMap.put(ViewDefinitionConstants.CLM_PARTICULARS, column);
					tempMap.put(ViewDefinitionConstants.CLM_VALUE, dataMap.get(column));
					processedList.add(tempMap);
				}
				HashMap hmReturnMap = super.processResponse(processedList, viewDefinition, mapInputParams);
				addEmptyTextLabel(hmReturnMap);
				return hmReturnMap;
			}
		}

		HashMap hmReturnMap = super.processResponse(listViewData, viewDefinition, mapInputParams);
		addEmptyTextLabel(hmReturnMap);
		return hmReturnMap;
	}

	/**
	 * This method used to provide the "No Data Found" message text to the HashMap
	 * which will be displayed when the hashmap does not contain any data. 
	 * 
	 * The sub class can override this method to give a custom empty message label
	 * 
	 * @param hashmap
	 * */
	protected void addEmptyTextLabel(HashMap hmReturnMap)
	{
		hmReturnMap.put(ViewDefinitionConstants.LBL_EMPTY_TEXT, "NO_DATA_MSG");
	}
}
