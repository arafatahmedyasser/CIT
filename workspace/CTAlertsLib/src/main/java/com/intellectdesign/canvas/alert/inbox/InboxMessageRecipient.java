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

package com.intellectdesign.canvas.alert.inbox;

import com.intellectdesign.canvas.alert.handler.IRecipient;

/**
 * This class provides message inbox channel specific implementation for Recipient details.
 *  
 * @version 1.0
 */
public class InboxMessageRecipient implements IRecipient
{
	/**
	 * To get the Gcif
	 * 
	 * @return the sGCIF
	 */
	public String getGcif()
	{
		return gcif;
	}

	/**
	 * To set the Gcif
	 * 
	 * @param sgcif the sGCIF to set
	 */
	public void setGcif(String gcif)
	{
		this.gcif = gcif;
	}

	/**
	 * To get the UserId
	 * 
	 * @return the UserId
	 */
	public String getUserId()
	{
		return userId;
	}

	/**
	 * To set the UserId
	 * 
	 * @param userId the sUserId to set
	 */
	public void setUserId(String userId)
	{
		this.userId = userId;
	}

	private String userId = null;
	private String gcif = null;
}
