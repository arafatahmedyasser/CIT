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
package com.intellectdesign.canvas.preferences;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This class is for PreferenceException containing BaseException
 * 
 * @version 1.0
 */
public class PreferenceException extends BaseException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -8951877416015089191L;

	/**
	 * this is ref to PreferenceException Constructor with error code
	 */
	public PreferenceException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * this is ref to PreferenceException
	 * 
	 * @param throwable,wrappedex Constructor with exception to be wrapped
	 */
	public PreferenceException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

	/**
	 * this is ref to PreferenceException
	 * 
	 * @param String errorcode Constructor with exception to be wrapped
	 */
	public PreferenceException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * @param string errorcode,message Constructor with error code and message
	 */
	public PreferenceException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * Constructor with error code, message and exception to be wrapped
	 */
	public PreferenceException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

}
