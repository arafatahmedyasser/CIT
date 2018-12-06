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

package com.intellectdesign.canvas.utils;

import java.util.List;
import java.util.Map;

/**
 * This class contains the Channel Utils
 * 
 * @version 1.0
 */
public class ChannelUtils
{
	/**
	 * Returns true if login device and configured device is same else return false;
	 * 
	 * @param configItems - value that configured in data base on which device to render
	 * @param device - value contains login device means if he login from mobile it contains 'M' so on
	 */
	public static boolean getDeviceFilter(String configItems, String device)
	{

		boolean deviceflag = false;
		if (configItems != null && configItems != "" && device != null && device != "")
		{
			if (configItems.contains(device))
			{
				deviceflag = true;
			} else if (configItems.equalsIgnoreCase("A") || configItems.isEmpty())
			{
				deviceflag = true;
			}

		}

		return deviceflag;

	}

	/**
	 * Returns true if login device and configured device is same else return false;
	 * 
	 * @param configItems - value that configured in data base on which device to render
	 * @param deviceTools - value contains login device means if he login from mobile it contains 'M' so on
	 */

	public static boolean getToolsConfig(List<Map> deviceTools, String configItems)
	{

		boolean deviceflag = false;
		if (deviceTools.size() > 0)
		{

			for (Map aTool : deviceTools)
			{
				if (configItems.equals(aTool.get("TOOL_ID")))
				{
					deviceflag = true;
				}
			}

		}
		return deviceflag;

	}

	/**
	 * Returns the corresponding channelID for the particular deviceType
	 * 
	 * @param device - value contains login device means if he login from mobile it contains 'M' so on
	 */

	public static String getDeviceType(String device,boolean isHybrid)
	{

		String channelID = "3";

		if (("M").equalsIgnoreCase(device))
		{
			channelID = "1";
			if (isHybrid)
			{
				channelID = "2";
			}

		} else if ("T".equalsIgnoreCase(device))
		{
			channelID = "5";
			if (isHybrid)
			{
				channelID = "4";
			}
		}

		return channelID;

	}
}
