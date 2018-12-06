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

package com.intellectdesign.canvas.alert.handler;

import com.intellectdesign.canvas.event.handler.HandlerException;

/**
 * This Exception class is responsible for alert framework related exception. This class extends the Canvas Exception Handler class, 
 * gets the error code of the exception and throws it with appropriate error messages.  
 * 
 * @see com.intellectdesign.canvas.event.handler.HandlerException
 * 
 * @version 1.0
 */
public class AlertHandlerException extends HandlerException
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -913667170557106974L;
	String sErrorCode = null;

	/**
	 * This method returns the ErrorCode from the alert exception object. 
	 * 
	 * @return sErrorCode String value of the Error Code
	 */
	public String getErrorCode()
	{
		return sErrorCode;
	}

	/**
	 * This method sets the ErrorCode in the alert exception object
	 * 
	 * @param sErrorCode String value of the sErrorCode
	 */
	public void setErrorCode(String sErrorCode)
	{
		this.sErrorCode = sErrorCode;
	}

	/**
	 * This method sets ErrorCode and its Error Message in the exception object
	 * 
	 * @param sErrorCode String value of ErrorCode
	 * @param sErrString String value of the Error Decription
	 */
	public AlertHandlerException(String sErrorCode, String sErrString)
	{
		super(sErrorCode, sErrString);
		this.sErrorCode = sErrorCode;
	}

	/**
	 * This method sets the ErrorCode of an exception caught
	 * 
	 * @param sErrorCode String value of the error code 
	 * @param exp Throwable exception object 
	 */
	public AlertHandlerException(String sErrorCode, Throwable exp)
	{
		super(sErrorCode, exp);
		this.sErrorCode = sErrorCode;
	}

	/**
	 * This method sets the ErrorCode and its Error Decription of an exception caught
	 * 
	 * @param sErrorCode String value of the error code
	 * @param sErrorMsg String value of the error message
	 * @param exp Throwable exception object 
	 */
	public AlertHandlerException(String sErrorCode, String sErrorMsg, Throwable exp)
	{
		super(sErrorCode, sErrorMsg, exp);
		this.sErrorCode = sErrorCode;
	}

}
