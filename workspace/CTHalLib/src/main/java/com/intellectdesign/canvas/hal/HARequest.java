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
import java.util.HashMap;

/**
 * 
 * <code>HARequest</code> is the container class for the Request.
 * 
 * @version 1.0
 */

public class HARequest implements Serializable
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 4844300308868500676L;

	/**
	 * Stores Application ID.
	 */
	private String appID = null;

	/**
	 * Stores Payload Object that has to be sent to Host.
	 */
	private Object dataObj = null;

	/**
	 * Header Data HashMap. Can be used in ICommunicator for header processing
	 */
	private HashMap headerData = null;

	/**
	 * Communication Type. Can be 0 or 1.
	 */
	private int communicationType = -1;

	public static final int SYNC = 0;
	public static final int ASYNC = 1;

	/** Creates a new instance of HARequest */
	public HARequest()
	{

	}

	/**
	 * Creates a new instance of HARequest
	 * 
	 * @param appid
	 * @param data
	 * @param commtype
	 */
	public HARequest(String appid, Object data, int commtype)
	{
		this.appID = appid;
		this.dataObj = data;
		this.communicationType = commtype;
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
	 * Returns Application ID assigned to it
	 * 
	 * @return String
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
	public void setData(Object data)
	{
		this.dataObj = data;
	}

	/**
	 * Returns Payload data
	 * 
	 * @return Object
	 */
	public Object getData()
	{
		return this.dataObj;
	}

	/**
	 * Sets Header information. This information can be used in Communicator Class.
	 * 
	 * @param data
	 */
	public void setHeaderData(HashMap data)
	{
		this.headerData = data;
	}

	/**
	 * Returns Header Information.
	 * 
	 * @return HashMap
	 */
	public HashMap getHeaderData()
	{
		return this.headerData;
	}

	/**
	 * Sets Communication Type. This value is mandatory. Values can be HARequest.SYNC or HARequest.ASYNC
	 * 
	 * @param type
	 */
	public void setCommunicationType(int type)
	{
		this.communicationType = type;
	}

	/**
	 * Returns Communication Type.
	 * 
	 * @return int
	 */
	public int getCommunicationType()
	{
		return this.communicationType;
	}

	/**
	 * Checks if the HARequest Object is valid or not for mandatory values. It checks for Application ID, Payload Data
	 * and Communication Type
	 * 
	 * @return boolean
	 */
	public boolean isValid()
	{
		if ((this.appID == null) || (this.dataObj == null) || (this.appID.trim().equals(""))
				|| (this.communicationType < 0))
		{
			return false;
		} else
		{
			return true;
		}
	}

	/**
	 * Overloaded toString() method. It returns empty String if application id is null.
	 * 
	 * @return String
	 */
	public String toString()
	{
		return (this.appID == null ? "" : this.appID);
	}

}
