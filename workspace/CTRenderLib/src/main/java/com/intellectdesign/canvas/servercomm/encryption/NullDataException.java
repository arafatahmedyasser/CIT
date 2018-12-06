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
 * Class to check Null data exception which extends base exception
 * 
 * @version 1.0
 */
public class NullDataException extends BaseException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 38120664429435062L;

	/**
	 * Default Constructor
	 */
	public NullDataException()
	{
		super("Data is NULL");
	}

	/**
	 * Constructor taking errorCode as parameter
	 * 
	 * @param errorCode
	 */
	public NullDataException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * Constructor taking wrappedEx as parameter
	 * 
	 * @param wrappedEx
	 */
	public NullDataException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

	/**
	 * Constructor taking wrappedEx,errorCode as parameters
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public NullDataException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * Constructor taking errorMessage,errorCode as parameters
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public NullDataException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * Constructor taking errorMessage,errorCode,wrappedEx as parameters
	 * 
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public NullDataException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

}
