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
import java.text.SimpleDateFormat;
import java.util.Date;

import com.ibatis.sqlmap.client.extensions.ParameterSetter;
import com.ibatis.sqlmap.client.extensions.ResultGetter;
import com.ibatis.sqlmap.client.extensions.TypeHandlerCallback;

/**
 * This class accepts the timestamp values from database and converts into String.
 * 
 * 
 * @version 1.0
 */
public class OracleTimeStampToDateStringTypeHandler implements TypeHandlerCallback
{

	/**
	 * This method returns the date values retrived from the database
	 * 
	 * @param resultGetter object to access the date from database
	 * 
	 * @throws SQLException any SQLException
	 * @return displaydate
	 */
	public Object getResult(ResultGetter resultGetter) throws SQLException
	{
		String displayDate = null;
		Date dateObj = null;

		/**
		 * Getting the Timestamp value from database
		 */
		if (resultGetter.getTimestamp() != null)
		{
			dateObj = toDate(resultGetter.getTimestamp());

			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			displayDate = simpleDateFormat.format(dateObj);
		}
		return displayDate;
	}

	/**
	 * This method converts the oracle date value as java date object
	 * 
	 * @param timestamp date value retrived
	 * @return java.util.Date java date object
	 */
	private static java.util.Date toDate(java.sql.Timestamp timestamp)
	{
		long milliseconds = timestamp.getTime() + (timestamp.getNanos() / 1000000);
		return new java.util.Date(milliseconds);
	}

	/**
	 * This method sets the parameter
	 * 
	 * @param parameterSetter
	 * 
	 * @param arg1
	 * @throws SQLException
	 * 
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
	 * @return Returns the object
	 */
	public Object valueOf(String arg0)
	{
		return null;
	}

}
