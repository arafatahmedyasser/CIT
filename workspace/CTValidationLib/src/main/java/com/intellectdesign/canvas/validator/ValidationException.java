/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 **/
package com.intellectdesign.canvas.validator;
/**
 * This class is for ValidationExceptions
 * 
 * @version 1.0
 */
public class ValidationException extends Exception
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -3401301819861519487L;

	/**
	 * Default constructor, does nothing
	 */
	public ValidationException()
	{
	}

	/**
	 * Super class Constructor with String as param
	 * 
	 * @param exception
	 */
	public ValidationException(String exception)
	{
		super(exception);
	}

	/**
	 * Super class Constructor with Exception as param
	 * 
	 * @param exception
	 */
	public ValidationException(Exception exception)
	{
		super(exception);
	}
}
