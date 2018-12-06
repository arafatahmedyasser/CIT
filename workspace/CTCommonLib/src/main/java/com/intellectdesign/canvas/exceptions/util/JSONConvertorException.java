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

package com.intellectdesign.canvas.exceptions.util;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This class contains the JSON Convertor Exception
 * 
 * @version 1.0
 */
public class JSONConvertorException extends BaseException
{
	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * ref to JSONConvertorException
	 * 
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public JSONConvertorException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

	/**
	 * ref to JSONConvertorException
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public JSONConvertorException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * ref to JSONConvertorException
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public JSONConvertorException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * ref to JSONConvertorException
	 * 
	 * @param errorCode
	 */
	public JSONConvertorException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * ref to JSONConvertorException
	 * 
	 * @param wrappedEx
	 */
	public JSONConvertorException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}
}
