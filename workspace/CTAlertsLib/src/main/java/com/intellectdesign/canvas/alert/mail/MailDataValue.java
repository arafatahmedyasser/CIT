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

import com.intellectdesign.canvas.alert.handler.AlertConstants;

/** 
 * This class acts as value object while passing parameter to store mail.
 *  
 * @version 1.0
 */
public class MailDataValue
{
	private String toID = null;
	private String body = null;
	private String fromId = null;
	private String subject = null;
	private String replyTo = null;
	private String cc = null;
	private String bcc = null;
	private String path = null;
	private String bulk = null;
	private String status = null;
	private String passwordProtected = null;
	private String inputDate=null;
	private String refNo=null;
	private String fromUserNo = null;
	private String fromGcif = null;
	private String mailDate = null;
	private String toUserNo = null;
	private String toGcif = null;
	private String gcif=null;
	private String fromUserName=null;
	private String fromCustName=null;
	private String toUserName=null;
	private String txtCorporateGCIF=null;
	private String select=null;
	private String subProduct=null;
	private String langCode=null;

	/**
	 * This method is used to get toID
	 * 
	 * @return Returns the toID
	 */

	public String gettoID()
	{
		return toID;
	}

	/**
	 * This method is used to set toID
	 * 
	 * @param toID to set
	 */

	public void settoID(String toID)
	{
		this.toID = toID;
	}

	/**
	 * This method is used to get body
	 * 
	 * @return Returns the body
	 */

	public String getbody()
	{
		return body;
	}

	/**
	 * This method is used to set body
	 * 
	 * @param body to set
	 */

	public void setbody(String body)
	{
		if(body!=null)
			body=body.replaceAll("\\\\", "\\\\\\\\");
		this.body = body;
	}

	/**
	 * This method is used to get fromId
	 * 
	 * @return Returns fromId
	 */

	public String getfromId()
	{
		return fromId;
	}

	/**
	 * This method is used to set fromId
	 * 
	 * @param fromId to set
	 */

	public void setfromId(String fromId)
	{
		this.fromId = fromId;
	}

	/**
	 * This method is used to get subject
	 * 
	 * @return Returns subject
	 */

	public String getsubject()
	{
		return subject;
	}

	/**
	 * This method is used to set subject
	 * 
	 * @param subject to set
	 */

	public void setsubject(String subject)
	{
		this.subject = subject;
	}

	/**
	 * This method is used to get replyTo
	 * 
	 * @return Returns replyTo
	 */

	public String getreplyTo()
	{
		return replyTo;
	}

	/**
	 * This method is used to set replyTo
	 * 
	 * @param replyTo to set
	 */

	public void setreplyTo(String replyTo)
	{
		this.replyTo = replyTo;
	}

	/**
	 * This method is used to get CC
	 * 
	 * @return Returns CC
	 */

	public String getCC()
	{
		return cc;
	}

	/**
	 * This method is used to set CC
	 * 
	 * @param CC to set
	 */

	public void setCC(String cc)
	{
		this.cc = cc;
	}

	/**
	 * This method is used to get BCC
	 * 
	 * @return Returns BCC
	 */

	public String getBCC()
	{
		return bcc;
	}

	/**
	 * This method is used to set BCC
	 * 
	 * @param BCC to set
	 */

	public void setBCC(String bcc)
	{
		this.bcc = bcc;
	}

	/**
	 * This method is used to get path
	 * 
	 * @return Returns path
	 */

	public String getpath()
	{
		return path;
	}

	/**
	 * This method is used to set path
	 * 
	 * @param path to set
	 */

	public void setpath(String path)
	{
		this.path = path;
	}

	/**
	 * This method is used to get bulk
	 * 
	 * @return Returns bulk
	 */

	public String getbulk()
	{
		return bulk;
	}

	/**
	 * This method is used to set bulk
	 * 
	 * @param bulk to set
	 */

	public void setbulk(String bulk)
	{
		this.bulk = bulk;
	}
	

	/** 
	 * This method is used to get the to id.
	 * 
	 * @return the toID
	 */
	public String getToID()
	{
		return toID;
	}

	/**
	 * This method is to set the to id.
	 * 
	 * @param toID the toID to set
	 */
	public void setToID(String toID)
	{
		this.toID = toID;
	}

	/**
	 * This method is used to get the mail body.
	 * 
	 * @return the body
	 */
	public String getBody()
	{
		return body;
	}

	/**
	 * This method is used to set the mail body.
	 * 
	 * @param body the body to set
	 */
	public void setBody(String body)
	{
		this.body = body;
	}

