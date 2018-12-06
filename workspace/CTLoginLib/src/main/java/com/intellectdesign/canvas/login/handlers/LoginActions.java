/**
 * Copyright 2016. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.login.handlers;

import java.util.HashMap;
import java.util.Map;

/**
 * This enumeration has all the actions handled as part of the login sequence
 */
public enum LoginActions
{
	/**
	 * Action used for indicating a Login action by the user.
	 */
	LOGIN("logn"),
	/**
	 * Action used for indicating a logout action by the user
	 */
	LOGOUT("logout"),
	/**
	 * Action used for indicating a session expiry has occurred.
	 */
	SESSION_EXPIRY("sessExpiry"),
	/**
	 * Action used to check whether multi login is a problem for the session
	 */
	VALIDATE_MULTI_LOGIN("sessionValidate"),
	/**
	 * Action used to request for extending the session
	 */
	EXTEND_SESSION("extendSession");

	private String action;
	private static Map<String, LoginActions> actionCache = null;

	private LoginActions(String actionCode)
	{
		action = actionCode;
	}

	/**
	 * This method does a valueOf lookup based on the action provided and not based on the constant name declared.
	 * 
	 * @param anAction The action for which the Enum constant is to be fetched
	 * @return The LoginActions corresponding to the action provided
	 * @exception IllegalArgumentException Thrown if the action provided is not a valid action defined in LoginActions
	 */
	public static LoginActions valueOfAction(String anAction)
	{
		synchronized (LoginActions.class)
		{
			if (actionCache == null)
			{
				actionCache = new HashMap<String, LoginActions>();
				for (LoginActions v : values())
				{
					actionCache.put(v.action, v);
				}
			}
		}
		LoginActions result = actionCache.get(anAction);
		if (result == null)
		{
			throw new IllegalArgumentException("No enum const " + LoginActions.class + "@action." + anAction);
		}

		return result;
	}

	public String toString()
	{
		return action;
	}
}
