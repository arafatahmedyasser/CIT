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
import java.util.List;

import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.AdvGroupViewDefinitionInstruction;
import com.intellectdesign.canvas.viewdefinition.ColumnDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;

/**
 * This class is for canvas default advanced group view instruction extends advanced group view definition instruction
 * 
 * @version 1.0
 */
public class CanvasDefaultAdvGroupViewInstruction extends AdvGroupViewDefinitionInstruction
{

	/**
	 * this is ref to AdvGroupViewDefinitionInstructionViewSpecificFilters
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

		return null;
	}

	/**
	 * this ref to UniqueSortFieldName
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
	 * this is ref to HashMap SortColumnMap
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

	private static Logger logger = Logger.getLogger(CanvasDefaultAdvGroupViewInstruction.class);
}
