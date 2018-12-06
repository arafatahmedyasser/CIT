/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.database;

import javax.transaction.UserTransaction;

import com.intellectdesign.canvas.classicdb.DataManager;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class provides a simple abstraction over the use of UserTrasnaction with a simple exception handling that will
 * help create a cleaner code
 * 
 * @Version 15.1
 */
public class TransactionManager
{
	private UserTransaction mTransaction;
	private boolean committed = false;

	/**
	 * The default constructor
	 */
	public TransactionManager()
	{

	}

	/**
	 * Begin a transaction
	 */
	public void begin()
	{
		if (mTransaction == null)
		{
			mTransaction = DataManager.getUserTransaction();
		}
		try{
			mTransaction.begin();	
		}
		catch(Exception ex){
		LOGGER.cterror("CTDBL00190", ex);
		}
		committed = false;
	}

	/**
	 * Commit the transaction.
	 * 
	 * @throws DatabaseException
	 */
	public void commit() throws DatabaseException
	{
		try
		{
			if (mTransaction != null && !committed)
			{
				mTransaction.commit();
				committed = true;
			}
		} catch (Exception e)
		{
			LOGGER.cterror("CTDBL00189", e);
			throw new DatabaseException(e);
		}
	}

	/**
	 * Rollback the transaction. If the transaction is already committed, then this does not do anything.
	 */
	public void rollback()
	{
		try
		{
			if ((mTransaction != null) && !committed)
			{
				mTransaction.rollback();
			}
		} catch (Exception e)
		{
			LOGGER.cterror("CTDBL00188", e);
		}

	}

	/**
	 * Logger for this class
	 */
	private static final Logger LOGGER = Logger.getLogger(TransactionManager.class);
}
