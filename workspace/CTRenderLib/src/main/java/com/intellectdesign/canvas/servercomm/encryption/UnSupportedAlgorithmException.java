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
 * Class to handle unsupported algorithm
 * 
 * @version 1.0
 */
public class UnSupportedAlgorithmException extends BaseException
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -1131807269638520981L;

	/**
	 * Default Constructor
	 */
	public UnSupportedAlgorithmException()
	{
		super("ERROR_CODE", "Algorithm not supported by the provider, Please check your Cryptography provider");
	}

	/**
	 * Constructor taking erroCode as parameter
	 * 
	 * @param errorCode
	 */
	public UnSupportedAlgorithmException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * Constructor taking wrappedEx as parameter
	 * 
	 * @param wrappedEx
	 */
	public UnSupportedAlgorithmException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

	/**
	 * Constructor taking wrappedEx and errorCode as parameters
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public UnSupportedAlgorithmException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * Constructor taking errorMessage and errorCode as parameters
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public UnSupportedAlgorithmException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * Constructor taking errorMessage,wrappedEx and errorCode as parameters
	 * 
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public UnSupportedAlgorithmException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

}