	/**
	 * This method is used to get the form id.
	 * 
	 * @return the fromId
	 */
	public String getFromId()
	{
		return fromId;
	}

	/**
	 * This method is used to set the form id.
	 * 
	 * @param fromId the fromId to set
	 */
	public void setFromId(String fromId)
	{
		this.fromId = fromId;
	}

	/**
	 * This method is used to get the mail subject.
	 * 
	 * @return the subject
	 */
	public String getSubject()
	{
		return subject;
	}

	/**
	 * This method is used to set the mail subject.
	 * 
	 * @param subject the subject to set
	 */
	public void setSubject(String subject)
	{
		this.subject = subject;
	}

	/**
	 * This method is used to set the replyTo. 
	 * 
	 * @return the replyTo
	 */
	public String getReplyTo()
	{
		return replyTo;
	}

	/**
	 * This method is used to set the replyTo.
	 * 
	 * @param replyTo the replyTo to set 
	 */
	public void setReplyTo(String replyTo)
	{
		this.replyTo = replyTo;
	}

	/**
	 * This method is used to get the cc.
	 * 
	 * @return the cc
	 */
	public String getCc()
	{
		return cc;
	}

	/**
	 * This method is used to set the cc.
	 * 
	 * @param cc the cc to set
	 */
	public void setCc(String cc)
	{
		this.cc = cc;
	}

	/**
	 * This method is used to get the bcc.
	 * 
	 * @return the bcc
	 */
	public String getBcc()
	{
		return bcc;
	}

	/**
	 * This method is used to set the bcc.
	 * 
	 * @param bcc the bcc to set
	 */
	public void setBcc(String bcc)
	{
		this.bcc = bcc;
	}

	/**
	 * This method is used to get the path.
	 * 
	 * @return the path
	 */
	public String getPath()
	{
		return path;
	}

	/**
	 * This method is used to set the path.
	 * 
	 * @param path the path to set
	 */
	public void setPath(String path)
	{
		this.path = path;
	}

	/**
	 * This method is used to get the bulk.
	 * 
	 * @return the bulk
	 */
	public String getBulk()
	{
		return bulk;
	}

	/**
	 * This method is used to set the bulk.
	 * 
	 * @param bulk the bulk to set
	 */
	public void setBulk(String bulk)
	{
		this.bulk = bulk;
	}

	/**
	 * This method is used to get the status.
	 * 
	 * @return the status
	 */
	public String getStatus()
	{
		return status;
	}

	/**
	 * This method is used to set the status.
	 * 
	 * @param status the status to set
	 */
	public void setStatus(String status)
	{
		this.status = status;
	}

	/**
	 * This method is used to get the inputDate.
	 * 
	 * @return the inputDate
	 */
	public String getInputDate()
	{
		return inputDate;
	}

	/**
	 * This method is used to set the inputDate.
	 * 
	 * @param inputDate the inputDate to set
	 */
	public void setInputDate(String inputDate)
	{
		this.inputDate = inputDate;
	}

	/**
	 * This method is used to get the refNo.
	 * 
	 * @return the refNo
	 */
	public String getRefNo()
	{
		return refNo;
	}

	/**
	 * This method is used to set the refNo.
	 * 
	 * @param refNo the refNo to set
	 */
	public void setRefNo(String refNo)
	{
		this.refNo = refNo;
	}

	/**
	 * This method is used to get the fromUserNo.
	 * 
	 * @return the fromUserNo
	 */
	public String getFromUserNo()
	{
		return fromUserNo;
	}

	/**
	 * This method is used to set the fromUserNo.
	 * 
	 * @param fromUserNo the fromUserNo to set
	 */
	public void setFromUserNo(String fromUserNo)
	{
		this.fromUserNo = fromUserNo;
	}

	/**
	 * This method is used to get the gcif.
	 * 
	 * @return the fromGcif
	 */
	public String getFromGcif()
	{
		return fromGcif;
	}

	/**
	 * This method is used to get the fromGcif.
	 * 
	 * @param fromGcif the fromGcif to set
	 */
	public void setFromGcif(String fromGcif)
	{
		this.fromGcif = fromGcif;
	}

	/**
	 * This method is used to get the mailDate.
	 * 
	 * @return the mailDate
	 */
	public String getMailDate()
	{
		return mailDate;
	}

	/**
	 * This method is used to set the mailDate.
	 * 
	 * @param mailDate the mailDate to set
	 */
	public void setMailDate(String mailDate)
	{
		this.mailDate = mailDate;
	}

