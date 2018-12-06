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
import com.intellectdesign.canvas.viewdefinition.instruction.GraphViewInstruction;

/**
 * This class is for canvas default graph view instruction extends graph view instruction.
 * 
 * @version 1.0
 */
public class CanvasDefaultGraphViewInstruction extends GraphViewInstruction
{

	/**
	 * this is ref to GraphViewInstructionViewSpecificFilters
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
	 * this is ref to UniqueSortFieldOrder
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
	 * this is ref to HashMap to SortColumnMap
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

	private static Logger logger = Logger.getLogger(CanvasDefaultGraphViewInstruction.class);
}
