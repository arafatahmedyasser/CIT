/***************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved.  
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *****************************************************************/

package com.intellectdesign.canvas.database;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This class contains the setters/getters that are used by the persistent layer(in case of setters) for the client
 * layers
 * 
 * @version 1.0
 */
public class DatabaseResult
{
	/**
	 * This public constructor sets the default values fro noOfRowsAffected as -1
	 */
	public DatabaseResult()
	{
		setNoOfRowsAffected(-1);
		dbResLogger.ctdebug("CTDBL00051");
	}

	/**
	 * This method sets the list of records that are returned by select operation for Stored Procedure Execution, this
	 * returned list should be interpreted as follows <li>if the stored procedure returns a list of rows, then the
	 * returnlist object will be a list of rows<li> <li>if the stored procedure does not return anything but uses an out
	 * (or/and) in out parameter to return results, the returnlist object will have only 1 value which will be a Mapping
	 * of key with the out or inout parameter name and the value<li> <li>if the stored procedure return a list of rows
	 * and also uses an out (or/and) inout parameter to return more results, the last element in this list will have map
	 * which has the results of the out (or/and) inout params and the 0th to the last-1 elements will be the result set
	 * returned by SP <li>if the stored procedure does not do anything, then this method will need not even be called</li>
	 * 
	 * @param returnList List of fields returned after DBoperation
	 */

	@SuppressWarnings("rawtypes")
	protected void setReturnedList(List returnList)
	{
		dbResLogger.ctdebug("CTDBL00052");
		this.dbOperationResult = returnList;
	}

	/**
	 * This class sets the noOfRowsAffected by db operation (like update,delete etc.,) Default value is -1
	 * 
	 * @param noOfRowsAffected number of records affected after db operation
	 */
	protected void setNoOfRowsAffected(int noOfRowsAffected)
	{
		dbResLogger.ctdebug("CTDBL00186", noOfRowsAffected);
		this.noOfRowsAffected = noOfRowsAffected;
	}

	/**
	 * This class returns the list that contains all the rows retrieved by select operation
	 * 
	 * @return dbOperationResult returnList with set of records retrived from select operation
	 */
	@SuppressWarnings("rawtypes")
	public List getReturnedList()
	{
		return dbOperationResult;
	}

	/**
	 * This class provides the noOfRowsAffected after db operation (like update,delete etc.,) that was set after
	 * operation is done in Database
	 * 
	 * @return noOfRowsAffected number of rows affected by the db operation
	 */
	public int getNoOfRowsAffected()
	{
		return noOfRowsAffected;
	}

	/**
	 * This member variable holds the result arraylist
	 */
	@SuppressWarnings("rawtypes")
	private List dbOperationResult = new ArrayList();

	/**
	 * This variable holds no of rows affected after the db operation like update, delete
	 */
	private int noOfRowsAffected;

	/**
	 * This is an instance for logger
	 */
	private static Logger dbResLogger = Logger.getLogger(DatabaseResult.class);

	/**
	 * This method contains the complete string representation of the DatabaseResult object Use this object for logging
	 * 
	 * @return strDbResult a string representation of the complete DatabaseResult object
	 */
	public String toString()
	{
		StringBuffer strDbResult = new StringBuffer();
		strDbResult.append("DatabaseResult={");
		strDbResult.append("noOfRowsAffected=");
		strDbResult.append(noOfRowsAffected);
		strDbResult.append(", dbOperationResult=");
		strDbResult.append((dbOperationResult != null) ? dbOperationResult.toString() : "");
		strDbResult.append("}");
		return strDbResult.toString();
	}

	/**
	 * This class sets the resultMap(Map) in the result object
	 * 
	 * @param returnMap Mapping of the records retrived
	 */
	@SuppressWarnings(
	{ "rawtypes", "unchecked" })
	protected void setReturnedMap(Map returnMap)
	{
		this.dbOperationResult.add(returnMap);
	}
}