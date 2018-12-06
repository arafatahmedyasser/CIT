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

import javax.ws.rs.core.MediaType;

import com.intellectdesign.canvas.data.conversion.util.OnlineJSONToHashmapConverter;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.sun.jersey.api.client.WebResource;

/**
 * This class uses the rest services to fetch data for all the chart views.
 * This class gets the data from the Web Source URI (added as the Data Source of the view) and 
 * provides the data as Hashmap of records. 
 * 
 * @version 1.0
 */
public abstract class RestServiceGraphViewInstruction extends GraphViewInstruction
{

	/**
	 * This method is called from getViewData to fetch data the from the Web Resources. 
	 * This method provides the Hashmap of the data fetched using the jersey WebResource client service.
	 * 
	 * In case a sub class wants to provide a different implementation logic 
	 * for fetching the data from the web data sources, this is the method to be overridden
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client
	 * @param pmModel - PaginationModel object that contains data of Start Row Number, List View Page Size 
	 * @param listFilters - List object containing all the runtime as well as view specific filters for this view.
	 * @param listSortDefinitions - ArrayList object containing the list of sort columns and sort by order
	 * @param dataEntitlements - DataEntitlements object containing the user entitlement to access the data in the view
	 * @return responseData - List object containg the data fetched for the view
	 * 
	 * @throws ViewDefinitionException thrown if any error occurs while processing the request.
	 * 
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getViewData(ViewDefinition, HashMap, PaginationModel)
	 */
	protected List fetchData(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel,
			ArrayList listFilters, ArrayList listSortDefinitions, DataEntitlements dataEntitlements)
			throws ViewDefinitionException
	{
		HashMap returnMap = null;
		List returnList = new ArrayList();
		OnlineJSONToHashmapConverter onlineJSONToHashmapConverter = null;
		ServiceSupport support = null;
		WebResource service = null;
		String response = null;
		try
		{
			returnList = new ArrayList();
			onlineJSONToHashmapConverter = new OnlineJSONToHashmapConverter();
			support = new ServiceSupport();
			service = support.getService(getServicePath(viewDefinition, mapInputParams, pmModel));
			/**
			 * Get the service call path from the instruction class extending this class
			 */
			response = service.accept(MediaType.TEXT_PLAIN).get(String.class);
			returnMap = onlineJSONToHashmapConverter.convert(response);
			// returnList.add(returnMap);
			// processRestData(returnList, returnMap, viewDefinition, mapInputParams);

		} catch (Exception e)
		{
			throw new ViewDefinitionException(e);
		}
		return returnList;
	}

	/**
	 * This method provides the view definition's Data Source Id as Service Path  
	 * to the {@link fetchData} method to create WebResource for the URI passed.
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view details 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * @param pmModel - PaginationModel object that contains data of Start Row Number, List View Page Size 
	 * @return DataSrcId - String value of the Service Path URI
	 */
	protected String getServicePath(ViewDefinition viewDefinition, HashMap mapInputParams, PaginationModel pmModel)
	{
		return viewDefinition.getDataSrcId();
	}

	/**
	 * This method is provided as a hook for the sub-class to manipulate the reponse 
	 * which is received from the REST URL before caching.
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * @param pmModel - PaginationModel object that contains data of Start Row Number, List View Page Size  
	 *
	 */
	protected void processRestData(List returnList, HashMap responseMap, ViewDefinition viewDefinition,
			HashMap mapInputParams)
	{

	}
}
