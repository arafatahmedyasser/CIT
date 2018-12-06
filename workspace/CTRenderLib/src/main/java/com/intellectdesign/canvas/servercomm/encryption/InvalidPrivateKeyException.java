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
package com.intellectdesign.canvas.servercomm.encryption;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * Class to check Invalid Private Key Exception which extends base exception
 * 
 * @version 1.0
 */
public class InvalidPrivateKeyException extends BaseException
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -4802070448178948414L;

	/**
	 * Default constructor
	 */
	public InvalidPrivateKeyException()
	{
		super("ERROR_CODE", "Invalid Private Key Spec");
	}

	/**
	 * constructor taking error code as parameter
	 * 
	 * @param errorCode
	 */
	public InvalidPrivateKeyException(String errorCode)
	{
		super(errorCode);

	}

	/**
	 * constructor taking wrappedEx as parameter
	 * 
	 * @param wrappedEx
	 */
	public InvalidPrivateKeyException(Throwable wrappedEx)
	{
		super(wrappedEx);

	}

	/**
	 * constructor taking errorCode and wrappedEx as parameter
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public InvalidPrivateKeyException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);

	}

	/**
	 * constructor taking errorCode and errorMessage as parameter
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public InvalidPrivateKeyException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);

	}

	/**
	 * constructor taking errorCode , wrappedEx and errorMessage as parameter
	 * 
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public InvalidPrivateKeyException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);

	}

}
