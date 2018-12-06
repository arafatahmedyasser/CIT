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
package com.intellectdesign.canvas.validator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.logger.Logger;
/**
 *  This  class is for  Cache ParserWrapper
 * 
 * @version 1.0
 */
public class ParserWrapper
{
	private Map cacheIncMap = null;
	private static Logger LOGGER = Logger.getLogger(ParserWrapper.class);
	/**
	 * Single Instance of this Class
	 */
	private static ParserWrapper instance = new ParserWrapper();

	/**
	 * Private Constructor
	 */
	private ParserWrapper()
	{
		cacheIncMap = Collections.synchronizedMap(new HashMap());
	}

	/**
	 * Method that returns single instance of this Class
	 * 
	 * @return ParserWrapper
	 */
	public static synchronized ParserWrapper getInstance()
	{
		return instance;
	}

	/**
	 * The <code>validateMessage</code>
	 * 
	 * @param String vType
	 * @param String fileName
	 * @return ArrayList
	 * @exception ValidationException If any exception arises during the validation operation desc Wrapper to cache the
	 *                Object of individual verification type using Locator pattern
	 */

	public ArrayList validateMessage(String vType, String fileName) throws ValidationException
	{
		String cmName = "ParserWrapper.validateMessage";
		ArrayList list = null;
		LOGGER.ctinfo("CTVAL00001", cmName);
		try
		{
			LOGGER.ctdebug("CTVAL00049", vType, cmName);
			if (cacheIncMap.get(vType) == null)
			{
				list = new SaxParser().parseXml(fileName, vType);
				LOGGER.ctdebug("CTVAL00023", cmName, list);
				cacheIncMap.put(vType, list);
			} else
			{
				list = (ArrayList) cacheIncMap.get(vType);
				LOGGER.ctdebug("CTVAL00024", cmName, list);
			}
		} catch (Exception ex)
		{
			LOGGER.cterror("CTVAL00045", ex, cmName);
			throw new ValidationException("Validation Exception validateMessage" + ex.getMessage());
		}
		return list;
	}
}
