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

/**
 * This class contains the Base Exception
 * 
 * @version 1.0
 */
public class BaseException extends Exception
{
	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Constructor with error code
	 */
	public BaseException(String errorCode)
	{
		this(errorCode, "no_error_message", null);
	}

	/**
	 * Constructor with exception to be wrapped
	 * 
	 * @param wrappedEx
	 */
	public BaseException(Throwable wrappedEx)
	{
		this("no_error_code", wrappedEx);
	}

	/**
	 * Constructor with exception to be wrapped
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public BaseException(String errorCode, Throwable wrappedEx)
	{
		this(errorCode, "no_error_message", wrappedEx);
	}

	/**
	 * Constructor with error code and message
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public BaseException(String errorCode, String errorMessage)
	{
		this(errorCode, errorMessage, null);
	}

	/**
	 * Constructor with error code, message and exception to be wrapped
	 * 
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public BaseException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorMessage, wrappedEx);
		this.errorCode = errorCode;
	}

	/**
	 * Sets the value of error code for the exception
	 * 
	 * @param errorCode
	 */
	public void setErrorCode(String errorCode)
	{
		this.errorCode = errorCode;
	}

	/**
	 * Gets the value of error code set for the exception
	 * 
	 * @return String Error code
	 */
	public String getErrorCode()
	{
		return errorCode;
	}

	/**
	 * Gets the value of error message/additional info set for the exception
	 * 
	 * @return String Additional info regarding the exception
	 */
	public String getErrorMessage()
	{
		return getMessage();
	}

	// Variable to Store Error Code relating to Exception
	protected String errorCode = null;

}
