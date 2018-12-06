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
import java.util.Date;
import java.util.HashMap;

import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.database.SortingModel;
import com.intellectdesign.canvas.entitlement.DataEntitlements;

/**
 * This interface encapsulates the methods related to fetching data from the data-source 
 * for the given view
 * 
 * @version 1.0
 */
public interface IViewInstruction
{
	/**
	 * This method is used to get the view data for the given view. 
	 * The data for the view is expected in the key ViewDefinitionConstants.KEY_ALL_RECORDS
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client
	 * @return ViewData - HashMap of the View Data to be displayed on the view
	 * 
	 * @throws ViewDefinitionException
	 */
	public HashMap getViewData(ViewDefinition viewDefinition, HashMap mapInputParams) throws ViewDefinitionException;

	/**
	 * This method is used to get the view data for the given view and applies the pagination. 
	 * The data for the view is expected in the key ViewDefinitionConstants.KEY_ALL_RECORDS
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client
	 * @param pmModel - PaginationModel object that contains data of Start Row Number, List View Page Size 
	 * @return ViewData - HashMap of the View Data to be displayed on the grid views as pages of records
	 * @throws ViewDefinitionException
	 */
	public HashMap getViewData(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel)
			throws ViewDefinitionException;

	/**
	 * This method is used to form the runtime filters from the input params
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters containing the user applied filters
	 * @param viewDefinition - ViewDefinition object that contains the view details 
	 * @return RuntimeFilters - ArrayList object that contains the filter columns, filter values and conditions
	 */
	public ArrayList getRuntimeFilters(HashMap mapInputParams, ViewDefinition viewDefinition)
			throws ViewDefinitionException;

	/**
	 * This method is used to form the runtime sort definitions from the input params
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters containing the user sorting order
	 * @param sortModel - SortingModel object that defines the sorting order of the records
	 * @return RuntimeSortDefinitions - ArrayList object that contains the sort columns and sort order
	 */
	public ArrayList getRuntimeSortDefinitions(HashMap mapInputParams, SortingModel sortModel)
			throws ViewDefinitionException;

	/**
	 * This method is used to form the view specific filters from the input params for the entitled records
	 * 
	 * @param hmInputParams - Cached Hashmap of Input Parameters from the client
	 * @param dataEntitlements - DataEntitlements object indicating the current user entitlement on the view data
	 * @return ViewSpecificFilters - Hashmap of View specific Filter columns, conditions and filter values 
	 */
	public HashMap getViewSpecificFilters(HashMap hmInputParams, DataEntitlements dataEntitlements)
			throws ViewDefinitionException;

	/**
	 * This method is used to delete the view data from view specific tables if any. 
	 * (Right now only Account list view has additional table ACCOUNT_LIST_VDF_EXT)
	 * 
	 * @param sViewId - String value of the View Id to be deleted
	 * 
	 */
	public void deleteExtension(String sViewId) throws ViewDefinitionException;

	/**
	 * This method is used to fetch the entitlements of the user to access the data on the view
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view detail
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client
	 * @return DataEntitlements - DataEntitlements object indicating the current user entitlement on the view
	 * 
	 * @throws ViewDefinitionException
	 */
	public DataEntitlements retrieveEntitlements(ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException;

	/**
	 * This is a hook intended give an opportunity to alter/add filters on the dbrequest before querying
	 * 
	 * @param dbRequest - DatabaseRequest object to be used for execution of the query
	 * @param runtimeFilters - ArrayList obect containing the runtime as well as predefined filters 
	 * @param inputParams - Cached Hashmap of Input Parameters from the client
	 */
	public void alterFilters(DatabaseRequest dbRequest, ArrayList runtimeFilters, HashMap inputParams)
			throws ViewDefinitionException;

	/**
	 * This method will be used when the View is configured with a Global Date filter. 
	 * The implementation of this method should return the maximum possible date 
	 * that should be allowed in filters when the user tries to select dates in "From" and "To" options. 
	 * This date will govern the bounds that will be enforced by the filter 
	 * when the user tries to select date for performing search
	 * 
	 * @params viewDefinition The View Definition
	 * @param inputParams The input parameters to the request.
	 * @throws ViewDefinitionException Thrown if any error occurs while retrieving the maximum date
	 */
	public Date getMaximumDateForGlobalDateFilter(ViewDefinition viewDefinition, HashMap inputParams)
			throws ViewDefinitionException;
}
