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

package com.intellectdesign.canvas.alert.mail;

/**
 * This class implements java.io.Serializable. 
 * This class contains the master data, which will be used in {@link SmtpChannelHandler} for sending mails  
 * 
 * @version 1.0
 */
public class MailMasterValue implements java.io.Serializable
{
	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;
	private String toID;
	private String content;
	private String fromID;
	private String subject;
	private String replyTo;
	private int refId;
	private String mailType;

	public MailMasterValue()
	{
	}

	/**
	 * This method sets the Mail To ID.
	 * 
	 * @param toID - String value of the To Mail address
	 * 
	 */
	public void setToID(java.lang.String toID)
	{
		this.toID = toID;
	}

	/**
	 * This method gets the To Mail address
	 * 
	 * @return toID - String value of the To Mail address
	 */
	public java.lang.String getToID()
	{
		return toID;
	}

	/**
	 * This method sets the string value as mail content 
	 * 
	 * @param content - String value of the mail content
	 * 
	 */
	public void setContent(java.lang.String content)
	{
		this.content = content;
	}

	/**
	 * This method gets mail content
	 * 
	 * @return content - String value of the mail content
	 */

	public java.lang.String getContent()
	{
		return content;
	}

	/**
	 * This method sets the From Mail ID 
	 * 
	 * @param fromID - String value of the From Mail Id
	 * 
	 */

	public void setFromID(java.lang.String fromID)
	{
		this.fromID = fromID;
	}

	/**
	 * The gets the From Mail ID 
	 * 
	 * @return fromID - String value of the From Mail Id
	 */

	public java.lang.String getFromID()
	{
		return fromID;
	}

	/**
	 * The method sets the string value as the Mail Subject.
	 * 
	 * @param subject - String value of the Mail Subject
	 * 
	 */

	public void setSubject(java.lang.String subject)
	{
		this.subject = subject;
	}

	/**
	 * This method gets the Mail Subject 
	 * 
	 * @return subject - String value of Mail Subject
	 */

	public java.lang.String getSubject()
	{
		return subject;
	}

	/**
	 * This method sets the  Reply To Mail Id 
	 * 
	 * @param replyTo - String value of the Reply To Mail Id
	 * 
	 */

	public void setReplyTo(java.lang.String replyTo)
	{
		this.replyTo = replyTo;
	}

	/**
	 * The method gets the Reply To Mail Id 
	 * 
	 * @return replyTo - String value of the Reply To Mail Id
	 * 
	 */

	public java.lang.String getReplyTo()
	{
		return replyTo;
	}

	/**
	 * The method sets the Mail Reference ID 
	 * 
	 * @param refId - Integer value of the Reference ID
	 * 
	 */

	public void setRefId(int refId)
	{
		this.refId = refId;
	}

	/**
	 * This method gets the Mail Reference ID
	 * 
	 * @return refId - Integer value of Reference ID 
	 * 
	 */

	public int getRefId()
	{
		return refId;
	}

	/**
	 * This method sets the Mail Type.
	 * 
	 * @param mailType - String value of Mail Type
	 * 
	 */

	public void setMailType(java.lang.String mailType)
	{
		this.mailType = mailType;
	}

	/**
	 * This method gets the Mail Type
	 * 
	 * @return mailType - String value of the Mail Type
	 * 
	 */

	public java.lang.String getMailType()
	{
		return mailType;
	}
}
