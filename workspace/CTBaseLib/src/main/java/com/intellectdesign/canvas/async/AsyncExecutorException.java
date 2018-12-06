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
package com.intellectdesign.canvas.async;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This is the exception class that is used for any exception faced within the Async package
 * 
 * @Version 15.1
 */
public class AsyncExecutorException extends BaseException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -6806109427150643935L;

	/**
	 * @param errorCode
	 */
	public AsyncExecutorException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * @param wrappedEx
	 */
	public AsyncExecutorException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

	/**
	 * @param errorCode
	 * @param wrappedEx
	 */
	public AsyncExecutorException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * @param errorCode
	 * @param errorMessage
	 */
	public AsyncExecutorException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public AsyncExecutorException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

}
