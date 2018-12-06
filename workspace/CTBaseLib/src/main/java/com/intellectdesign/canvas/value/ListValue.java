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
package com.intellectdesign.canvas.value;

import java.io.Serializable;
import java.util.Map;

/**
 * This class is for ListValue
 * 
 * @version 1.0
 */
public class ListValue implements Serializable
{

	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	private String code;
	private String desc;
	private String screenCode;
	private String value;
	private String isCorpPreference;

	/**
	 * additionalProperties hold the sub-attributes of the 'code' variable based on the Preference value.
	 * 
	 * Example, for LANGUAGE Preferences, additionalProperties HashMap have the DIRECTION key-value pair. for URL
	 * Preferences, the screenCode variable denotes the SCREEN_CODE. if a preference doesn't have any additional
	 * property then, additionalProperties is null.
	 * 
	 */

	private Map<String, String> additionalProperties;

	/**
	 * Default constructor, does nothing
	 */
	public ListValue()
	{
	}

	/**
	 * sets the code and desc in the Listvalue
	 * 
	 * @param code
	 * @param desc
	 */
	public ListValue(String code, String desc)
	{
		this.code = code;
		this.desc = desc;
	}

	/**
	 * sets the code, desc and screen_code in the Listvalue
	 * 
	 * @param code
	 * @param desc
	 * @param screen_code
	 */
	public ListValue(String code, String desc, String screen_code)
	{
		this.code = code;
		this.desc = desc;
		this.screenCode = screen_code;
	}

	/**
	 * sets the code, desc, value and screen_code in the Listvalue
	 * 
	 * @param code
	 * @param desc
	 * @param screen_code
	 * @param value
	 */
	public ListValue(String code, String desc, String screen_code, String value)
	{
		this.code = code;
		this.desc = desc;
		this.screenCode = screen_code;
		this.value = value;
	}

	/**
	 * sets the code, desc, value, isCorpPreference and screen_code in the Listvalue
	 * 
	 * @param code
	 * @param desc
	 * @param screen_code
	 * @param value
	 * @param isCorpPreference
	 */
	public ListValue(String code, String desc, String screen_code, String value, String isCorpPreference)
	{
		this.code = code;
		this.desc = desc;
		this.screenCode = screen_code;
		this.value = value;
		this.isCorpPreference = isCorpPreference;
	}

	/**
	 * sets the code, desc, value, isCorpPreference,additionalProperties and screen_code in the Listvalue
	 * 
	 * @param code
	 * @param desc
	 * @param additionalProperties
	 * @param value
	 * @param isCorpPreference
	 */
	public ListValue(String code, String desc, Map<String, String> additionalProperties, String value,
			String isCorpPreference)
	{
		this.code = code;
		this.desc = desc;
		this.additionalProperties = additionalProperties;
		this.value = value;
		this.isCorpPreference = isCorpPreference;
	}

	/**
	 * @return the code
	 */
	public String getCode()
	{
		return code;
	}

	/**
	 * set the code to Sting
	 * 
	 * @param code the code to set
	 */
	public void setCode(String code)
	{
		this.code = code;
	}

	/**
	 * set code to String return desc
	 * 
	 * @return the desc
	 */
	public String getDesc()
	{
		return desc;
	}

	/**
	 * set code to the des String
	 * 
	 * @param desc the desc to set
	 */
	public void setDesc(String desc)
	{
		this.desc = desc;
	}

	/**
	 * set code to the string return getScreenMode
	 * 
	 * @return the screenCode
	 */
	public String getScreenCode()
	{
		return screenCode;
	}

	/**
	 * set code to the string return setScreenMode
	 * 
	 * @param screenCode the screenCode to set
	 */
	public void setScreenCode(String screenCode)
	{
		this.screenCode = screenCode;
	}

	/**
	 * return to string value
	 * 
	 * @return the value
	 */
	public String getValue()
	{
		return value;
	}

	/**
	 * set to string value
	 * 
	 * @param value the value to set
	 */
	public void setValue(String value)
	{
		this.value = value;
	}

	/**
	 * set to ref IsCorpreference
	 * 
	 * @return the isCorpPreference
	 */
	public String getIsCorpPreference()
	{
		return isCorpPreference;
	}

	/**
	 * set to ref SetIsCorpreference
	 * 
	 * @param isCorpPreference the isCorpPreference to set
	 */
	public void setIsCorpPreference(String isCorpPreference)
	{
		this.isCorpPreference = isCorpPreference;
	}

	/**
	 * set to return Map Additional Properties
	 * 
	 * @return the additionalProperties
	 */
	public Map<String, String> getAdditionalProperties()
	{
		return additionalProperties;
	}

	/**
	 * set to return Map Additional Properties
	 * 
	 * @param additionalProperties the additionalProperties to set
	 */
	public void setAdditionalProperties(Map<String, String> additionalProperties)
	{
		this.additionalProperties = additionalProperties;
	}
}
