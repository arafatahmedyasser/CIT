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
package com.intellectdesign.canvas.common;

import java.util.HashMap;

import com.intellectdesign.canvas.value.IUserValue;
/**
 * This class is for ReplyObject
 * 
 * @version 1.0
 */
public class ReplyObject implements java.io.Serializable
{

	/**
	 * Internal constant for serialization
	 */
	private static final long serialVersionUID = 6160808039328917137L;

	public String sHeader[];
	public String sRepeater[][];
	public String sFooter[];
	public String sErrTxn[];

	public String[] woEnt;
	public HashMap newSession;
	public IUserValue userValue;
	public Object responseObject;
	public String processDateTime;
	// Variable introduced newly for preemptive access check. This will hold the user no who placed the lock on the
	// given txn.
	public String lockedUserNo;
	// Variable introduced newly for preemptive access check. This will hold the action that is being performed on the
	// given txn.
	public String actionBeingPerformed;

	/**
	 * This is a helper method called from ExtReplyObject which initializes the current object from the argument
	 * provided
	 * 
	 * @param reply The object from which initialization should be done.
	 */
	protected void initializeFrom(ReplyObject reply)
	{
		this.sHeader = reply.sHeader;
		this.sRepeater = reply.sRepeater;
		this.sFooter = reply.sFooter;
		this.sErrTxn = reply.sErrTxn;
		this.woEnt = reply.woEnt;
		this.newSession = reply.newSession;
		this.userValue = reply.userValue;
		this.responseObject = reply.responseObject;
		this.processDateTime = reply.processDateTime;
		this.lockedUserNo = reply.lockedUserNo;
		this.actionBeingPerformed = reply.actionBeingPerformed;
	}

	/**
	 * Returns String representation of ReplyObject
	 * 
	 * @return String
	 */
	public String toString()
	{

		StringBuffer buf = new StringBuffer();

		if (sHeader != null && sHeader.length > 0)
		{
			buf.append("Header : <");
			toString(buf, sHeader);
			buf.append(">\n");
		} else
		{
			buf.append("Header : <>\n");
		}

		if (sRepeater != null && sRepeater.length > 0)
		{

			buf.append("Repeater : <");
			for (int i = 0; i < sRepeater.length; i++)
			{

				buf.append("<");
				toString(buf, sRepeater[i]);
				buf.append(">\n");
			}
			buf.append(">\n");

		} else
		{
			buf.append("Repeater : <>\n");
		}

		if (sFooter != null && sFooter.length > 0)
		{
			buf.append("Footer : <");
			toString(buf, sFooter);
			buf.append(">\n");
		} else
		{
			buf.append("Footer : <>\n");
		}

		if (sErrTxn != null && sErrTxn.length > 0)
		{
			buf.append("Error : <");
			toString(buf, sErrTxn);
			buf.append(">\n");
		} else
		{
			buf.append("Error : <>\n");
		}

		if (processDateTime != null)
		{
			buf.append(" processDateTime: <");
			buf.append(processDateTime);
			buf.append(">\n");
		} else
		{
			buf.append("processDateTime : <>\n");
		}

		if (lockedUserNo != null)
		{
			buf.append(" lockedUserNo: <");
			buf.append(lockedUserNo);
			buf.append(">\n");
		} else
		{
			buf.append("lockedUserNo : <>\n");
		}

		if (actionBeingPerformed != null)
		{
			buf.append(" actionBeingPerformed: <");
			buf.append(actionBeingPerformed);
			buf.append(">\n");
		} else
		{
			buf.append("actionBeingPerformed : <>\n");
		}

		return buf.toString();
	}

	/**
	 * method that takes data from array and puts into stringbuffer
	 * 
	 * @param buf (Stringbuffer) where the data will be put
	 * @param strArray(String[]) from where the data will be taken
	 */

	private void toString(StringBuffer buf, String[] strArray)
	{

		if (strArray != null)
		{

			for (int i = 0; i < strArray.length; i++)
			{
				if (i != 0)
					buf.append(",");
				buf.append((strArray[i] == null) ? "null" : strArray[i]);
			}
		}
	}

}
