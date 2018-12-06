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

package com.intellectdesign.canvas.logging.initalizer;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.apache.log4j.MDC;

/**
 * Perpose of Log4jMDCInitializer is to add the user no and host ip to MDC, So that userNo and hostIp can be used for
 * logging process.
 * 
 * @version 1.0
 */
public class Log4jMDCInitializer
{
	/**
	 * This api will be used for setting the request id, userNo and hostIp in Mapped Diagnostic Context.
	 * 
	 * @param contextData
	 */
	public void initLog4jMDC(Map contextData)
	{
		MDC.put(USER_ID, contextData.get(USER_ID));
		MDC.put(HOST_IP, contextData.get(HOST_IP));
		MDC.put(REQUEST_ID, contextData.get(REQUEST_ID));
		//Invoke getCurrentRequestId() to ensure that a Request Id has been created.
		getCurrentRequestId();
	}
	/**
	 * This api will be used for setting the userNo and hostIp in Mapped Diagnostic Context.
	 * 
	 * @param userNo
	 * @param hostIp
	 * @param requestId
	 */
	public void initLog4jMDC(String userNo, String hostIp, String requestId)
	{

		MDC.put(USER_ID, userNo);
		MDC.put(HOST_IP, hostIp);
		MDC.put(REQUEST_ID, requestId);
	}

	/**
	 * This api will be used for setting the userNo and hostIp in Mapped Diagnostic Context.
	 * 
	 * @param userNo
	 * @param hostIp
	 */
	public void initLog4jMDC(String userNo, String hostIp)
	{

		MDC.put(USER_ID, userNo);
		MDC.put(HOST_IP, hostIp);
	}

	/**
	 * Removes data from user Id and host ip from the mapped diagnostic context
	 * 
	 */
	public void removeFromMDC()
	{
		MDC.remove(USER_ID);
		MDC.remove(HOST_IP);
		MDC.remove(REQUEST_ID);
	}

	/**
	 * Gets the current Request Id from the MDC. If this is not present, returns a dynamic generated one
	 * 
	 * @return The Request Id from the MDC
	 */
	public String getCurrentRequestId()
	{
		String reqID = (String) MDC.get(REQUEST_ID);
		if (reqID == null || "".equals(reqID))
		{
			reqID = "RID_" + UUID.randomUUID().toString();
			MDC.put(REQUEST_ID, reqID);
		}
		return reqID;
	}

	/**
	 * This is a helper method to retrieve the values of all the custom data stored at the Thread MDC.
	 * 
	 * @return
	 */
	public Map getMDCData()
	{
		String reqId = getCurrentRequestId();
		Map mdcData = new HashMap();
		mdcData.put(REQUEST_ID, reqId);
		mdcData.put(USER_ID, MDC.get(USER_ID));
		mdcData.put(HOST_IP, MDC.get(HOST_IP));

		return mdcData;
	}

	private static final String USER_ID = "USER_ID";
	private static final String HOST_IP = "HOST_IP";
	private static final String REQUEST_ID = "REQUEST_ID";

	Logger logger = Logger.getLogger(Log4jMDCInitializer.class);
}
