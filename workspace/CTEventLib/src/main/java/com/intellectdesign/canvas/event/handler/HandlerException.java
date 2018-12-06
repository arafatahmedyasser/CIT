/*************************************************************************
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
 *************************************************************************/
package com.intellectdesign.canvas.event.handler;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This is the base exception used within the Event framework for any exception scenarios faced.
 * 
 * @version 1.0
 */
public class HandlerException extends BaseException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 3130664939646483590L;

	/**
	 * This is constructor for HandlerException class
	 * @param sErrorCode
	 * @param sErrString
	 */
	public HandlerException(String sErrorCode)
	{
		super(sErrorCode);
	}

	/**
	 * This is constructor for HandlerException class
	 * @param sErrorCode
	 * @param sErrString
	 */
	public HandlerException(String sErrorCode, String sErrString)
	{
		super(sErrorCode, sErrString);
	}

	/**
	 * This is constructor for HandlerException class 
	 * @param sErrorCode
	 * @param exp
	 */
	public HandlerException(String sErrorCode, Throwable exp)
	{
		super(sErrorCode, exp);
	}

	/**
	 * This is constructor for HandlerException class
	 * @param sErrorCode
	 * @param sErrorMsg
	 * @param exp
	 */
	public HandlerException(String sErrorCode, String sErrorMsg, Throwable exp)
	{
		super(sErrorCode, sErrorMsg, exp);
	}
}
