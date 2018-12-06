/*************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *************************************************************************/

package com.intellectdesign.canvas.ibatis.typeHandler;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;

import com.ibatis.sqlmap.client.extensions.ParameterSetter;
import com.ibatis.sqlmap.client.extensions.ResultGetter;
import com.ibatis.sqlmap.client.extensions.TypeHandlerCallback;

/**
 * This class accepts the timestamp values from database and converts as java Date object.
 * 
 * 
 * @version 1.0
 */
public class OracleTimeStampToDateTypeHandler implements TypeHandlerCallback
{

	/**
	 * This method is used to get the Date Object
	 * 
	 * @param resultGetter
	 * @return dateObj
	 * @throws SQLException if any SQLException occurs
	 */
	public Object getResult(ResultGetter resultGetter) throws SQLException
	{
		Date dateObj = null;

		/**
		 * Getting the Timestamp value from database
		 */
		if (resultGetter.getTimestamp() != null)
		{
			dateObj = toDate(resultGetter.getTimestamp());
		}

		return dateObj;
	}

	/**
	 * Method to convert the received Timestamp to Date Object
	 * 
	 * @param timestamp
	 * @return java.util.Date
	 */
	private static java.util.Date toDate(java.sql.Timestamp timestamp)
	{
		long milliseconds = timestamp.getTime() + (timestamp.getNanos() / 1000000);
		return new java.util.Date(milliseconds);
	}

	/**
	 * Set the parameter for creating timestamp
	 * 
	 * @param parameterSetter
	 * @param arg1
	 * @throws SQLException if any SQLException occurs
	 */
	public void setParameter(ParameterSetter parameterSetter, Object arg1) throws SQLException
	{
		Timestamp timestamp = (Timestamp) parameterSetter;
		parameterSetter.setTimestamp(timestamp);

	}

	/**
	 * This method returns the string representation of the Object argument.
	 * 
	 * @param arg0
	 * @return Object
	 */
	public Object valueOf(String arg0)
	{

		return null;
	}

}
