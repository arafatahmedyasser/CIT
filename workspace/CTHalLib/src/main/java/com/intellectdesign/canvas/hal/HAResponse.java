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

package com.intellectdesign.canvas.hal;

import java.io.Serializable;

/**
 * 
 * <code>HAResponse</code> is the container class for the Response.
 * 
 * @version 1.0
 */
public class HAResponse implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -1677762460361350752L;

	/**
	 * Stores Application ID
	 */
	private String appID = null;

	/**
	 * Stores Data Object returned by Host
	 */
	private Object dataObj = null;

	/**
	 * Status returned by Host Access Layer
	 */
	private int status = -1;

	/**
	 * To Store Error Code. Contains Code incase of Status != 0
	 */
	private String errorCode = "";

	/**
	 * To Store Error Message. Contains Message incase of Status != 0
	 */
	private String errorMessage = "";

	/** Creates a new instance of HAResponse */
	public HAResponse()
	{
	}

	/**
	 * Creates a new instance of HAResponse.
	 * 
	 * @param appid String
	 * @param data Object
	 */
	public HAResponse(String appid, Object data)
	{
		this();
		this.appID = appid;
		this.dataObj = data;
	}

	/**
	 * Creates a new instance of HAResponse
	 * 
	 * @param appid String
	 * @param stat int
	 * @param data Object
	 */
	public HAResponse(String appid, int stat, Object data)
	{
		this();
		this.appID = appid;
		this.status = stat;
		this.dataObj = data;
	}

	/**
	 * Sets Application ID
	 * 
	 * @param appid
	 */
	public void setAppID(java.lang.String appid)
	{
		this.appID = appid;
	}

	/**
	 * Returns Application ID
	 * 
	 * @return String appID
	 */
	public String getAppID()
	{
		return this.appID;
	}

	/**
	 * Sets Payload Data
	 * 
	 * @param data
	 */
	public void setData(java.lang.Object data)
	{
		this.dataObj = data;
	}

	/**
	 * Returns Payload Data
	 * 
	 * @return Object dataObj
	 */
	public Object getData()
	{
		return this.dataObj;
	}

	/**
	 * Sets the Status of HAResponse Object
	 * 
	 * @param status
	 */
	public void setStatus(int status)
	{
		this.status = status;
	}

	/**
	 * Returns the current Status of HAResponse Object
	 * 
	 * @return int
	 */
	public int getStatus()
	{
		return this.status;
	}

	/**
	 * Sets Error Code.
	 * 
	 * @param errorcode
	 */
	public void setErrorCode(java.lang.String errorcode)
	{
		this.errorCode = errorcode;
	}

	/**
	 * Returns Error Code.
	 * 
	 * @return String
	 */
	public String getErrorCode()
	{
		return this.errorCode;
	}

	/**
	 * Sets Error Message.
	 * 
	 * @param errormsg
	 */
	public void setErrorMessage(java.lang.String errormsg)
	{
		this.errorMessage = errormsg;
	}

	/**
	 * Returns Error Message..
	 * 
	 * @return String
	 */
	public String getErrorMessage()
	{
		return this.errorMessage;
	}

	/**
	 * Overloaded toString() method. Returns Application Id and Status
	 * 
	 * @return String
	 */
	public String toString()
	{
		return "AppID: " + this.appID + ", Status: " + status + ",";
	}

}
