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

package com.intellectdesign.canvas.viewdefinition;

import com.intellectdesign.canvas.exceptions.common.OnlineException;

/**
 * This class is for view definition exception extends online exception
 * 
 * @version 1.0
 */
public class ViewDefinitionException extends OnlineException
{

	/**
	 * Internal field used for handling serializable option
	 */
	private static final long serialVersionUID = -716715952232226452L;

	/**
	 * The default constructor
	 */
	public ViewDefinitionException()
	{
		super();
	}

	/**
	 * Overloaded constructor taking the root cause exception
	 * 
	 * @param rootCause
	 */
	public ViewDefinitionException(Throwable rootCause)
	{
		super(rootCause);
	}

	/**
	 * Overloaded constructor taking error code and error message.
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public ViewDefinitionException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * Overloaded constructor taking error code and exception details
	 * 
	 * @param errorCode
	 * @param rootCause
	 */
	public ViewDefinitionException(String errorCode, Throwable rootCause)
	{
		super(errorCode, rootCause);
	}

}
