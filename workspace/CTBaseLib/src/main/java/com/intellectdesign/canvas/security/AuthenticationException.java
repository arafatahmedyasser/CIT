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

package com.intellectdesign.canvas.security;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This exception is thrown by the authentication service provider / factory whenever any exception scenario is
 * encountered.
 * 
 * @version 1.0
 */
public class AuthenticationException extends BaseException
{

	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Constructs a new exception with the specified detail message.
	 * 
	 * @param message The detail message
	 */
	public AuthenticationException(String message)
	{
		super(message);
	}

	/**
	 * Constructs a new exception with the specified detail message and cause.
	 * 
	 * @param message The detail message
	 * @param cause The root cause
	 */
	public AuthenticationException(String message, Throwable cause)
	{
		super(message, cause);
	}

	/**
	 * Constructs a new exception with the specified cause and a detail message of (cause==null ? null :
	 * cause.toString()) (which typically contains the class and detail message of cause).
	 * 
	 * @param cause The root cause
	 */
	public AuthenticationException(Throwable cause)
	{
		super(cause);
	}
}
