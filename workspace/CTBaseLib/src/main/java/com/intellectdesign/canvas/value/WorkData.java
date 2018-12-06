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
/**
 * WorkData.java
 *
 * 
 */

package com.intellectdesign.canvas.value;

import java.io.Serializable;

/**
 * This class is for WorkData
 * 
 * @version 1.0
 */
public class WorkData implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -7754716696446525396L;
	/**
	 * Container Values..
	 */
	private String messageID = "";
	private String appID = "";
	private String doi = "";
	private String dom = "";
	private String msgHeader = "";
	private String msgBody = "";
	private String status = "";
	private int retryCount = 0;
	private String errorCode = "";
	private String errorMessage = "";

	/** Creates a new instance of WorkData */
	public WorkData()
	{

	}

	/**
	 * Constructor that takes the following parameters
	 * 
	 * @param msgid String
	 * @param appid String
	 * @param doi String
	 * @param dom String
	 * @param msghdr String
	 * @param msgbody String
	 * @param status String
	 */
	public WorkData(String msgid, String appid, String doi, String dom, String msghdr, String msgbody, String status)
	{
		this();
		this.messageID = msgid;
		this.appID = appid;
		this.doi = doi;
		this.dom = dom;
		this.msgHeader = msghdr;
		this.msgBody = msgbody;
		this.status = status;
	}

	/**
	 * Returns messageID
	 * 
	 * @return String
	 */
	public String getMessageID()
	{
		return this.messageID;
	}

	/**
	 * Returns APPID
	 * 
	 * @return String
	 */
	public String getAppID()
	{
		return this.appID;
	}

	/**
	 * Returns Date of inserte
	 * 
	 * @return String
	 */
	public String getDOI()
	{
		return this.doi;
	}

	/**
	 * Returns Date of Move/Modification
	 * 
	 * @return String
	 */
	public String getDOM()
	{
		return this.dom;
	}

	/**
	 * Returns Message Header
	 * 
	 * @return String
	 */
	public String getMessageHeader()
	{
		return this.msgHeader;
	}

	/**
	 * Returns Message Body
	 * 
	 * @return String
	 */
	public String getMessageBody()
	{
		return this.msgBody;
	}

	/**
	 * Returns Status of the Message
	 * 
	 * @return String
	 */
	public String getStatus()
	{
		return this.status;
	}

	/**
	 * Sets the message ID
	 * 
	 * @param messageid String
	 */
	public void setMessageID(String messageid)
	{
		if (messageid != null)
		{
			this.messageID = messageid;
		}
	}

	/**
	 * Sets Application ID
	 * 
	 * @param appid String
	 */
	public void setAppID(String appid)
	{
		if (appid != null)
		{
			this.appID = appid;
		}
	}

	/**
	 * Sets Date of Insert String in DD/MM/YYYY Format
	 * 
	 * @param DOI String
	 */
	public void setDOI(String DOI)
	{
		if (DOI != null)
		{
			this.doi = DOI;
		}
	}

	/**
	 * Sets date of move/modification in DD/MM/YYYY Format
	 * 
	 * @param DOM String
	 */
	public void setDOM(String DOM)
	{
		if (DOM != null)
		{
			this.dom = DOM;
		}
	}

	/**
	 * Sets Message Header
	 * 
	 * @param msghdr String
	 */
	public void setMessageHeader(String msghdr)
	{
		if (msghdr != null)
		{
			this.msgHeader = msghdr;
		}
	}

	/**
	 * Sets Message Body
	 * 
	 * @param msgbody String
	 */
	public void setMessageBody(String msgbody)
	{
		if (msgbody != null)
		{
			this.msgBody = msgbody;
		}
	}

	/**
	 * Sets Message Status
	 * 
	 * @param stat String
	 */
	public void setStatus(String stat)
	{
		if (stat != null)
		{
			this.status = stat;
		}
	}

	/**
	 * Returns Retry Count Value
	 * 
	 * @return int
	 */
	public int getRetryCount()
	{
		return this.retryCount;
	}

	/**
	 * Sets Retry Count Value
	 * 
	 * @param retrycnt int
	 */
	public void setRetryCount(int retrycnt)
	{
		this.retryCount = retrycnt;
	}

	/**
	 * Returns Error Code.
	 * 
	 * @return String
	 */
	public String getErrorCode()
	{
		return this.errorCode;
	}

	/**
	 * Sets Error Code
	 * 
	 * @param errcd String
	 */
	public void setErrorCode(String errcd)
	{
		if (errcd != null)
		{
			this.errorCode = errcd;
		}
	}

	/**
	 * Returns Error Message
	 * 
	 * @return String
	 */
	public String getErrorMessage()
	{
		return this.errorMessage;
	}

	/**
	 * Sets Error Message. If Error Message is morethan 128 chars length, then it truncates the message to 128 Chars
	 * before inserting.
	 * 
	 * @param errmsg String
	 */
	public void setErrorMessage(String errmsg)
	{
		if (errmsg != null)
		{
			if (errmsg.length() > 128)
			{
				this.errorMessage = errmsg.substring(0, 128);
			} else
			{
				this.errorMessage = errmsg;
			}
		} else
		{
			this.errorMessage = "";
		}
	}

	/**
	 * Checks if the current workdata object is valid or not. Minimumly it should contain APPID
	 * 
	 * @return boolean
	 */
	public boolean isValid()
	{
		if ((appID == null) || (appID.trim().equals("")))
		{
			return false;
		} else
		{
			return true;
		}
	}

	/**
	 * Overrided String method that returns APPID, Message Id and Message Header.
	 * 
	 * @return String
	 */
	public String toString()
	{
		return "AppID = " + appID + ";MessageID=" + messageID + ";MessageHeader=" + msgHeader;
	}

}
