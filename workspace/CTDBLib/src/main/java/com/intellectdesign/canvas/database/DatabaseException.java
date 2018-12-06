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

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This class wraps any SQLException thrown in the database layer
 * 
 * @version 1.0
 * 
 */
public class DatabaseException extends BaseException
{

	/**
	 * Default serial version UID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * The default constructor. Creates an empty DatabaseException
	 */
	public DatabaseException()
	{
		super("error_from_dbfw");
	}

	/**
	 * This constructor is also a frequently used one. All SQLExceptions are nested with the help of this constructor
	 * 
	 * @param message String, the exception message
	 */
	public DatabaseException(String message)
	{
		super("error_from_dbfw", message);
	}

	/**
	 * This constructor is frequently used one in the database layer. All SQLExceptions are nested with the help of this
	 * constructor along with a custom message
	 * 
	 * @param message String, the exception message
	 * @param cause Throwable, the nested exception
	 */
	public DatabaseException(String message, Throwable cause)
	{
		super("error_from_dbfw", message, cause);
	}

	/**
	 * This constructor is also a frequently used one. All SQLExceptions are nested with the help of this constructor
	 * 
	 * @param cause Throwable, the nested exception
	 */
	public DatabaseException(Throwable cause)
	{
		super("error_from_dbfw", cause);
	}

}
