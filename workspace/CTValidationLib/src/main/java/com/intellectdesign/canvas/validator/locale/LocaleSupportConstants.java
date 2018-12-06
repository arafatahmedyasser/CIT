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

/**
 *  This class  is for Putting a private constructor to ensure that an instance of this class is not created. 
 * 
 * @version 1.0
 */
public class LocaleSupportConstants
{
	private LocaleSupportConstants()
	{

		{

		}
	}

	public static final String LOCALE_SPANISH = "es_ES";
	public static final String LOCALE_ENGLISH = "en_US";
	public static final String LOCALE_SIMPLIFIED_CHINESE = "ec_CH";
	public static final String LOCALE_SWIFT = "SWIFT";
	public static final int LANG_CODE_START_INDEX = 0;
	public static final int LANG_CODE_END_INDEX = 2;
	public static final int COUNTRY_CODE_START_INDEX = 3;

	public static final String LOCALE_SPANISH_CLASS = "com.intellectdesign.canvas.validator.locale.SpanishLocale";
	public static final String LOCALE_ENGLISH_CLASS = "com.intellectdesign.canvas.validator.locale.EnglishLocale";
	public static final String LOCALE_SWIFT_CLASS = "com.intellectdesign.canvas.validator.locale.SwiftCharacterSet";
	public static final String ANYLOCALE_ANYLANGUAGE_CLASS = "com.intellectdesign.canvas.validator.locale.AnyCharacterLocale";

	public static final String LOCALE_ARABIC = "ar_SA";
	public static final String LOCALE_ARABIC_CLASS = "com.intellectdesign.canvas.validator.locale.ArabicLocale";

	public static boolean isLocaleChinese(String locale)
	{
		return LOCALE_SIMPLIFIED_CHINESE.equals(locale);
	}
}
