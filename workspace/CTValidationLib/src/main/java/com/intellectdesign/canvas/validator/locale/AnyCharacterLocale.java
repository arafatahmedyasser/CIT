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
package com.intellectdesign.canvas.validator.locale;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
/**
 * This class is for Any character Locale ensures that except for the list of invalid characters it accepts any character This was created
 * as make shift locale class for chinese locale. IT extends the English Locale to inherit the default values (which any
 *
 * @version 1.0
 */
public class AnyCharacterLocale extends ValidCharacterSet
{
	/**
	 * Internal constant for serialization purposes
	 */
	@Override
	/**
	 * Overriding the default to ensure that it check for the list of invalid characters configured in the property
	 * file. These invalid characters should not be allowed no matter what locale one is in, as they are being used for
	 * XSS attacks.
	 * 
	 * @return true if fielddata does not contain any invalid character, false otherwise
	 */
	public boolean isValid(String fieldData)
	{

		char[] inputData = fieldData.toCharArray();
		boolean isValid = true;
		for (int count = 0; count < inputData.length; count++)
		{
			if (INVALID_CHARS.indexOf(String.valueOf(inputData[count])) > -1)// this means an invalid character is
																				// present in the string
			{
				logger.ctdebug("CTVAL00033", fieldData, inputData[count], count);
				return false;
			}
		}
		return isValid;
	}

	@Override
	/**
	 * this character set has all the the characters and hence there is nothing can be attribute as Alpha
	 *  @return char[]
	 */
	protected char[] alphaCharSet()
	{
		return BLANK_CHARACTER_SET;
	}

	@Override
	/**
	 * this character set has all the the characters and hence there is nothing can be attribute as entire
	 *  @return char[]
	 */
	protected char[] alphaNumericCharSet()
	{
		return BLANK_CHARACTER_SET;
	}

	@Override
	/**
	 * 
	 * this character set has all the the characters and hence there is nothing can be attribute as numeric
	 * @return char[]
	 */
	protected char[] numericCharSet()
	{
		return BLANK_CHARACTER_SET;
	}

	private static Logger logger = Logger.getLogger(AnyCharacterLocale.class);
	private static ConfigurationManager confgMngr = ConfigurationManager.getInstance();
	private static final String INVALID_CHARS = confgMngr.getSystemPrefDescriptor().getInvalidChars();

}
