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

import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.hal.HAProxy;
import com.intellectdesign.canvas.hal.HARequest;
import com.intellectdesign.canvas.hal.HAResponse;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;

/**
 * This is an abstract class that is responsible for fetching data from HAL(Host Access Layer)App Id 
 * 
 * 
 * @version 1.0
 */
public abstract class HALListViewInstruction extends ListViewsInstruction
{

	/**
	 * Internal constant for serialization purposes
	 */
	/**
	 * This is a default HALListViewInstruction constructor
	 */
	public HALListViewInstruction()
	{
	}

	/**
	 * This method makes a HARequest to the Host App ID, which is passed as Sql Param Map Id and 
	 * fetches the data applying the filters, sort definitions and paginations on it for the view  
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client
	 * @param pmModel - PaginationModel object that contains data of Start Row Number, List View Page Size
	 * @param listFilters - ArrayList object that contains the filter columns, filter values and conditions
	 * @param listSortDefinitions - ArrayList object that contains the sort columns and sort order
	 * @param dataEntitlements - Entitlements object indicating the current user entitlement on the view data
	 * @return ViewData - List object that contains data to be displayed on the views as pages of records
	 * 
	 * @throws ViewDefinitionException
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#fetchData(com.intellectdesign.canvas.viewdefinition.ViewDefinition,
	 *      java.util.HashMap, com.intellectdesign.canvas.database.PaginationModel, java.util.ArrayList, java.util.ArrayList,
	 *      com.intellectdesign.canvas.entitlement.DataEntitlements)
	 */
	protected List fetchData(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel,
			ArrayList listFilters, ArrayList listSortDefinitions, DataEntitlements dataEntitlements)
			throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00798");

		HAProxy proxy = new HAProxy();

		List listViewData = null;
		HashMap mapViewSpecificFilter = getViewSpecificFilters(mapInputParams, dataEntitlements);

		if (mapViewSpecificFilter == null)
		{
			LOGGER.ctdebug("CTVDF00799");
			return null;
		}
		LOGGER.ctdebug("CTVDF00800", mapViewSpecificFilter);

		HARequest hareq = new HARequest();
		hareq.setAppID(viewDefinition.getSqlParamMapID());
		hareq.setData(mapInputParams);
		hareq.setCommunicationType(HARequest.SYNC);

		// Before adding the filters, provide a hook to the sub class to modify the filters. This is required to enable
		// the sub class to handle any of the runtime filters in a different manner.
		alterFilters(null, listFilters, mapInputParams);

		mapInputParams.put(ViewDefinitionConstants.FLD_FILTERS, listFilters);
		mapInputParams.put(ViewDefinitionConstants.FLD_SORTFIELDS, listSortDefinitions);

		// Added for Decoded columns sorting starts here
		LOGGER.ctinfo("CTVDF00801", mapInputParams.get("INPUT_LANGUAGE_ID"));
		// mapInputParams.put(ViewDefinitionConstants.INPUT_LANGUAGE_ID,
		// mapInputParams.get(ViewDefinitionConstants.INPUT_LANGUAGE_ID));

		// Add the generic view specific filters to the list of filters
		if (mapViewSpecificFilter != null && !mapViewSpecificFilter.isEmpty())
			mapInputParams.put(ViewDefinitionConstants.VIEW_SPECIFIC_FILTERS, mapViewSpecificFilter);

		if (pmModel != null)
			mapInputParams.put(ViewDefinitionConstants.VIEW_PAGINATION_MODEL, pmModel);

		LOGGER.ctdebug("CTVDF00802");
		HAResponse hares = (HAResponse) proxy.invokeHALProcess(hareq);// Depricated the flag argument and Changed the
																		// method name from 'process'HAL Implementation

		List response = null;
		response = (List) hares.getData();

		return response;
	}

	private Logger LOGGER = Logger.getLogger(ListViewsInstruction.class);
}
