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

package com.intellectdesign.canvas.alert.handler;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.alert.inbox.InboxUtility;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This class models and details the message to be sent.
 * 
 * @version 1.0
 */
public class Message implements IMessage
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -6343555117557406593L;

	/**
	 * This method gets the Detailed Message from the message object
	 * 
	 * @return sDetailedMessage String value of the detailed message
	 */
	public String getDetailedMessage()
	{
		return sDetailedMessage;
	}

	/**
	 * This method sets the given string as Detailed Message to the message object
	 * 
	 * @param detailedMessage String value of the detailed message (message max length: 400 chars)
	 */
	public void setDetailedMessage(String detailedMessage)
	{
		sDetailedMessage = detailedMessage;
	}

	/**
	 * This method gets the short message from the message object
	 * 
	 * @return sShortMessage String value of the short message 
	 */
	public String getShortMessage()
	{
		return sShortMessage;
	}

	/**
	 * This method sets the given string as Short Message to the message object
	 * 
	 * @param shortMessage String value of the short message (mMessage max length:200 chars)
	 */
	public void setShortMessage(String shortMessage)
	{
		sShortMessage = shortMessage;
	}

	/**
	 * This method returns true or false after checking whether all the associated action is completed or not
	 * 
	 * @return bAssociatedActionCompleted true if the action is completed otherwise false
	 */
	public boolean isAssociatedActionCompleted()
	{
		return bAssociatedActionCompleted;
	}

	/**
	 * This method sets true or false on the message after checking whether the associated action is completed or not
	 * 
	 * @param associatedActionCompleted boolean value 
	 */
	public void setAssociatedActionCompleted(boolean associatedActionCompleted)
	{
		bAssociatedActionCompleted = associatedActionCompleted;
	}

	/**
	 * This method retruns true or false after checking whether a message is deleted or not
	 * 
	 * @return bDeleted true if the message is deleted or false
	 */
	public boolean isDeleted()
	{
		return bDeleted;
	}

	/**
	 * This method sets true if the message is deleted or false if not deleted
	 * 
	 * @param deleted boolean value 
	 */
	public void setDeleted(boolean deleted)
	{
		bDeleted = deleted;
	}

	/**
	 * This method returns true or false after checking whether a message is a Draft or not
	 * 
	 * @return the bDraft
	 */
	public boolean isDraft()
	{
		return bDraft;
	}

	/**
	 * This method sets true for the draft messages and false for the sent messages 
	 * 
	 * @param draft boolean value
	 */
	public void setDraft(boolean draft)
	{
		bDraft = draft;
	}

	/**
	 * This method returns true if the message is read or false if unread
	 * 
	 * @return bRead true if the message is read otherwise false
	 */
	public boolean isRead()
	{
		return bRead;
	}

	/**
	 * This method sets true if the message is read or false 
	 * 
	 * @param read Boolean value 
	 */
	public void setRead(boolean read)
	{
		bRead = read;
	}

	/**
	 * This method returns the severity of the message
	 * 
	 * @return Severity Severity object that contains the severity of the message 
	 */
	public Severity getSeverity()
	{
		return severity;
	}

	/**
	 * This method sets the severity of the message
	 * 
	 * @param severity Severity object that specifies the severity of the message
	 */
	public void setSeverity(Severity severity)
	{
		this.severity = severity;
	}

	/**
	 * This method returns the GCIF of the message
	 * 
	 * @return sGCIF String value of the GCIF ID
	 * 
	 */
	public String getGCIF()
	{
		return sGCIF;
	}

	/**
	 * This method sets the given value as GCIF ID
	 * 
	 * @param sgcif String value of the sGCIF 
	 */
	public void setGCIF(String sgcif)
	{
		sGCIF = sgcif;
	}

	/**
	 * This method returns the MessageId
	 * 
	 * @return sMessageId String value of the mesasge Id of the object
	 */
	public String getMessageId()
	{
		return sMessageId;
	}

	/**
	 * This method sets the MessageId of the current Message object
	 * 
	 * @param sMessageId String value of the Message Id
	 */
	public void setMessageId(String sMessageId)
	{
		this.sMessageId = sMessageId;
	}

	/**
	 * This method returns the Sender of the message
	 * 
	 * @return sSender String value of the message sender
	 */
	public String getSender()
	{
		return sSender;
	}

	/**
	 * This method sets the sender name of the message to the message object
	 * 
	 * @param sSender String value of the message sender Id
	 */
	public void setSender(String sSender)
	{
		this.sSender = sSender;
	}

	/**
	 * This method returns the TimeStamp of message delivered  
	 * 
	 * @return MessageTimeStamp Date object of the message delivery timestampe
	 */
	public Date getMessageTimeStamp()
	{
		return dtMessageTimeStamp;
	}

	/**
	 * This method sets set the date stampd of the message delivered 
	 * 
	 * @param dtMessageTimeStamp Date object of the time at which the mesage is delivered
	 */
	public void setMessageTimeStamp(Date dtMessageTimeStamp)
	{
		this.dtMessageTimeStamp = dtMessageTimeStamp;
		if (dtMessageTimeStamp != null)
		{
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss aaa");
			strMessageTimeStamp = simpleDateFormat.format(dtMessageTimeStamp);
		}
	}

	/**
	 * This method returns true or false after checking whether a message is archived or not
	 * 
	 * @return isArchived true if the mesasge is archived already or false value
	 */
	public boolean isArchived()
	{
		return isArchived;
	}

	/**
	 * This method sets true for a message if it is archived already or false if not archived
	 * 
	 * @param isArchived true if archived or false 
	 */
	public void setArchived(boolean isArchived)
	{
		this.isArchived = isArchived;
	}

	/**
	 * This method returns true if the message is already formatted according 
	 * to the definition in the message template file otherwise returns false
	 * 
	 * @return isFormatted true if formatted or false
	 */
	public boolean isFormatted()
	{
		return isFormatted;
	}

	/**
	 * This method sets true or false after checking whether the message is formatted according 
	 * to the message definition in the message template file 
	 * 
	 * 
	 * @param isFormatted true if formatted otherwise false
	 */
	public void setFormatted(boolean isFormatted)
	{
		this.isFormatted = isFormatted;
	}

	/**
	 * This method returns true or false after checking whether the message is notified or not
	 * 
	 * @return isNotified true if notified otherwise false
	 */

	public boolean isNotified()
	{
		return isNotified;
	}

	/**
	 * This method sets true if the message is notified already otherwise false
	 * 
	 * @param isNotified boolean value
	 */

	public void setNotified(boolean isNotified)
	{
		this.isNotified = isNotified;
	}

	/**
	 * This method returns the the Alert Id of a message
	 * 
	 * @return AlertId String value of the Alert id of the message
	 */

	public String getAlertId()
	{
		return sAlertId;
	}

	/**
	 * This method sets the Alert Id to the message object
	 * 
	 * @param AlertId String value of the Alert Id
	 */
	public void setAlertId(String sAlertId)
	{
		this.sAlertId = sAlertId;
	}

	/**
	 * To get the Duration
	 * 
	 * @return SDurationTime String value of duration
	 */
	public String getDuration()
	{
		return sDurationTime;
	}

	/**
	 * To set the Duration
	 * 
	 * @param Duration String value of duration 
	 */
	public void setDuration(String sDurationTime)
	{
		this.sDurationTime = sDurationTime;
	}

	/**
	 * This method returns the channel name of the message
	 * 
	 * @return sChannelName String value of the Channel Name
	 */
	public String getChannelName()
	{
		return sChannelName;
	}

	/**
	 * This method sets the Channel Name of the message
	 * 
	 * @param ChannelName String value of the Channel Name 
	 */
	public void setChannelName(String sChannelName)
	{
		this.sChannelName = sChannelName;
	}

	/**
	 * This method gets the Product Code of the message
	 * 
	 * @return sProductCode String value of the Product Code
	 */
	public String getProductCode()
	{
		return sProductCode;
	}

	/**
	 * This method sets the the Product Code of the message
	 * 
	 * @param sProductCode String value of the Product Code 
	 */
	public void setProductCode(String sProductCode)
	{
		this.sProductCode = sProductCode;
	}

	/**
	 * This method gets the Sub Product Code of the message 
	 * 
	 * @return the Sub Product Code 
	 */
	public String getSubProdCode()
	{
		return sSubProdCode;
	}

	/**
	 * This method sets the Sub Product Code to the message
	 * 
	 * @param SubProdCode String value of the Sub Product Code 
	 */
	public void setSubProdCode(String sSubProdCode)
	{
		this.sSubProdCode = sSubProdCode;
	}

	/**
	 * This method gets the Function Code of the message
	 * 
	 * @return sFunctionCode String value of the Function Code
	 */
	public String getFunctionCode()
	{
		return sFunctionCode;
	}

	/**
	 * This method sets the Function Code to the message
	 * 
	 * @param sFunctionCode String value of the FunctionCode 
	 */
	public void setFunctionCode(String sFunctionCode)
	{
		this.sFunctionCode = sFunctionCode;
	}

	/**
	 * This method gets the string value of the message created timestamp
	 * 
	 * @return StrMessageTimeStamp String value of the date and time at when the message was created
	 */
	public String getStrMessageTimeStamp()
	{
		return strMessageTimeStamp;
	}

	/**
	 * To get the ProductDispval
	 * 
	 * @return the ProductDispval
	 */
	public String getProductDispval()
	{
		return sProductDispval;
	}

	/**
	 * To set the ProductDispval
	 * 
	 * @param ProductDispval the ProductDispval to set
	 */
	public void setProductDispval(String productDispval)
	{
		sProductDispval = productDispval;
	}

	/**
	 * To get the EnrichCcy
	 * 
	 * @return the mEnrichCcy
	 */
	public String getEnrichCcy()
	{
		return mEnrichCcy;
	}

	/**
	 * To set the EnrichCcy
	 * 
	 * @param enrichCcy the mEnrichCcy to set
	 */
	public void setEnrichCcy(String enrichCcy)
	{
		mEnrichCcy = enrichCcy;
	}

	/**
	 * To get the EnrichSubProduct
	 * 
	 * @return the mEnrichSubProduct
	 */
	public String getEnrichSubProduct()
	{
		return mEnrichSubProduct;
	}

	/**
	 * To set the EnrichSubProduct
	 * 
	 * @param enrichSubProduct the mEnrichSubProduct to set
	 */
	public void setEnrichSubProduct(String enrichSubProduct)
	{
		mEnrichSubProduct = enrichSubProduct;
	}

	/**
	 * To get the EnrichBranchName
	 * 
	 * @return the mEnrichBranchName
	 */
	public String getEnrichBranchName()
	{
		return mEnrichBranchName;
	}

	/**
	 * To set the EnrichBranchName
	 * 
	 * @param enrichBranchName the mEnrichBranchName to set
	 */
	public void setEnrichBranchName(String enrichBranchName)
	{
		mEnrichBranchName = enrichBranchName;
	}

	/**
	 * To get the EnrichBankName
	 * 
	 * @return the mEnrichBankName
	 */
	public String getEnrichBankName()
	{
		return mEnrichBankName;
	}

	/**
	 * To set the EnrichBankName
	 * 
	 * @param enrichBankName the mEnrichBankName to set
	 */
	public void setEnrichBankName(String enrichBankName)
	{
		mEnrichBankName = enrichBankName;
	}

	/**
	 * To get the EnrichCountryName
	 * 
	 * @return the mEnrichCountryName
	 */
	public String getEnrichCountryName()
	{
		return mEnrichCountryName;
	}

	/**
	 * To set the EnrichCountryName
	 * 
	 * @param enrichCountryName the mEnrichCountryName to set
	 */
	public void setEnrichCountryName(String enrichCountryName)
	{
		mEnrichCountryName = enrichCountryName;
	}

	/**
	 * To set the hasAttachment
	 * 
	 * @param hasAttachment the attachment to set
	 */
	public void setHasAttachment(String hasAttachment)
	{
		sHasAttachment = hasAttachment;
	}

	/**
	 * To get the HasAttachment
	 * 
	 * @return the HasAttachment
	 */
	public String getHasAttachment()
	{
		return sHasAttachment;
	}

	/**
	 * This method parses the given string date to produce the date in dd/mm/yyyy format
	 * 
	 * @param StrMessageTimeStamp String value of the date
	 * 
	 */
	public void setStrMessageTimeStamp(String strMessageTimeStamp)
	{
		this.strMessageTimeStamp = strMessageTimeStamp;
		if (strMessageTimeStamp != null && !"".equals(strMessageTimeStamp))
		{
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			try
			{
				dtMessageTimeStamp = simpleDateFormat.parse(strMessageTimeStamp);
			} catch (ParseException pException)
			{
				logger.cterror("CTALT00122", pException);
				dtMessageTimeStamp = null;
			}
		}
	}

	/**
	 * This method formats message short and detailed messages in the given locale
	 * 
	 * @param sData String value of the message data
	 * @param sLocale string value of the language locale id
	 * 
	 */
	public void formatMessage(String sData, String sLocale)
	{
		InboxUtility inboxUtility = new InboxUtility();
		HashMap hmData = inboxUtility.formDataMap(sData, sAlertId, sLocale);
		MessageFormatterImpl messageFormatter = new MessageFormatterImpl();
		// The key to get the short message template is formed using the Alert Id, Channel Id and the constant
		// AlertConstants.SHORT_DESCRIPTION_TEMPLATE.
		String sShortMsgTemplateKey = new StringBuffer(sAlertId).append(sChannelName)
				.append(AlertConstants.SHORT_DESCRIPTION_TEMPLATE).toString();
		// The key to get the detailed message template is formed using the Alert Id, Channel Id and the constant
		// AlertConstants.DETAILED_DESCRIPTION_TEMPLATE.
		String sDetailedMsgTemplateKey = new StringBuffer(sAlertId).append(sChannelName)
				.append(AlertConstants.DETAILED_DESCRIPTION_TEMPLATE).toString();
		// Get the short message
		sShortMessage = messageFormatter.format(sPropertyFileName, sShortMsgTemplateKey, sLocale, hmData);
		/**
		 * This block is added only for SMTP channel such that the template for
		 * alerts mail is being framed in this block along with the mail data to 
		 * be sent to end-users.
		 */
		if(sChannelName.equalsIgnoreCase(AlertConstants.SMTP)){
			PropertyReader templatePrptReader = new PropertyReader("mail_templates_"+sLocale);
			AlertHandlerInstruction instr = null;
			List retrievedData = null;
			HashMap alertDetailsMap = null;
			String rChannelName = null;
			
			try {
				instr = new AlertHandlerInstruction();
				//Retrieves the template code maintained in db(od_alert_channel_details table)
				retrievedData = instr.getEmailTemplateCode(sAlertId);
				
				if((retrievedData != null) && (!retrievedData.isEmpty())){
					for(int i=0; i<retrievedData.size(); i++){
						alertDetailsMap = (HashMap)retrievedData.get(i);
						rChannelName = checknull((String)alertDetailsMap.get(AlertConstants.CHANNEL_NAME));
						
						if(rChannelName.equalsIgnoreCase(sChannelName)){
							sTemplateCode = checknull((String)alertDetailsMap.get(AlertConstants.EMAIL_TEMPLATE_CODE));
						}
					}
				}
				
				//Key to get mail header template and it is formed using Template Code, Channel name and Alert Id and constant entry in AlertConstants.MAIL_HEADER_TEMPLATE
				sMailHeaderTemplateKey = new StringBuffer(sTemplateCode).append(sChannelName).append(AlertConstants.MAIL_HEADER_TEMPLATE).toString();
				//Retrieved mail header value
				sMailHeaderTemplate = messageFormatter.format(sEmailTempPropertyFileName, sMailHeaderTemplateKey, sLocale, hmData);
				//Key to get mail footer template and it is formed using Template Code, Channel name and Alert Id and constant entry in AlertConstants.MAIL_FOOTER_TEMPLATE
				sMailFooterTemplateKey = new StringBuffer(sTemplateCode).append(sChannelName).append(AlertConstants.MAIL_FOOTER_TEMPLATE).toString();
				//Retrieved mail footer value
				sMailFooterTemplate = messageFormatter.format(sEmailTempPropertyFileName, sMailFooterTemplateKey, sLocale, hmData);
				//Retrieved detailed message which contains Header, Footer & alert message
				sDetailedMessage = sMailHeaderTemplate + messageFormatter.format(sPropertyFileName, sDetailedMsgTemplateKey, sLocale, hmData) + sMailFooterTemplate;
				
			} catch (AlertHandlerException dbExcep) {
				logger.cterror("CTALT00987", dbExcep);				
			}
		}else{
			//Get the detailed Message
			sDetailedMessage = messageFormatter.format(sPropertyFileName, sDetailedMsgTemplateKey, sLocale, hmData);
		}
	}	
	/**
	 * This method formats the message text as per the short description and detail description 
	 * configured in the message template property file
	 * 
	 * @param sData String value of the alert and event data
	 * @param sLocale String value of the locale id 
	 * @param in_sAlertId String value of the input Alert ID
	 * @param in_sChannelName String value of the input Channel Name
	 * 
	 */
	public void formatMessage(String sData, String in_sAlertId, String in_sChannelName, String sLocale)
	{
		InboxUtility inboxUtility = new InboxUtility();
		HashMap hmData = inboxUtility.formDataMap(sData, in_sAlertId, sLocale);
		MessageFormatterImpl messageFormatter = new MessageFormatterImpl();
		// The key to get the short message template is formed using the Alert Id, Channel Id and the constant
		// AlertConstants.SHORT_DESCRIPTION_TEMPLATE.
		String sShortMsgTemplateKey = new StringBuffer(in_sAlertId).append(in_sChannelName)
				.append(AlertConstants.SHORT_DESCRIPTION_TEMPLATE).toString();
		// The key to get the detailed message template is formed using the Alert Id, Channel Id and the constant
		// AlertConstants.DETAILED_DESCRIPTION_TEMPLATE.
		String sDetailedMsgTemplateKey = new StringBuffer(in_sAlertId).append(in_sChannelName)
				.append(AlertConstants.DETAILED_DESCRIPTION_TEMPLATE).toString();
		// Get the short message
		sShortMessage = messageFormatter.format(sPropertyFileName, sShortMsgTemplateKey, sLocale, hmData);
		// Get the detailed Message
		sDetailedMessage = messageFormatter.format(sPropertyFileName, sDetailedMsgTemplateKey, sLocale, hmData);
	}

	/**
	 * This method checks whether the string is null or not
	 * 
	 * @param str
	 * @return String
	 * 
	 */
	public String checknull(String str)
	{
		return str == null ? "" : (str.trim());
	}
	
	private ConfigurationManager confMngr = ConfigurationManager.getInstance();
	private SystemPreferenceDescriptor sysDscr = confMngr.getSystemPrefDescriptor();

	private String sHasAttachment = null;

	private String sShortMessage = null;
	private String sDetailedMessage = null;
	private String sGCIF = null;
	private boolean bDraft = false;
	private boolean bRead = false;
	private boolean bDeleted = false;
	private boolean bAssociatedActionCompleted = false;
	private Severity severity = null;
	private String sMessageId = null;
	private String sSender = null;
	private Date dtMessageTimeStamp = null;
	private String strMessageTimeStamp = null;
	private String sDurationTime = null;
	private boolean isFormatted = false;
	private boolean isArchived = false;
	private boolean isNotified = false;
	private String sAlertId = null;
	private String sChannelName = null;
	private String sPropertyFileName = sysDscr.getAlertTemplateFile();
	private String sProductCode = null;
	private String sSubProdCode = null;
	private String sFunctionCode = null;
	private String sProductDispval = null;

	// Additional fields added for Product specific information that should be displayed in the alert.
	private String mEnrichCcy = null;
	private String mEnrichSubProduct = null;
	private String mEnrichBranchName = null;
	private String mEnrichBankName = null;
	private String mEnrichCountryName = null;

	private String sMailHeaderTemplateKey = null;
	private String sMailHeaderTemplate = null;
	private String sMailFooterTemplateKey = null;
	private String sMailFooterTemplate = null;
	private String sTemplateCode = null;
	
	//email template
	private String sEmailTempPropertyFileName = sysDscr.getEmailTemplateFile();
	private static Logger logger = Logger.getLogger(Message.class);

}
