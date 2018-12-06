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
package com.intellectdesign.canvas.config;

/**
 * This class contains the configuration exceptions
 * @version 1.0
 */
public class ConfigurationException extends RuntimeException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 1965205307773503414L;

	/**
	 * ref to ConfigException
	 * 
	 * @param errorCode The error code
	 * @param errorMessage The error message
	 * @param wrappedEx The root cause
	 */
	public ConfigurationException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorMessage, wrappedEx);
	}

	/**
	 * ref to ConfigException
	 * 
	 * @param errorCode The error code
	 * @param errorMessage The error message
	 */
	public ConfigurationException(String errorCode, String errorMessage)
	{
		super(errorMessage);
	}

	/**
	 * ref to ConfigException
	 * 
	 * @param errorCode The error code
	 * @param wrappedEx The root cause
	 */
	public ConfigurationException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * ref to Config Exception
	 * 
	 * @param errorCode The error code
	 */
	public ConfigurationException(String errorCode)
	{
		super(errorCode);
	}
}
