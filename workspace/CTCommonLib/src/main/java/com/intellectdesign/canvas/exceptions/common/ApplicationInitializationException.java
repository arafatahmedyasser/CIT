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

import javax.servlet.ServletException;

/**
 * This class contains the Application Initialization Exception
 * 
 * @version 1.0
 */
public class ApplicationInitializationException extends ServletException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 3408553072871101803L;

	/**
	 * ref to ApplicationInitializationException
	 * 
	 * @param message
	 */
	public ApplicationInitializationException(String message)
	{
		super(message);
	}

	/**
	 * ref to ApplicationInitializationException
	 * 
	 * @param cause
	 */
	public ApplicationInitializationException(Throwable cause)
	{
		super(cause);
	}

	/**
	 * ref to ApplicationInitializationException
	 * 
	 * @param message
	 * @param cause
	 */
	public ApplicationInitializationException(String message, Throwable cause)
	{
		super(message, cause);
	}

	/**
	 * ref to ApplicationInitializationException
	 * 
	 * @param strErrorCode
	 * @param strErrorMessage
	 */
	public ApplicationInitializationException(String strErrorCode, String strErrorMessage)
	{
		this.strErrorCode = strErrorCode;
		this.strErrorMessage = strErrorMessage;
	}

	/**
	 * ref to StrMsg
	 * 
	 * @return str error
	 * @see java.lang.Throwable#getMessage()
	 */
	public String getMessage()
	{
		return strErrorMessage;
	}

	/**
	 * ref to Str GetError
	 * 
	 * @return str error
	 */
	public String getErrorCode()
	{
		return strErrorCode;
	}

	private String strErrorCode = "SYSERR";
	private String strErrorMessage = null;
}
