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

/**
 * The Enum class which is responsible for error codes and the corresponding errors.
 * 
 * @version 1.0
 */
public enum ErrorEnum
{
	NULL_DATA("1001"), INVALID_KEY("1002"), ENCRYPTION_ERROR("1003"), DECRYPTION_ERROR("1004"), CONFIGURATION_ERROR(
			"1005");

	private String errorNumber;

	/**
	 * constructor taking errorcode as parameter
	 * 
	 * @param errorCode
	 */

	private ErrorEnum(String errorCode)
	{

		errorNumber = errorCode;
	}

	/**
	 * get the error code
	 * 
	 * @return errorNumber
	 */
	public String getErrorCode()
	{

		return errorNumber;
	}
}
