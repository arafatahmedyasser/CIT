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

package com.intellectdesign.canvas.utils.timezone;

import java.io.Serializable;
import java.util.Map;

import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;

/**
 * This class contains the Time Zone Data
 * 
 * @version 1.0
 */
public final class TimeZoneData implements Serializable
{

	/**
	 * Internal constant for serialization purposes.
	 */
	private static final long serialVersionUID = 1744403859381645976L;

	private String code;
	private String gmtOffset;
	private String regionCode;
	private String nickname;
	private String description;

	/**
	 * The only constructor of this class.
	 */
	public TimeZoneData(Map<String, String> zoneData)
	{
		setCode(zoneData.get(PreferenceConstants.TZ_KEY_CODE));
		setGmtOffset(zoneData.get(PreferenceConstants.TZ_KEY_GMTOFFSET));
		setRegionCode(zoneData.get(PreferenceConstants.TZ_KEY_REGIONCODE));
		setNickname(zoneData.get(PreferenceConstants.TZ_KEY_NICKNAME));
		setDescription(zoneData.get(PreferenceConstants.TZ_KEY_DESCRIPTION));
	}

	/**
	 * The unique code for this timezone
	 * 
	 * @return the code
	 */
	public final String getCode()
	{
		return code;
	}

	/**
	 * The GMT Offset for this timezone
	 * 
	 * @return the gmtOffset
	 */
	public final String getGmtOffset()
	{
		return gmtOffset;
	}

	/**
	 * The region code for this timmezone
	 * 
	 * @return the regionCode
	 */
	public final String getRegionCode()
	{
		return regionCode;
	}

	/**
	 * The nickname for this timezone
	 * 
	 * @return the nickname
	 */
	public final String getNickname()
	{
		return nickname;
	}

	/**
	 * The description of this timezone
	 * 
	 * @return the description
	 */
	public final String getDescription()
	{
		return description;
	}

	/**
	 * The unique code of this timezone
	 * 
	 * @param code the code to set
	 */
	private void setCode(String code)
	{
		this.code = code;
	}

	/**
	 * The GMT offset for this timezone
	 * 
	 * @param gmtOffset the gmtOffset to set
	 */
	private void setGmtOffset(String gmtOffset)
	{
		this.gmtOffset = gmtOffset;
	}

	/**
	 * The region code of this timezone
	 * 
	 * @param regionCode the regionCode to set
	 */
	private void setRegionCode(String regionCode)
	{
		this.regionCode = regionCode;
	}

	/**
	 * The nickname of this timezone
	 * 
	 * @param nickname the nickname to set
	 */
	private void setNickname(String nickname)
	{
		this.nickname = nickname;
	}

	/**
	 * The description of this timezone
	 * 
	 * @param description the description to set
	 */
	private void setDescription(String description)
	{
		this.description = description;
	}

}
