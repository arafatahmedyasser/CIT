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

import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

/**
 * This class is used for creating the client side WebResource instances 
 * for communication with RESTful Web services.
 * 
 * @see com.intellectdesign.canvas.viewdefinition.instruction.RestServiceListViewInstruction#fetchData(com.intellectdesign.canvas.viewdefinition.ViewDefinition, java.util.HashMap, com.intellectdesign.canvas.database.PaginationModel, java.util.ArrayList, java.util.ArrayList, com.intellectdesign.canvas.entitlement.DataEntitlements)
 * @see com.intellectdesign.canvas.viewdefinition.instruction.RestServiceGraphViewInstruction#fetchData(com.intellectdesign.canvas.viewdefinition.ViewDefinition, java.util.HashMap, com.intellectdesign.canvas.database.PaginationModel, java.util.ArrayList, java.util.ArrayList, com.intellectdesign.canvas.entitlement.DataEntitlements)
 * 
 *  
 * @version 1.0
 */
public class ServiceSupport
{
	/**
	 * This method creates the WebResource instance for the client
	 * 
	 * @param path - String value of the resource URI
	 * @return services - WebResource Instance for handling requests and responses
	 */
	public WebResource getService(String path)
	{
		ClientConfig config = new DefaultClientConfig();
		Client client = Client.create(config);
		WebResource service = client.resource(getBaseURI(path));
		return service;
	}

	/**
	 * This method provides the URI of the path passed parameter in the {@link getService} method
	 * 
	 * @param path - String value of the URI
	 * @return build - URI object to create WebResource
	 */
	private static URI getBaseURI(String path)
	{

		return UriBuilder.fromUri(path).build();

	}
}
