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
 * Class to check Invalid Size Exception which extends base exception
 * 
 * @version 1.0
 */
public class InvalidSizeException extends BaseException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -8718003009002871498L;

	/**
	 * Default constructor
	 */
	public InvalidSizeException()
	{
		super("ERROR_CODE", "Invalid data size ");
	}

	/**
	 * constructor taking errorcode as parameter
	 * 
	 * @param errorCode
	 */
	public InvalidSizeException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * constructor taking wrappedEx as parameter
	 * 
	 * @param wrappedEx
	 */
	public InvalidSizeException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

	/**
	 * constructor taking errorcode and wrappedEx as parameter
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public InvalidSizeException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * constructor taking errorcode and errorMessage as parameter
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public InvalidSizeException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * constructor taking errorcode errorMessage and wrappedEx as parameter
	 * 
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public InvalidSizeException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

}
