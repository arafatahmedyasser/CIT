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

package com.intellectdesign.canvas.utils.httpheader;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;

import nl.bitwalker.useragentutils.UserAgent;

/**
 * This class is used to interpret the user Agent component of the request header to get more information on the browser
 * an the system that the user is using.
 * 
 * @version 1.0
 */
public class HttpHeaderInterpreter
{

	HashMap transactionData = null;

	/**
	 * methodref to String HttpHeaderInterpter VersionNumber
	 * 
	 * @param a_userAgent
	 * @param a_position
	 * @return String
	 */
	public static String getVersionNumber(String a_userAgent, int a_position)
	{
		if (a_position < 0)
			return "";
		StringBuffer res = new StringBuffer();
		int status = 0;
		while (a_position < a_userAgent.length())
		{
			char c = a_userAgent.charAt(a_position);
			switch (status)
			{
			case 0:
				if (c == ' ' || c == '/')
					break;
				if (c == ';' || c == ')')
					return "";
				status = 1;
			case 1:
				if (c == ';' || c == '/' || c == ')' || c == '(' || c == '[')
					return res.toString().trim();
				if (c == ' ')
					status = 2;
				res.append(c);
				break;
			case 2:
				if ((Character.isLetter(c) && Character.isLowerCase(c)) || Character.isDigit(c))
				{
					res.append(c);
					status = 1;
				} else
					return res.toString().trim();
				break;
			}
			a_position++;
		}
		return res.toString().trim();
	}

	/**
	 * method ref to string GetFirstVersionNumber
	 * 
	 * @param a_userAgent
	 * @param a_position
	 * @param numDigits
	 * @return String
	 */
	public static String getFirstVersionNumber(String a_userAgent, int a_position, int numDigits)
	{
		String ver = getVersionNumber(a_userAgent, a_position);
		if (ver == null)
			return "";
		int i = 0;
		String res = "";
		while (i < ver.length() && i < numDigits)
		{
			res += String.valueOf(ver.charAt(i));
			i++;
		}
		return res;
	}

	/**
	 * method ref to srting to arry result
	 * 
	 * @param a
	 * @param b
	 * @param c
	 * @return String[]
	 */
	public static String[] getArray(String a, String b, String c)
	{
		String[] res = new String[3];
		res[0] = a;
		res[1] = b;
		res[2] = c;
		return res;
	}

	/**
	 * method ref to String BotName Useragent
	 * 
	 * @param userAgent
	 * @return String[]
	 */
	public static String[] getBotName(String userAgent)
	{
		userAgent = userAgent.toLowerCase();
		int pos = 0;
		String res = null;
		if ((pos = userAgent.indexOf("google/")) > -1)
		{
			res = "Google";
			pos += 7;
		} else if ((pos = userAgent.indexOf("msnbot/")) > -1)
		{
			res = "MSNBot";
			pos += 7;
		} else if ((pos = userAgent.indexOf("googlebot/")) > -1)
		{
			res = "Google";
			pos += 10;
		} else if ((pos = userAgent.indexOf("webcrawler/")) > -1)
		{
			res = "WebCrawler";
			pos += 11;
		} else
		// The following two bots don't have any version number in their User-Agent strings.
		if ((pos = userAgent.indexOf("inktomi")) > -1)
		{
			res = "Inktomi";
			pos = -1;
		} else if ((pos = userAgent.indexOf("teoma")) > -1)
		{
			res = "Teoma";
			pos = -1;
		}
		if (res == null)
			return null;
		return getArray(res, res, res + getVersionNumber(userAgent, pos));
	}

	/**
	 * method ref to Str GetOs UserAgent
	 * 
	 * @param userAgent
	 * @return String[]
	 */
	public static String[] getOS(String userAgent)
	{

		UserAgent userAgent1 = new UserAgent(userAgent);
		String[] res = new String[3];
		String opSystem = userAgent1.getOperatingSystem().toString();
		res[0] = opSystem;

		return res;
	}

	/**
	 * method REF to Str Browser User
	 * 
	 * @param userAgent
	 * @return String[]
	 */
	public static String[] getBrowser(String userAgent)
	{
		String[] res = new String[1];
		String loginBrowser = new String();
		try
		{
			UserAgent userAgent1 = new UserAgent(userAgent);

			String browser = String.valueOf(userAgent1.getBrowser());
			String browserVersion = String.valueOf(userAgent1.getBrowserVersion());
			if (browser != null && !"".equals(browser))
			{
				loginBrowser = browser;
				if (browserVersion != null && !"".equals(browserVersion))
				{
					loginBrowser = loginBrowser + "-" + browserVersion;
				}
			} else
			{
				loginBrowser = "UnKnown Browser";
			}
		} catch (Exception e)
		{
			loginBrowser = "UnKnown Browser";
		}
		res[0] = loginBrowser;

		return res;
	}

	/**
	 * method ref to Returns the WebServerIP;
	 * 
	 * @throws UnknownHostException
	 * @return String
	 */
	public String getCurrentServerIPAddress()
	{
		String webServerIp = null;
		try
		{
			InetAddress inet = InetAddress.getLocalHost();
			webServerIp = inet.getHostAddress();
		} catch (Exception ex)
		{
			// Ignore the exception
		}
		return webServerIp;

	}

	/**
	 * method ref to Returns the Browser info;
	 * 
	 * @param userAgent
	 * @return String
	 */
	public String resolveBrowserInfo(String userAgent)
	{
		String browserDetais[] = getBrowser(userAgent);
		return browserDetais[0];
	}

	/**
	 * ref to methd Returns the OS info;
	 * 
	 * @param userAgent
	 * @return String
	 */
	public String resolveOSInfo(String userAgent)
	{
		String browserDetais[] = getOS(userAgent);
		return browserDetais[0];
	}

}