	/**
	 * This method is used to get the toUserNo.
	 * 
	 * @return the toUserNo
	 */
	public String getToUserNo()
	{
		return toUserNo;
	}

	/**
	 * This method is used to set the toUserNo.
	 * 
	 * @param toUserNo the toUserNo to set
	 */
	public void setToUserNo(String toUserNo)
	{
		this.toUserNo = toUserNo;
	}

	/**
	 * This method is used to get the toGcif.
	 * 
	 * @return the toGcif
	 */
	public String getToGcif()
	{
		return toGcif;
	}

	/**
	 * This method is used to get the toGcif.
	 * 
	 * @param toGcif the toGcif to set
	 */
	public void setToGcif(String toGcif)
	{
		this.toGcif = toGcif;
	}

	/**
	 * This method is used to get the Gcif.
	 * 
	 * @return the gcif
	 */
	public String getGcif()
	{
		return gcif;
	}

	/**
	 * This method is used to set the Gcif.
	 * 
	 * @param gcif the gcif to set
	 */
	public void setGcif(String gcif)
	{
		this.gcif = gcif;
	}

	/**
	 * This method is used to get the fromUserName.
	 * 
	 * @return the fromUserName
	 */
	public String getFromUserName()
	{
		return fromUserName;
	}

	/**
	 * This method is used to set the fromUserName.
	 * 
	 * @param fromUserName the fromUserName to set
	 */
	public void setFromUserName(String fromUserName)
	{
		this.fromUserName = fromUserName;
	}

	/**
	 * This method is used to get the fromCustName.
	 * 
	 * @return the fromCustName
	 */
	public String getFromCustName()
	{
		return fromCustName;
	}

	/**
	 * This method is used to get the fromCustName.
	 * 
	 * @param fromCustName the fromCustName to set
	 */
	public void setFromCustName(String fromCustName)
	{
		this.fromCustName = fromCustName;
	}

	/**
	 * This method is used to get the toUserName.
	 * 
	 * @return the toUserName
	 */
	public String getToUserName()
	{
		return toUserName;
	}

	/**
	 * This method is used to set the toUserName.
	 * 
	 * @param toUserName the toUserName to set
	 */
	public void setToUserName(String toUserName)
	{
		this.toUserName = toUserName;
	}

	/**
	 * This method is used to get the txtCorporateGCIF.
	 * 
	 * @return the txtCorporateGCIF
	 */
	public String getTxtCorporateGCIF()
	{
		return txtCorporateGCIF;
	}

	/**
	 * This method is used to set the txtCorporateGCIF.
	 * 
	 * @param txtCorporateGCIF the txtCorporateGCIF to set
	 */
	public void setTxtCorporateGCIF(String txtCorporateGCIF)
	{
		this.txtCorporateGCIF = txtCorporateGCIF;
	}

	/**
	 * @return the select
	 */
	public String getSelect()
	{
		return select;
	}

	/**
	 * @param select the select to set
	 */
	public void setSelect(String select)
	{
		this.select = select;
	}

	/**
	 * @return the subProduct
	 */
	public String getSubProduct()
	{
		return subProduct;
	}

	/**
	 * @param subProduct the subProduct to set
	 */
	public void setSubProduct(String subProduct)
	{
		this.subProduct = subProduct;
	}

	/**
	 * @return the langCode
	 */
	public String getLangCode()
	{
		return langCode;
	}

	/**
	 * @param langCode the langCode to set
	 */
	public void setLangCode(String langCode)
	{
		this.langCode = langCode;
	}

	/**
	 * @return the passwordProtected
	 */
	public String getPasswordProtected()
	{
		return passwordProtected;
	}

	/**
	 * This method is Used to check whether the passwordProtected enabled or not.
	 * 
	 * @return boolean - if passwordProtected is enabled it will be true otherwise false.
	 */
	public boolean isPasswordProtected()
	{
		return (getPasswordProtectedValue() != null && getPasswordProtectedValue().equals(AlertConstants.YES_Y)) ? true
				: false;
	}

	/**
	 * This method is used for Setting the passwordProtected value.
	 * 
	 * @param passwordProtected - Possible values are 'Y' and 'N'
	 */
	public void setPasswordProtected(String passwordProtected)
	{
		this.passwordProtected = passwordProtected;
	}

	/**
	 * This method is used to Get the passwordProtected value.
	 * 
	 * @return String - Possible values are 'Y' and 'N'
	 */
	public String getPasswordProtectedValue()
	{
		return (passwordProtected != null && passwordProtected.trim().length() > 0) ? passwordProtected
				: AlertConstants.YES_Y;
	}

}
