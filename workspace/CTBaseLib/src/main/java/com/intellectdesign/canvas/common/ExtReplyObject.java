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

import java.util.ArrayList;
import java.util.HashMap;

/**
 * This class is for ExtReplyObject contains
 * 
 * @version 1.0
 */

public class ExtReplyObject extends ReplyObject
{

	/**
	 * Generated constant for serialization purposes. Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -470345508509697796L;

	public HashMap headerMap = null;
	public ArrayList repeaterMaps = null;
	public String forwardCode = null;

	public ExtReplyObject()
	{
		// Added default constructor for supporting copy / initialize constructor with base class
	}

	/**
	 * Overloaded constructor which initializes the data from the Reply object
	 * 
	 * @param reply The reply object from which data has to be initialized.
	 */
	public ExtReplyObject(ReplyObject reply)
	{
		this.initializeFrom(reply);
		if (reply instanceof ExtReplyObject)
		{
			ExtReplyObject extObj = (ExtReplyObject) reply;
			this.headerMap = extObj.headerMap;
			this.repeaterMaps = extObj.repeaterMaps;
			this.forwardCode = extObj.forwardCode;
		}
	}

	/**
	 * Returns String representation of ExtReplyObject
	 * 
	 * @return all values in String
	 */
	public String toString()
	{

		StringBuffer buf = new StringBuffer(super.toString());

		if (headerMap != null && headerMap.size() > 0)
		{
			buf.append("headerMap : <");
			buf.append(headerMap.toString());
			buf.append(">\n");
		} else
		{
			buf.append("headerMap : <>\n");
		}

		if (repeaterMaps != null && repeaterMaps.size() > 0)
		{
			buf.append("repeaterMaps : <");
			buf.append(repeaterMaps.toString());
			buf.append(">\n");
		} else
		{
			buf.append("repeaterMaps : <>\n");
		}

		if (forwardCode != null)
		{
			buf.append("forwardCode : <");
			buf.append(forwardCode);
			buf.append(">\n");
		} else
		{
			buf.append("forwardCode : <>\n");
		}

		return buf.toString();
	}

}
