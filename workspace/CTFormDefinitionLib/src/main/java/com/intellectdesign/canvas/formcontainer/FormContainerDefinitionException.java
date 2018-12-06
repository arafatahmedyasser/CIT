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
 * */

package com.intellectdesign.canvas.formcontainer;

import com.intellectdesign.canvas.exceptions.common.OnlineException;

/**
 * This is sub class of {@link OnlineException} exception class which is a form of throwable calss. 
 * This FormContainerDefinition exception is thrown to all the callers when there is an exception 
 * faced while processing of any request containing invalid entry in FORM_CONTAINER_DEFINITION table.
 * 
 * @version 1.0
 */
public class FormContainerDefinitionException extends OnlineException
{

	/**
	 * Internal field used for handling serializable option
	 */
	private static final long serialVersionUID = -716715952232226452L;

	/**
	 * The default constructor
	 */
	public FormContainerDefinitionException()
	{
		super();
	}

	/**
	 * This is an overloaded constructor, which constructs a new exception with the specified root cause.
	 * 
	 * @param rootCause - Exception object that contains the exception cause or null 	
	 */
	public FormContainerDefinitionException(Exception rootCause)
	{
		super(rootCause);
	}

	/**
	 * This is an overloaded constructor, which constructs a new exception with error code and message.
	 * 
	 * @param errorCode - String value of exception message code
	 * @param errorMessage - String value of exception error message 
	 */
	public FormContainerDefinitionException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

}
