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

package com.intellectdesign.canvas.entitlement;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * Class to handle Entitlement exception
 * 
 * @version 1.0
 */
public class EntitlementException extends BaseException
{
	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Constructor that takes errorCode and wrappedEx as parameter
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public EntitlementException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * Constructor that takes errorCode as parameter
	 * 
	 * @param errorCode
	 */
	public EntitlementException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * Constructor that takes wrappedEx as parameter
	 * 
	 * @param wrappedEx
	 */
	public EntitlementException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

	/**
	 * Constructor that takes strErrorCode and strErrorMessage as parameter
	 * 
	 * @param strErrorCode
	 * @param strErrorMessage
	 */
	public EntitlementException(String strErrorCode, String strErrorMessage)
	{
		super(strErrorCode, strErrorMessage);
	}

	/**
	 * Constructor that takes strErrorCode,strErrorMessagen and Exception as parameter
	 * 
	 * @param strErrorCode
	 * @param strErrorMessage
	 * @param e
	 */
	public EntitlementException(String strErrorCode, String strErrorMessage, Exception e)
	{
		super(strErrorCode, strErrorMessage, e);
	}
}