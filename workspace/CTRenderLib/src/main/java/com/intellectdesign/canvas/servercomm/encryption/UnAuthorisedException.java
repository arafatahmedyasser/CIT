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
 */
package com.intellectdesign.canvas.servercomm.encryption;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * Class to handle Unauthorised exception
 * 
 * @version 1.0
 */
public class UnAuthorisedException extends BaseException
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 2914909421375994315L;

	/**
	 * Default constructor
	 */
	public UnAuthorisedException()
	{
		super("ERROR_CODE", "Access denied");
	}

	/**
	 * Constructor taking errorCode as parameter
	 * 
	 * @param errorCode
	 */
	public UnAuthorisedException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * Constructor taking wrappedEx as parameter
	 * 
	 * @param wrappedEx
	 */
	public UnAuthorisedException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

	/**
	 * Constructor taking wrappedEx and errorCode as parameter
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public UnAuthorisedException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * Constructor taking errorMessage and errorCode as parameter
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public UnAuthorisedException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * Constructor taking errorMessage ,wrappedEx and errorCode as parameter
	 * 
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public UnAuthorisedException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

}
