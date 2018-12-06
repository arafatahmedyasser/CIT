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

package com.intellectdesign.canvas.exceptions.common;

import java.rmi.RemoteException;

/**
 * This class contains the Online Exception
 * 
 * @version 1.0
 */
public class OnlineException extends RemoteException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 4745336985507394485L;
	String strErrorCode = null;
	String strErrorMessage = null;

	/**
	 * Default constructor does nothing
	 */
	public OnlineException()
	{
	}

	/**
	 * Sets errorCode and ErrorMessage
	 * 
	 * @param strErrorCode
	 * @param strErrorMessage
	 */
	public OnlineException(String strErrorCode, String strErrorMessage)
	{
		this.strErrorCode = strErrorCode;
		this.strErrorMessage = strErrorMessage;
	}

	/**
	 * Sets Exception ex
	 * 
	 * @param ex
	 * 
	 */
	public OnlineException(Throwable ex)
	{
		super(ex.getMessage(), ex);
		this.strErrorMessage = ex.getMessage();
		this.strErrorCode = "SYSERROR";
	}

	/**
	 * sets the error code and cause
	 * 
	 * @param strErrorCode
	 * @param cause
	 */
	public OnlineException(String strErrorCode, Throwable cause)
	{
		super(strErrorCode, cause);
		this.strErrorMessage = cause.getMessage();
		this.strErrorCode = strErrorCode;
	}

	/**
	 * Returns errorcode and errormessage
	 */
	public String getMessage()
	{
		return strErrorCode + ":" + strErrorMessage;
	}

	/**
	 * Returns errorCode
	 * 
	 * @return strErrorCode
	 */
	public String getErrorCode()
	{
		return strErrorCode;
	}

}
