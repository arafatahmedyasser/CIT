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
package com.intellectdesign.canvas.exceptions.common;

/**
 * This class contains the Reauthentication Exception
 * 
 * @version 1.0
 */
public class ReauthenticationException extends BaseException
{

	private static final long serialVersionUID = 1L;

	/**
	 * ref to ReauthenticationException
	 * 
	 * @param errorCode
	 * @param rootCause
	 */
	public ReauthenticationException(String errorCode, Exception rootCause)
	{
		super(errorCode, rootCause);
	}

	/**
	 * ref to ReauthenticationException
	 * 
	 * @param errorCode
	 */
	public ReauthenticationException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * ref to ReauthenticationException
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public ReauthenticationException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}
}
