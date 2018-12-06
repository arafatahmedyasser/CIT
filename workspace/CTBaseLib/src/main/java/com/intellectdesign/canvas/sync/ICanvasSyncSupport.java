/**
 * Copyright 2015. Polaris Financial Technology Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Polaris Financial Technology 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Polaris Financial Technology Limited.
 * 
 */
package com.intellectdesign.canvas.sync;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;

import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;

/**
 * This interface should be implemented by classes that want to register themselves for synchronization support
 * 
 */
public interface ICanvasSyncSupport
{
	/**
	 * This method will be triggered by the framework for getting the latest version of the sync data based on the keys
	 * that were provided.
	 * 
	 * @param keys The map having the keys as provided by the client. The exact keys will be as per what the client
	 * sends for the target module that this class implements
	 * @return The Array of meta data structures provided as JSON objects
	 * @throws ProcessingErrorException Thrown if any error occurs while processing this request
	 * @throws JSONException 
	 */
	public JSONArray getSyncData(Map keys,HttpServletRequest request) throws ProcessingErrorException, JSONException;

	/**
	 * This method will be triggered by the framework for asking the module implementation to validate the list of keys
	 * as sent by the client. The response is expected to be the list of keys that are out of sync with the definition
	 * present on the server
	 * 
	 * @param keys The map having the keys as provided by the client. The exact keys will be as per what the client
	 *  sends for the target module that this class implements
	 * @return The Array of keys of the meta data structure as a JSON Object
	 * @throws ProcessingErrorException Thrown if any error occurs while processing this request
	 * @throws JSONException 
	 */
	public JSONArray validateSyncList(Map keys,HttpServletRequest request) throws ProcessingErrorException, JSONException;
}
