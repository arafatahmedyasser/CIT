/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 **/
package com.intellectdesign.canvas.ibatis.typeHandler;

import java.sql.SQLException;

import com.ibatis.sqlmap.client.extensions.ParameterSetter;
import com.ibatis.sqlmap.client.extensions.ResultGetter;
import com.ibatis.sqlmap.client.extensions.TypeHandlerCallback;

/**
 * This class implements the typehandler. Use this class to handle the character 'Y' or 'N' as boolean true or false
 * value
 * 
 * 
 * @version 1.0
 */
public class YorNBooleanTypeHandler implements TypeHandlerCallback
{

	private static final String Y = "Y";
	private static final String N = "N";

	/**
	 * Determine the result from the invocation of this object.
	 * 
	 * @param getter
	 * @return Object
	 * @throws SQLException
	 */
	public Object getResult(ResultGetter getter) throws SQLException
	{
		String s = getter.getString().trim();
		if (Y.equalsIgnoreCase(s))
		{
			return Boolean.valueOf(true);
		} else if (N.equalsIgnoreCase(s))
		{
			return Boolean.valueOf(false);
		} else
		{
			throw new SQLException("Unexpected value " + s + " found where " + Y + " or " + N + " was expected.");
		}
	}

	/**
	 * Sets the given String parameter to this URL. This method replaces all parameters with the given key.
	 * 
	 * @param setter
	 * @param parameter
	 * @throws SQLException
	 */
	public void setParameter(ParameterSetter setter, Object parameter) throws SQLException
	{
		boolean b = ((Boolean) parameter).booleanValue();
		if (b)
		{
			setter.setString(Y);
		} else
		{
			setter.setString(N);
		}
	}

	/**
	 * This method returns the string representation of boolean true and false values
	 * 
	 * @param s Boolean value of the string boolean characters
	 * @return Object
	 */
	public Object valueOf(String s)
	{
		if (Y.equalsIgnoreCase(s))
		{
			return Boolean.valueOf(true);
		} else if (N.equalsIgnoreCase(s))
		{
			return Boolean.valueOf(false);
		} else
		{
			return null;
		}
	}

}
