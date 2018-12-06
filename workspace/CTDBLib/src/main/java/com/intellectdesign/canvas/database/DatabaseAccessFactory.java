/*******************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 ******************************************************************************/

package com.intellectdesign.canvas.database;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This class creates database objects using iBatis and returns the objects for data manipulation operations such as
 * select, insert, update and delete
 * 
 * @version 1.0
 */
public class DatabaseAccessFactory
{
	/**
	 * Default Constructor
	 */
	private DatabaseAccessFactory()
	{
	}

	/**
	 * static block to initialize the factory
	 */
	static
	{
		/**
		 * initializaton of logger
		 */
		dbAFLogger = Logger.getLogger(DatabaseAccessFactory.class);
		initializeFactory();
	}

	/**
	 * This method creates the instance of different access and puts them into dbAccessCollection Map. The method will
	 * throw RuntimeException when there is an exception in initialization
	 * 
	 * @exception RuntimeException while initializing DatabaseAccessFactory
	 */
	@SuppressWarnings(
	{ "rawtypes", "unchecked" })
	protected static void initializeFactory()
	{
		try
		{
			dbAFLogger.ctinfo("CTDBL00011");
			dbAccessCollection = new HashMap();

			dbAFLogger.ctdebug("CTDBL00012");

			// DatabaseConstants.ACCESS_VIA_IBATIS is alone put into collection
			dbAccessCollection.put(DatabaseConstants.ACCESS_VIA_IBATIS, new IBatisDatabaseAccess());
			dbAFLogger.ctdebug("CTDBL00013");

			dbAFLogger.ctinfo("CTDBL00014");

		}
		// Any exception while initialization is thrown as a runtime exception
		catch (Throwable athrowable)
		{
			dbAFLogger.cterror("CTDBL00015", athrowable);
			throw new RuntimeException("A runtime exception occurred while initializing DatabaseAccessFactory ",
					athrowable);
		}
	}

	/**
	 * This method returns the access implementation object for the accessImp key passed
	 * 
	 * @param accessImp as string
	 * @return anidbAccess object
	 * @exception RuntimeException if a IDatabaseAccess implementation is not found for the accessImp
	 * 
	 */
	protected static IDatabaseAccess getIDBAccessImplementation(String accessImp)
	{
		dbAFLogger.ctdebug("CTDBL00016", accessImp);
		IDatabaseAccess anidbAccess = (IDatabaseAccess) dbAccessCollection.get(accessImp);
		if (anidbAccess == null)
		{
			dbAFLogger.cterror("CTDBL00017");
			throw new RuntimeException(
					"Unable to retrieve a dbAccesImplementation from the DatabaseFactory for the key: " + accessImp);
		}
		dbAFLogger.ctdebug("CTDBL00018");

		return anidbAccess;
	}

	/**
	 * This Map is a collection of different IDatabaseAccess instance refering to differen implementation
	 */
	@SuppressWarnings("rawtypes")
	private static Map dbAccessCollection;

	/**
	 * An instance of Logger
	 */
	private static Logger dbAFLogger;

}