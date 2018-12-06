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

import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;

/**
 * This class provides the Hashmap of data for the views 
 * that need to fetch data from store procedures 
 * 
 * @version 1.0
 */
public abstract class StoreProcedureListViewsInstruction extends ListViewsInstruction
{
	/**
	 * This method provides the Store Procedure Operation Type
	 * 
	 * @return OpertaionType - integer value indicating the Store Procedure operation type
	 * 
	 * @see com.intellectdesign.canvas.database.DatabaseConstants
	 */
	protected abstract int getProcedureOperationType();

	/**
	 * Thise method is used to provide the Data Access Map key 
	 * 
	 * @return AccessMapKey - String value of Data Access Map key
	 */
	protected abstract String getProcedureDataAccessMapKey();

	/**
	 * This method is responsible for fetching data from the data source using the Stroed Procedure. 
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view details 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * @param pmModel - PaginationModel object that contains data of Start Row Number, List View Page Size 
	 * @param listFilters - ArrayList object containing the filter columns, conditions and filter values 
	 * @param listSortDefinitions - ArrayList object containing the Sortable columns and sort by order
	 * @param dataEntitlements - DataEntitlements object that contains the user entitlement to access the view
	 * @return resultData - HashMap of the View Data to be displayed on the views as pages of records
	 * @throws ViewDefinitionException
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#fetchData(com.intellectdesign.canvas.viewdefinition.ViewDefinition,
	 *      java.util.HashMap, com.intellectdesign.canvas.database.PaginationModel, java.util.ArrayList, java.util.ArrayList,
	 *      com.intellectdesign.canvas.entitlement.DataEntitlements)
	 */
	@Override
	protected final List fetchData(final ViewDefinition viewDefinition, final HashMap mapInputParams,
			final PaginationModel pmModel, final ArrayList listFilters, final ArrayList listSortDefinitions,
			final DataEntitlements dataEntitlements) throws ViewDefinitionException

	{
		logger.ctinfo("CTVDF00393");
		logger.ctdebug("CTVDF00394", pmModel);

		List listViewData = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		HashMap mapViewSpecificFilter = null;

		// get the data applying the filters and sort criterion

		mapViewSpecificFilter = getViewSpecificFilters(mapInputParams, dataEntitlements);
		logger.ctdebug("CTVDF00395", mapViewSpecificFilter);

		dbRequest = new DatabaseRequest();
		dbRequest.setData(mapViewSpecificFilter);
		dbRequest.setOperation(getProcedureOperationType());
		dbRequest.setDataAccessMapKey(getProcedureDataAccessMapKey());

		alterFilters(dbRequest, listFilters, mapInputParams);
		// Call the updated version also for people to use
		alterStoredProcFilters(mapViewSpecificFilter, dbRequest, listFilters, listSortDefinitions, mapInputParams);

		try
		{
			dbResult = dbRequest.execute();
			listViewData = dbResult.getReturnedList();
		} catch (DatabaseException dbExcep)
		{
			logger.cterror("CTVDF00396", dbExcep, viewDefinition.getViewId());
			throw new ViewDefinitionException(dbExcep);
		}

		return listViewData;
	}

	/**
	 * This method is provided as hook for the sub-class to manipulate before executing the Store Procedure
	 * 
	 * @param spParams - Hashmap of Stored Procedure Parameters from the client 
	 * @param dbRequest - DatabaseRequest object that contains the Stored Procedure to be executed
	 * @param listFilters - ArrayList object containing the filter columns, conditions and filter values 
	 * @param listSortDefinitions - ArrayList object containing the Sortable columns and sort by order
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client
	 * 
	 * 
	 * @throws ViewDefinitionException
	 */
	protected void alterStoredProcFilters(final HashMap spParams, final DatabaseRequest dbRequest,
			final ArrayList listFilters, final ArrayList listSortDefinitions, final HashMap mapInputParams)
			throws ViewDefinitionException
	{
		// Instead of adding it to database request, add it to the SP params.
		spParams.put(ViewDefinitionConstants.FLD_FILTERS, listFilters);
		spParams.put(ViewDefinitionConstants.FLD_SORTFIELDS, listSortDefinitions);
	}

	private static final Logger logger = Logger.getLogger(StoreProcedureListViewsInstruction.class);
}
